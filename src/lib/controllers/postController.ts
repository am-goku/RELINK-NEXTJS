import Post from "@/models/Post";
import { BadRequestError, ForbiddenError, NetworkError, NotFoundError } from "../errors/ApiErrors";
import { getUserById, getUserByUsername } from "./userController";
import { connectDB } from "../db/mongoose";
import cloudinary from "../cloudinary/cloudinary";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { IPublicPost, sanitizePost } from "@/utils/sanitizer/post";
import { Types } from "mongoose";

export async function createPost(formData: FormData, user_id: string) {
    await connectDB();

    const content = (formData.get('content') as string || '').trim();
    const hashtagsRaw = (formData.get('hashtags') as string || '').trim();
    const file = formData.get('file') as File | null;

    let image_url: string | null = null;

    // Uploading image to Cloudinary
    if (file) {
        try {
            const buffer = Buffer.from(await file.arrayBuffer());

            const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'posts' },
                    (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                        if (error || !result) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(buffer);
            });
            image_url = uploadResult.secure_url;
        } catch (err) {
            console.log(err)
            throw new NetworkError("Failed to upload image to Cloudinary");
        }
    }

    if (!content && !image_url) {
        throw new BadRequestError('Either content or image is required.');
    }

    const hashtags = hashtagsRaw
        ? hashtagsRaw.split(",").map(tag => tag.trim()).filter(Boolean)
        : [];

    const post = new Post({
        content,
        image: image_url,
        author: new Types.ObjectId(user_id),
        hashtags,
    });

    await post.save();

    // populate directly on the instance
    await post.populate("author", "name username image");

    // Sanitizing post into a safe public format
    return sanitizePost(post);
}


export async function getPosts(page = 1) {
  await connectDB();

  const limit = 15;
  const skip = (page - 1) * limit;

  const posts = await Post.aggregate([
    // Only include non-archived, non-blocked posts
    { $match: { is_archived: false, is_blocked: false } },

    // Join author info
    {
      $lookup: {
        from: "users", // collection name for authors
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },

    // Exclude authors who are private, deleted, or blocked
    {
      $match: {
        "author.accountType": { $ne: "private" },
        "author.deleted": false,
        "author.blocked": false,
      },
    },

    // Randomize order
    { $sample: { size: limit * (page) } }, // sample enough for pagination

    // Sort randomly already, but apply skip/limit for pagination
    { $skip: skip },
    { $limit: limit },

    // Optional: project only required fields
    {
      $project: {
        _id: 1,
        image: 1,
        imageRatio: 1,
        hashtags: 1,
        content: 1,
        comment_count: 1,
        like_count: 1,
        share_count: 1,
        views: 1,
        likes: 1,
        saves:1,
        created_at: 1,
        author: {
          _id: 1,
          name: 1,
          username: 1,
          image: 1,
        },
      },
    },
  ]);

  return posts.map(post => sanitizePost(post));
} // Fetch posts from DB for dashboard

export async function getPostsByUsername(username: string, page = 1, c_user_id: string) {
    await connectDB()

    const user = await getUserByUsername(username);
    if (!user) throw new NotFoundError('User not found');

    const isFollowing = user.followers.some(
        (follower) => follower._id.toString() === c_user_id
    );

    if (user.accountType === "private" && !isFollowing) throw new ForbiddenError('You are not following this user');

    const limit = 15;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
        author: user._id,
        is_archived: false,
        is_blocked: false,
    }).sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "name username image");

    return posts.map(post => sanitizePost(post));
}


export async function getPostsByUserId(userId: string, page = 1, c_user_id: string) {
    await connectDB()

    const user = await getUserById(userId);
    if (!user) throw new NotFoundError('User not found');

    const isFollowing = user.followers.some(
        (follower) => follower._id.toString() === c_user_id
    );

    if (user.accountType === "private" && !isFollowing) throw new ForbiddenError('You are not following this user');

    const limit = 15;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
        author: userId,
        is_archived: false,
        is_blocked: false,
    }).sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "name username image");

    return posts.map(post => sanitizePost(post));
} // Fetch all posts by a user with the User ID (limited to 15 per page)


export async function searchPosts(tag: string | null, page: number = 1) {
    await connectDB();

    const trimmedTag = typeof tag === 'string' ? tag.trim() : '';
    if (!trimmedTag) return [];

    const limit = 15;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
        hashtags: { $regex: `^${trimmedTag}`, $options: 'i' } // prefix match
    })
        .skip(skip)
        .limit(limit);

    return posts.map(post => sanitizePost(post));
}


export async function getPostById(id: string): Promise<IPublicPost> {
    await connectDB();

    const post = await Post.findOne({
        _id: new Types.ObjectId(id),
        is_blocked: { $ne: true },
        is_archived: { $ne: true },
    }).populate('author');

    if (!post) {
        throw new NotFoundError('Post not found');
    }

    const sanitizedPost = sanitizePost(post);

    return sanitizedPost;
}

export async function getSuggestions() {
  await connectDB();

  const posts = await Post.aggregate([
    {
      $match: {
        is_blocked: { $ne: true },
        is_archived: { $ne: true },
        image: {
          $type: "string",
          $nin: ["", "null", "undefined"]
        }
      }
    },
    { $sample: { size: 16 } },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
      }
    },
    { $unwind: "$author" }
  ]);

  return posts.map(sanitizePost) || [];
}
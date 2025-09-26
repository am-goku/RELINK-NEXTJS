import Post from "@/models/Post";
import { BadRequestError, ForbiddenError, NetworkError, NotFoundError } from "../errors/ApiErrors";
import { getUserById, getUserByUsername } from "./userController";
import { connectDB } from "../db/mongoose";
import cloudinary from "../cloudinary/cloudinary";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { IPublicPost, PopulatedPost, sanitizePost } from "@/utils/sanitizer/post";
import { Types } from "mongoose";
import { extractHashtags } from "@/utils/string-utils";

export async function createPost(formData: FormData, user_id: string) {
  await connectDB();

  const content = (formData.get('content') as string || '').trim();
  const file = formData.get('file') as File | null;

  const disableComment = formData.get("disableComment") === "true";
  const disableShare = formData.get("disableShare") === "true";

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

  // Separating Hashtags
  const hashtags = extractHashtags(content);

  const post = new Post({
    content,
    image: image_url,
    author: new Types.ObjectId(user_id),
    hashtags,
    disableComment,
    disableShare
  });

  await post.save();

  // populate directly on the instance
  await post.populate("author", "name username image");

  // Sanitizing post into a safe public format
  return sanitizePost(post);
} // Create a new post

export async function getPosts(page = 1) {
  await connectDB();

  const limit = 15;
  const skip = (page - 1) * limit;

  const result = await Post.aggregate([
    // Step 1: Filter only valid posts
    { $match: { is_archived: false, is_blocked: false } },

    // Step 2: Lookup authors with filtering inside pipeline
    {
      $lookup: {
        from: "users",
        let: { authorId: "$author" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$authorId"] },
                  { $ne: ["$accountType", "private"] },
                  { $eq: ["$deleted", false] },
                  { $eq: ["$blocked", false] }
                ]
              }
            }
          },
          { $project: { _id: 1, name: 1, username: 1, image: 1 } }
        ],
        as: "author"
      }
    },
    { $unwind: "$author" }, // Drop posts without valid authors

    // Step 3: Facet for total count + paginated data
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $sort: { created_at: -1 } }, // stable ordering
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              image: 1,
              imageRatio: 1,
              hashtags: 1,
              content: 1,
              comments: 1,
              like_count: 1,
              share_count: 1,
              views: 1,
              likes: 1,
              saves: 1,
              created_at: 1,
              author: 1
            }
          }
        ]
      }
    }
  ]);

  const totalPosts = result[0]?.metadata[0]?.total || 0;
  const totalPages = Math.ceil(totalPosts / limit);
  const posts = result[0]?.data || [];

  return {
    page,
    totalPages,
    hasMore: page < totalPages,
    posts: posts.map((post: PopulatedPost) => sanitizePost(post))
  };
} // Fetch posts from DB for dashboard

export async function getPostsByUsername(username: string, page = 1, c_user_id: string, isOwner: boolean = false) {
  await connectDB()

  const user = await getUserByUsername(username);
  if (!user) throw new NotFoundError('User not found');

  let isFollowing = true;

  if (!isOwner) {
    isFollowing = user.followers.includes(c_user_id);
  }

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
} // Fetch all posts by a user with the User ID (limited to 15 per page)

export async function getPostsByUserId(userId: string, page = 1, c_user_id: string, isOwner: boolean = false) {
  await connectDB()

  const user = await getUserById(userId);
  if (!user) throw new NotFoundError('User not found');

  let isFollowing = true;

  if (!isOwner) {
    isFollowing = user.followers.includes(c_user_id);
  }

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
} // Search posts by tag

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
} // Get post by ID

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
} // Get suggestions

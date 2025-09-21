import Post from "@/models/Post";
import { BadRequestError, ForbiddenError, NetworkError, NotFoundError } from "../errors/ApiErrors";
import { getUserByUsername } from "./userController";
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

    let image_url: string | undefined;

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
        user: new Types.ObjectId(user_id),
        hashtags,
    });

    await post.save();

    // populate directly on the instance
    await post.populate("user", "name username image");

    // Sanitizing post into a safe public format
    return sanitizePost(post);
}


export async function getPosts(page = 1) {
    await connectDB();

    const limit = 15;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
        is_archived: false,
        is_blocked: false,
    })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name username image');

    return posts.map(post => sanitizePost(post));
}


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
        user: user._id,
        is_archived: false,
        is_blocked: false,
    }).sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name username image");

    return posts.map(post => sanitizePost(post));
}


export async function getPostsByUserId(userId: string, page = 1) {
    await connectDB()

    const limit = 15;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
        user: userId,
        is_archived: false,
        is_blocked: false,
    }).sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name username image");

    return posts.map(post => sanitizePost(post));
}


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
    }).populate('user');

    if (!post) {
        throw new NotFoundError('Post not found');
    }

    const sanitizedPost = sanitizePost(post);

    return sanitizedPost;
}

export async function getSuggesions() {
    await connectDB();

    const posts = await Post.aggregate([
        { $match: { image: { $exists: true, $ne: "" }, is_blocked: { $ne: true }, is_archived: { $ne: true } } },
        { $sample: { size: 9 } },
        { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
        { $unwind: "$user" }
    ]);

    return posts.map(sanitizePost) || [];
}
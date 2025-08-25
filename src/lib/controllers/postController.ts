import Post from "@/models/Post";
import { BadRequestError, ForbiddenError, NetworkError, NotFoundError } from "../errors/ApiErrors";
import { getUserByUsername } from "./userController";
import { connectDB } from "../db/mongoose";
import cloudinary from "../cloudinary/cloudinary";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { SessionUser } from "@/types/instance";
import { sanitizePost } from "@/utils/sanitizer/post";


/**
 * Creates a new post for a given user.
 *
 * Connects to the database and retrieves the user object based on the provided user id.
 * It then creates a new post document and saves it to the database.
 * The post can have an image, content, and hashtags.
 * If the image is provided, it is uploaded to Cloudinary.
 * The post is then sanitized and returned.
 *
 * @param formData - The form data containing the content, image, and hashtags of the post.
 * @param user - The user object that owns the post.
 * @returns The newly created post object, sanitized for public consumption.
 * @throws {BadRequestError} If the either content or image is not provided.
 * @throws {NetworkError} If there is a network error while uploading the image to Cloudinary.
 */
export async function createPost(formData: FormData, user: SessionUser) {

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

    const post = await Post.create({
        content,
        image: image_url,
        user: user.id,
        hashtags,
        likes: [],
        comments: [],
        share_count: 0,
        views: 0,
    });

    // Sanitizing post into a safe public format
    return sanitizePost(post);
}

/**
 * Retrieves a paginated list of posts.
 * 
 * Connects to the database and fetches posts that are not archived or blocked.
 * Results are sorted by creation date in descending order and paginated based on the provided page number.
 * Each post is populated with user information and sanitized before being returned.
 * 
 * @param page - The page number for pagination, defaulting to 1.
 * @returns An array of sanitized post objects.
 */
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

/**
 * Retrieves a paginated list of posts by a specific username.
 * 
 * Connects to the database and fetches posts associated with the given username,
 * excluding posts that are archived or blocked. Results are sorted by creation date
 * in descending order and paginated based on the provided page number.
 * Each post is populated with user information and sanitized before being returned.
 * 
 * @param username - The username of the user whose posts are to be fetched.
 * @param page - The page number for pagination, defaulting to 1.
 * @returns An array of sanitized post objects.
 * @throws {NotFoundError} If the user is not found.
 */
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

/**
 * Retrieves a paginated list of posts by a specific user ID.
 * 
 * Connects to the database and fetches posts associated with the given user ID,
 * excluding posts that are archived or blocked. Results are sorted by creation date
 * in descending order and paginated based on the provided page number.
 * Each post is populated with user information and sanitized before being returned.
 * 
 * @param userId - The unique identifier of the user whose posts are to be fetched.
 * @param page - The page number for pagination, defaulting to 1.
 * @returns An array of sanitized post objects.
 * @throws {NotFoundError} If the user is not found.
 */
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


/**
 * Retrieves a paginated list of posts by a specific hashtag.
 * 
 * Connects to the database and fetches posts associated with the given hashtag,
 * excluding posts that are archived or blocked. Results are sorted by creation date
 * in descending order and paginated based on the provided page number.
 * Each post is populated with user information and sanitized before being returned.
 * 
 * @param tag - The hashtag to search by.
 * @param page - The page number for pagination, defaulting to 1.
 * @returns An array of sanitized post objects.
 */
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
import Post, { IPostDocument } from "@/models/Post";
import { BadRequestError, NotFoundError } from "../errors/ApiErrors";
import { getUserByUsername } from "./userController";
import { IUserDocument } from "@/models/User";
import { connectDB } from "../mongoose";
import cloudinary from "../cloudinary";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { SessionUser } from "@/types/instance";


export async function createPost(formData: FormData, user: SessionUser): Promise<IPostDocument> {

    await connectDB();

    const content = (formData.get('content') as string || '').trim();
    const hashtagsRaw = (formData.get('hashtags') as string || '').trim();
    const image = formData.get('image') as File | null;

    let image_url: string | undefined;

    if (image) {
        const buffer = Buffer.from(await image.arrayBuffer());

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
    }

    if (!content && !image_url) {
        throw new BadRequestError('Either content or image is required.');
    }

    const hashtags = hashtagsRaw
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

    const newPost = new Post({
        content,
        image: image_url,
        user: user.id,
        hashtags,
        likes: [],
        comments: [],
        share_count: 0,
        views: 0,
    });

    await newPost.save();

    return newPost
}

export async function getPosts() {
    await connectDB();

    // Fetch all non-archived, non-blocked posts not created by the current user
    const posts = await Post.find({
        // user: { $ne: authUser.id },
        is_archived: false,
        is_blocked: false,
    })
        .sort({ created_at: -1 }) // Newest first
        .populate('user', 'name username image'); // Only fetch selected fields from User

    // Transform the posts to a safe public format
    const formattedPosts = posts.map(post => ({
        _id: post._id.toString(),
        content: post.content,
        image: post.image,
        likes_count: post.likes.length,
        comments_count: post.comments.length,
        share_count: post.share_count,
        views: post.views,
        hashtags: post.hashtags.join(', '),
        created_at: post.created_at,
        user: {
            _id: post.user._id.toString(),
            name: post.user.name,
            username: post.user.username,
            image: post.user.image,
        },
    }));

    return formattedPosts
}

export async function getPostsByUsername(username: string) {

    await connectDB()

    const user: Partial<IUserDocument> = await getUserByUsername(username);

    if (!user) throw new NotFoundError('User not found'); // Verifying the user

    // Fetch all non-archived, non-blocked posts of a particular user
    const posts = await Post.find({
        user: user._id,
        is_archived: false,
        is_blocked: false,
    }).sort({ created_at: -1 })
        .populate<{ user: Pick<IUserDocument, '_id' | 'name' | 'username' | 'image'> }>(
            'user',
            'name username image'
        ); // Only fetch selected fields from User

    if (!posts || posts.length === 0) throw new NotFoundError('Posts not found')

    // Transform the posts to a safe public format
    const formattedPosts = posts.map((post) => ({
        _id: post._id.toString(),
        content: post.content,
        image: post.image,
        likes_count: post.likes?.length || 0,
        comments_count: post.comments?.length || 0,
        share_count: post.share_count,
        views: post.views,
        hashtags: post.hashtags?.join(', ') || '',
        created_at: post.created_at,
        user: {
            _id: post.user._id.toString(),
            name: post.user.name,
            username: post.user.username,
            image: post.user.image,
        },
    }))

    return formattedPosts;
}
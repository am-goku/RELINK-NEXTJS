import Post from "@/models/Post";
import { NotFoundError } from "../errors/ApiErrors";
import { getUserByUsername } from "./userController";
import { IUserDocument } from "@/models/User";
import { connectDB } from "../mongoose";

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
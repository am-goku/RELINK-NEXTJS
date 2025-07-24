import Post from "@/models/Post";
import { userAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    try {
        await connectDB();
        const { userId } = await params;

        const authUser = await userAuth();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch all non-archived, non-blocked posts of a particular user
        const posts = await Post.find({
            user: userId,
            is_archived: false,
            is_blocked: false,
        }).sort({ created_at: -1 }).populate('user', 'name username image'); // Only fetch selected fields from User


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

        return NextResponse.json({ message: 'Posts fetched successfully', posts: formattedPosts }, { status: 200 });
    } catch (error) {
        console.error('[GET POSTS ERROR]', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
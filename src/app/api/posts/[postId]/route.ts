import Post from "@/models/Post";
import { userAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function GET(_req: NextRequest, context: { params: Promise<{ postId: string }> }) {
    try {
        await connectDB();

        const { postId } = await context.params;

        const post = await Post.findOne({
            _id: postId,
            is_blocked: { $ne: true },
            is_archived: { $ne: true },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: "Post fetched successfully", post }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ postId: string }> }) {
    try {
        await connectDB();

        const authUser = await userAuth();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { postId } = await context.params;
        const body = await req.json();

        const updateData: Record<string, string | string[] | boolean> = {};

        if (typeof body.content === 'string') {
            updateData.content = body.content.trim();
        }

        if (typeof body.hashtags === 'string') {
            updateData.hashtags = body.hashtags
                .split(',')
                .map((tag: string) => tag.trim())
                .filter(Boolean);
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const updatedPost = await Post.findOneAndUpdate(
            {
                _id: postId,
                user: authUser.id, // 👈 Ensure only owner can update
                is_blocked: { $ne: true },
            },
            { $set: updateData },
            { new: true }
        );

        if (!updatedPost) {
            return NextResponse.json({ error: 'Post not found or not accessible' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Post updated', post: updatedPost }, { status: 200 });
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
import { userAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/errorResponse";
import { createComment, getComments } from "@/lib/controllers/commentController";
import Post from "@/models/Post";
import { Types } from "mongoose";


export async function POST(req: NextRequest, context: { params: Promise<{ postId: string }> }) {
    try {
        const authUser = await userAuth();

        const { postId } = await context.params;
        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Create comment in collection Comment
        const commentData = await createComment(postId, content, authUser.id);

        // Add count of comments in key comment_count of collection Post
        await Post.updateOne({ _id: new Types.ObjectId(postId) }, { $inc: { comment_count: 1 } });

        return NextResponse.json({ message: "Comments created successfully", comment: commentData }, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}


export async function GET(_req: NextRequest, context: { params: Promise<{ postId: string }> }) {
    try {
        const { postId } = await context.params;

        const comments = await getComments(postId);

        return NextResponse.json({ message: "Comments fetched successfully", comments }, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}

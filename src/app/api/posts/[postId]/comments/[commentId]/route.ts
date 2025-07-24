import Comment from "@/models/Comment";
import { userAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ postId: string, commentId: string }> }) {
    try {
        const authUser = await userAuth();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { postId, commentId } = await params;

        const comments = await Comment.deleteOne({
            _id: commentId,
            post: postId,
            user: authUser.id
        });

        if (!comments.acknowledged) {
            return NextResponse.json({ error: 'Comments not found' }, { status: 404 });
        }

        return NextResponse.json({ message: "Comments deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
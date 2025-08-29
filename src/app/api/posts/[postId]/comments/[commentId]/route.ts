import { userAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { deleteComment, getCommentById } from "@/lib/controllers/commentController";
import { handleApiError } from "@/lib/errors/errorResponse";

export async function GET(_req: NextRequest, context: { params: Promise<{ postId: string, commentId: string }> }) {
    try {
        const { commentId } = await context.params;

        const comment = await getCommentById(commentId);

        return NextResponse.json({ message: "Comment fetched successfully", comment }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ postId: string, commentId: string }> }) {
    try {
        const authUser = await userAuth();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { postId, commentId } = await context.params;

        await deleteComment(commentId, postId, authUser.id);

        return NextResponse.json({ message: "Comments deleted successfully" }, { status: 200 });

    } catch (error) {
        handleApiError(error);
    }
}
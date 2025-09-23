import { userAuth } from "@/lib/auth";
import { createReply, getReplies } from "@/lib/controllers/commentController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: Promise<{ postId: string, commentId: string }> }) {
    try {
        const user = await userAuth();

        const { commentId } = await context.params;

        const body = await req.json();

        const { content } = body;

        const reply = await createReply({
            commentId,
            author: new Types.ObjectId(user.id),
            content
        });

        return NextResponse.json(reply,  { status: 200 });

    } catch (error) {
        return handleApiError(error)
    }
}

export async function GET(_req: NextRequest, context: { params: Promise<{ postId: string, commentId: string }> }) {
    try {
        await userAuth();

        const { commentId } = await context.params;

        const replies = await getReplies(commentId) || [];

        return NextResponse.json(replies, { status: 200 });

    } catch (error) {
        return handleApiError(error)
    }
}
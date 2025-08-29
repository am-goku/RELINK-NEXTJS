import { userAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/errorResponse";
import { createComment, getComments } from "@/lib/controllers/commentController";


export async function POST(req: NextRequest, context: { params: Promise<{ postId: string }> }) {
    try {
        const authUser = await userAuth();

        const { postId } = await context.params;
        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const commentData = await createComment(postId, content, authUser.id);

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
        console.log(error)
        return handleApiError(error);
    }
}

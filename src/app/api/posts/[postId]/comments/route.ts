import { IComment } from "@/models/Comment";
import { userAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/errorResponse";
import { createComment, getComments } from "@/lib/controllers/commentController";


export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
    try {
        const authUser = await userAuth();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { postId } = params;
        const { content }: IComment = await req.json();

        if (!content) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const commentData = await createComment(postId, content, authUser.id);

        return NextResponse.json({ message: "Comments created successfully", comment: commentData }, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}


export async function GET(_req: NextRequest, { params }: { params: { postId: string } }) {
    try {
        const { postId } = params;

        const comments = await getComments(postId);

        return NextResponse.json({ message: "Comments fetched successfully", comments }, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}

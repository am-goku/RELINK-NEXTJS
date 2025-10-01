import { userAuth } from "@/lib/auth";
import { handlePostSave } from "@/lib/controllers/post";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(_req: NextRequest, context: { params: Promise<{ postId: string }> }) {
    try {
        const user = await userAuth();

        const { postId } = await context.params;
        if (!postId) {
            throw new Error("Post ID is required");
        }

        const data = await handlePostSave(postId, user.id);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}
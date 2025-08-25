import { userAuth } from "@/lib/auth";
import { getPostsByUsername } from "@/lib/controllers/postController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ username: string }> }) {
    try {
        const { username } = await context.params;

        const { searchParams } = new URL(req.url);

        const page = searchParams.get("page");

        const user = await userAuth();

        const posts = await getPostsByUsername(username, Number(page), user.id);

        return NextResponse.json({ message: 'Posts fetched successfully', posts }, { status: 200 });
    } catch (error) {
        return handleApiError(error)
    }
}
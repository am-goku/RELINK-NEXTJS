import { userAuth } from "@/lib/auth";
import { getPostsByUserId, getPostsByUsername } from "@/lib/controllers/postController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await userAuth();

        const { searchParams } = new URL(req.url);

        const userId = searchParams.get("userId") || undefined;
        const username = searchParams.get("username") || undefined;

        const page = searchParams.get("page") || 1;

        if (!userId && !username) {
            return NextResponse.json({ error: 'userId or username is required' }, { status: 400 });
        }

        const isOwner = (userId === user.id) || (username === user.username);

        if (userId) {
            const posts = await getPostsByUserId(userId, Number(page), user.id, isOwner);
            return NextResponse.json(posts, { status: 200 });
        } else if (username) {
            const posts = await getPostsByUsername(username, Number(page), user.id, isOwner);
            return NextResponse.json(posts, { status: 200 });
        }

    } catch (error) {
        return handleApiError(error);
    }
} // GET User Posts by User ID or Username [api: GET /api/posts/user]
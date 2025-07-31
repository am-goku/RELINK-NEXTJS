import { userAuth } from "@/lib/auth";
import { getPostsByUsername } from "@/lib/controllers/postController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
    try {
        const { username } = params;

        await userAuth();

        const posts = await getPostsByUsername(username)

        return NextResponse.json({ message: 'Posts fetched successfully', posts }, { status: 200 });
    } catch (error) {
        return handleApiError(error)
    }
}
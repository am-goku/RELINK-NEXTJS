import { searchPosts } from "@/lib/controllers/postController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const tag = searchParams.get("tag");
        const pageParam = searchParams.get("page");

        const page = Math.max(parseInt(pageParam || "1", 10), 1);

        const posts = await searchPosts(tag, page);

        return NextResponse.json({ posts });
    } catch (error) {
        return handleApiError(error);
    }
}
import { userAuth } from "@/lib/auth";
import { searchPosts } from "@/lib/controllers/searchController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        
        const user = await userAuth();

        const { searchParams } = new URL(req.url);

        const searchKey = searchParams.get("searchKey");
        const tag = searchParams.get("tag") || null;
        const pageParam = searchParams.get("page");

        const page = Math.max(parseInt(pageParam || "1", 10), 1);

        const query = searchKey || tag;

        if(!query) {
            throw new Error('Search key or tag is required');
        }

        const isHashtag = (((tag !== null) && !searchKey) || (query.startsWith("#"))) ? true : false;

        const posts = await searchPosts(query, isHashtag, user.id, page, 10);

        return NextResponse.json({ posts });
    } catch (error) {
        return handleApiError(error);
    }
}
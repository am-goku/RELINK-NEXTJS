import { userAuth } from "@/lib/auth";
import { searchUser } from "@/lib/controllers/userController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await userAuth();

        const { searchParams } = new URL(req.url);
        
        const searchKey = searchParams.get("searchKey");
        const prev = searchParams.get("prev") || 'false';
        const pageParam = searchParams.get("page");

        const page = Math.max(parseInt(pageParam || "1", 10), 1);

        const searchResults = await searchUser(user.id, searchKey, page, prev as 'false' | 'true');

        return NextResponse.json(searchResults, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}
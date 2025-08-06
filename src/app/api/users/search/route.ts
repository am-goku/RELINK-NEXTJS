import { searchUser } from "@/lib/controllers/userController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        
        const searchKey = searchParams.get("searchKey");
        const prev = searchParams.get("prev") || 'false';
        const pageParam = searchParams.get("page");

        const page = Math.max(parseInt(pageParam || "1", 10), 1);

        const users = await searchUser(searchKey, page, prev as 'false' | 'true');

        return NextResponse.json({ users });
    } catch (error) {
        return handleApiError(error);
    }
}
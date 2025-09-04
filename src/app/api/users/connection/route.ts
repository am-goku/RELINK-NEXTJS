import { userAuth } from "@/lib/auth";
import { getMutualConnections } from "@/lib/controllers/userConnectionController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await userAuth();

        const { searchParams } = new URL(req.url);

        const searchKey = searchParams.get("searchKey") || undefined;

        const connection = await getMutualConnections(user.id, searchKey);

        return NextResponse.json({ message: 'Mutual connections fetched successfully', connection });

    } catch (error) {
        return handleApiError(error);
    }
}
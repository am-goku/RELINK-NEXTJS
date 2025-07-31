import { userAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getPostsByUserId } from "@/lib/controllers/postController";
import { handleApiError } from "@/lib/errors/errorResponse";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        await connectDB();
        const { userId } = params;

        const authUser = await userAuth();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const posts = await getPostsByUserId(userId);

        return NextResponse.json({ message: 'Posts fetched successfully', posts }, { status: 200 });
    } catch (error) {
        return handleApiError(error)
    }
}
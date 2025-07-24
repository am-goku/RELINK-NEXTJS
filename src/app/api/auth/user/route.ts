import { authOptions } from "@/lib/auth";
import { NotFoundError, UnauthorizedError } from "@/lib/errors/ApiErrors";
import { handleApiError } from "@/lib/errors/errorResponse";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) throw new UnauthorizedError('Unauthorized');

        const user = await User.findOne({ email: session.user.email }).select("-password -otp");

        if (!user) throw new NotFoundError('User not found')

        return NextResponse.json({user});
    } catch (error) {
        return handleApiError(error);
    }
}
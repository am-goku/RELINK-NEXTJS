import { authOptions } from "@/lib/auth/authOptions";
import { UnauthorizedError } from "@/lib/errors/ApiErrors";
import { getErrorMessage, handleApiError } from "@/lib/errors/errorResponse";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) throw new UnauthorizedError('Unauthorized');

        const user = await User.findOne({ email: session.user.email }).select("-password -otp");

        return NextResponse.json({ user });
    } catch (error) {
        return handleApiError(new UnauthorizedError(getErrorMessage(error) || 'Unauthorized'));
    }
}
import User from "@/models/User";
import { authOptions, userAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/errorResponse";
import { updateUserProfile } from "@/lib/controllers/userController";

export async function GET() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email }).select("-password -otp");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(req: Request) {
    try {
        const user = await userAuth();

        const body = await req.json();

        const updatedUser = await updateUserProfile({
            email: user.email,
            data: body,
        });

        return NextResponse.json({ message: 'User update successful', user: updatedUser });
    } catch (error) {
        return handleApiError(error);
    }
}

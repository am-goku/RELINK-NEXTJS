import { userAuth } from "@/lib/auth";
import { generateOTP } from "@/lib/controllers/authController";
import { UnauthorizedError } from "@/lib/errors/ApiErrors";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const user = await userAuth();
        if (!user) throw new UnauthorizedError('Unauthorized');

        await generateOTP(user.email, 'password');

        return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}
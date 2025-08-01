import { verifyOTP } from "@/lib/controllers/authController";
import { BadRequestError } from "@/lib/errors/ApiErrors";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) throw new BadRequestError("Email and OTP are required");

        const user = await verifyOTP(email, otp);

        return NextResponse.json({ message: "OTP verification successfully", user }, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}
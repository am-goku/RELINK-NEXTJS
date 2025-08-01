import { generateOTP } from "@/lib/controllers/authController";
import { BadRequestError } from "@/lib/errors/ApiErrors";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if(!email) throw new BadRequestError("Email is required");

        await generateOTP(email);

        return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}
import { userAuth } from "@/lib/auth";
import { verifyOTP } from "@/lib/controllers/authController";
import { updatePassword } from "@/lib/controllers/userController";
import { BadRequestError, UnauthorizedError } from "@/lib/errors/ApiErrors";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
        const user = await userAuth();
        if (!user) throw new UnauthorizedError('Unauthorized');

        const { password, confirm_password, otp } = await req.json();

        if (!password || !confirm_password || !otp) {
            throw new BadRequestError('Missing fields');
        }

        await verifyOTP(user.email, otp);
        await updatePassword(password, user.id);

        return NextResponse.json({ message: 'Password updated' });

    } catch (error) {
        return handleApiError(error);
    }
}
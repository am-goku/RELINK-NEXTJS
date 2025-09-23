import { handleApiError } from "@/lib/errors/errorResponse";
import { IUnverifiedUser, UnverifiedUser } from "@/models/UnverifiedUsers";
import User from "@/models/User";
import { verifyOTP } from "@/services/otp/generate";
import { encode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, username, otp } = await req.json();

        
        if (!email || !username || !otp) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const unverifiedUser = await UnverifiedUser.findOne(
            {
                email: email,
                username: username
            }
        ).lean<IUnverifiedUser>();
        
        if (!unverifiedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log(unverifiedUser);
        
        const isOtpValid = await verifyOTP(otp, unverifiedUser.verificationToken);
        if (!isOtpValid) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        if (unverifiedUser.verificationExpires < new Date()) {
            return NextResponse.json({ error: "OTP expired" }, { status: 400 });
        }

        const newUser = new User({
            email: unverifiedUser.email,
            username: unverifiedUser.username,
            password: unverifiedUser.password
        });

        const user = await newUser.save();

        await UnverifiedUser.deleteOne({ email: email, username: username });

        // Manually creating session-cookie
        const token = await encode({
            token: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            secret: process.env.NEXTAUTH_SECRET as string,
            maxAge: 60 * 60 * 24 * 30, // 30 days
        }); // Building JWT Payload

        (await cookies()).set("next-auth.session-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30,
        }) // Setting the cookie (same cookie name NextAuth uses)

        return NextResponse.json({ message: "User registered successfully" }, { status: 200 });

    } catch (error) {
        console.log(error);
        handleApiError(error);
    }
}
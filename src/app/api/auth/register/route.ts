import User from "@/models/User";
import { hashPassword } from "@/lib/hash";
import { connectDB } from "@/lib/db/mongoose";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/errorResponse";
import { UnverifiedUser } from "@/models/UnverifiedUsers";
import { generateOTP } from "@/services/otp/generate";
import { sendEmail } from "@/services/mail/mailer";


export async function POST(req: Request) {
    try {

        const { email, username, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await connectDB();

        //Checking is email already in use or not
        const emailExist = await User.countDocuments({ email });
        if (emailExist > 0) {
            return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }

        //Checking is username already in user or not
        const usernameExist = await User.countDocuments({ username });
        if (usernameExist > 0) {
            return NextResponse.json({ error: "Username already exists" }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        const { hashedOtp, rawOtp, otp_expiry } = await generateOTP();

        const newUnverifiedUser = new UnverifiedUser({
            email,
            username,
            password: hashedPassword,
            verificationToken: hashedOtp,
            verificationExpires: otp_expiry,
        });

        await newUnverifiedUser.save();

        await sendEmail(email, username, rawOtp, "verification");

        return NextResponse.json({ message: "Otp has been sent successfully" }, { status: 201 });

    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(req: Request) {
    try {
        const { email, username } = await req.json();

        if (!username || !email) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await connectDB();

        const unverifiedUser = await UnverifiedUser.findOne({ email: email, username: username });

        if (!unverifiedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { hashedOtp, rawOtp, otp_expiry } = await generateOTP();

        await UnverifiedUser.findOneAndUpdate({email, username}, {
            verificationToken: hashedOtp,
            verificationExpires: otp_expiry,
        });

        await sendEmail(email, username, rawOtp, "verification");

        return NextResponse.json({ message: "Otp has been resent successfully" }, { status: 201 });

    } catch (error) {
        return handleApiError(error);
    }
}
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NotFoundError } from "../errors/ApiErrors";
import { connectDB } from "../db/mongoose";
import { sanitizeUser } from "@/utils/sanitizer/user";
import { sendEmail } from "@/services/mail/mailer";
import { AppError, SignupErrorCode } from "../errors/error.types";
import { hashPassword } from "../hash";
import { UnverifiedUser } from "@/models/UnverifiedUsers";

type IOtpFor = 'password' | 'email' | 'login' | 'verification';

export async function createUser(data: {
    username: string;
    password: string;
    email: string;
}) {
    const { email, username, password } = data;

    if (!username || !email || !password) {
        const missing: string[] = [];
        if (!email) missing.push("email");
        if (!username) missing.push("username");
        if (!password) missing.push("password");

        const err: AppError = Object.assign(
            new Error(`Missing fields: ${missing.join(", ")}`),
            {
                code: "MISSING_FIELDS" as SignupErrorCode,
                status: 400,
            }
        );
        throw err;
    }

    await connectDB();

    const emailExist = await User.findOne({ email });
    if (emailExist) {
        const err: AppError = Object.assign(new Error("Email already exists"), {
            code: "EMAIL_TAKEN" as SignupErrorCode,
            status: 400,
        });
        throw err;
    }

    if(!emailExist) {
        const emailExist = await UnverifiedUser.findOne({ email });
        if (emailExist) {
            const err: AppError = Object.assign(new Error("Email already exists but not verified"), {
                code: "EMAIL_TAKEN" as SignupErrorCode,
                status: 400,
            });
            throw err;
        }
    }

    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
        const err: AppError = Object.assign(new Error("Username already exists"), {
            code: "USERNAME_TAKEN" as SignupErrorCode,
            status: 400,
        });
        throw err;
    }

    if(!usernameExist) {
        const usernameExist = await UnverifiedUser.findOne({ username });
        if (usernameExist) {
            const err: AppError = Object.assign(new Error("Username already exists but not verified"), {
                code: "USERNAME_TAKEN" as SignupErrorCode,
                status: 400,
            });
            throw err;
        }
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    return sanitizeUser(newUser, "user");
}


export async function generateOTP(email: string, otpFor: IOtpFor = 'verification') {
    await connectDB();

    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User not found");

    user.otp = hashedOtp;
    user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    await sendEmail(email, user.username, rawOtp, otpFor);
}


export async function verifyOTP(email: string, enteredOtp: string) {
    await connectDB();

    const user = await User.findOne({ email }).select("+otp +otp_expiry");
    if (!user) throw new NotFoundError("User not found");

    if (!user.otp || !user.otp_expiry || user.otp_expiry < new Date()) {
        throw new Error("OTP expired or invalid");
    }

    const isMatch = await user.compareOTP(enteredOtp);
    if (!isMatch) throw new Error("Incorrect OTP");

    // Clear OTP fields after successful verification
    user.otp = undefined;
    user.otp_expiry = undefined;
    await user.save();

    return sanitizeUser(user);
}
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NotFoundError } from "../errors/ApiErrors";
import { connectDB } from "../db/mongoose";
import { sanitizeUser } from "@/utils/sanitizer/user";
import { sendEmail } from "@/services/mail/mailer";

type IOtpFor = 'password' | 'email' | 'login' | 'verification';

/**
 * Generates a one-time password (OTP) for the given user.
 * 
 * @param email - The email of the user to generate an OTP for.
 * @param otpFor - The purpose for which the OTP is being generated. Defaults to 'verification'.
 * 
 * @throws {NotFoundError} If the user is not found.
 */
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

/**
 * Verifies a one-time password (OTP) for the given user.
 * 
 * @param email - The email of the user to verify the OTP for.
 * @param enteredOtp - The OTP entered by the user.
 * 
 * @throws {NotFoundError} If the user is not found.
 * @throws {Error} If the OTP is invalid or expired.
 * 
 * @returns A sanitized user object if the OTP is valid.
 */
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
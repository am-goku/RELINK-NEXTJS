import bcrypt from "bcryptjs";

export const generateOTP = async () : Promise<{ rawOtp: string, hashedOtp: string, otp_expiry: Date }> => {
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    return { rawOtp, hashedOtp, otp_expiry };
}

export const verifyOTP = async (otp: string, hashedOtp: string) : Promise<boolean> => {
    return await bcrypt.compare(otp, hashedOtp);
}
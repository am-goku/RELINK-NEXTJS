import { handleApiError } from "@/lib/errors/errorResponse";
import { transporter } from "./transporter";
import { getOtpTemplate } from "./otpTemplate";

type IOtpFor = 'password' | 'email' | 'login' | 'verification';

export async function sendEmail(email: string, username: string, token: string, otpFor: IOtpFor = 'verification') {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: email, // list of receivers
      subject: "Relink email verification", // Subject line
      text: "",
      html: getOtpTemplate(username, token, otpFor) // plain text body
    });

    return info
  } catch (error) {
    handleApiError(error);
  }
}

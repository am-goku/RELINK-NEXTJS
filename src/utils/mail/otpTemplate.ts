type IOtpFor = 'password' | 'email' | 'login' | 'verification';

const getOtpPurposeText = (otpFor: IOtpFor): string => {
    switch (otpFor) {
        case 'password':
            return "You have requested an OTP to reset your password. Please enter the following code to proceed:";
        case 'email':
            return "You have requested an OTP to verify your email address. Please enter the following code to complete verification:";
        case 'login':
            return "You are trying to log in. Please enter the following OTP code to continue:";
        case 'verification':
        default:
            return "Please use the following OTP code to verify your identity:";
    }
};

export const getOtpTemplate = (username: string, token: string, otpFor: IOtpFor) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ReLink OTP Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333; text-align: center;">ReLink OTP Code</h2>
    <p>Hello ${username},</p>
    <p>${getOtpPurposeText(otpFor)}</p>
    <p style="text-align: center; font-size: 24px; font-weight: bold;">OTP Code: ${token}</p>
    <p>If you did not request this code, please ignore this message. The code is valid for 30 minutes.</p>
    <p>Thank you for using ReLink.</p>
    <p style="text-align: center;">Best regards,<br>The ReLink Team</p>
  </div>
</body>
</html>`;

import VerificationEmail from "@/emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  try {
    const smtpUser = process.env.SMTP_USER || "";
    const smtpPass = process.env.SMTP_PASS || "";
    const from = process.env.SMTP_FROM || smtpUser;
    if (!smtpUser || !smtpPass) {
      return {
        success: false,
        message: "SMTP_USER or SMTP_PASS is not set",
      };
    }
    if (!from) {
      return {
        success: false,
        message: "SMTP_FROM is not set",
      };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const html = await render(
      VerificationEmail({ username, verifyToken: otp })
    );

    await transporter.sendMail({
      from,
      to: email,
      subject: "Your Verification Code",
      html,
    });

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (err) {
    console.error("Error sending verification email:", err);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }

}

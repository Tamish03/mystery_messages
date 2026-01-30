import {resend} from "@/lib/resend";
import VerificationEmail from "@/emails/verificationEmail";
import {ApiResponse} from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
    otp: string
): Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Your Verification Code",
            react: VerificationEmail({username, verifyToken: otp}),
        });
        return {
            success: true,
            message: "Verification email sent successfully",
        }
    }
    catch(err){
        console.error("Error sending verification email:", err);
        return {
            success: false,
            message: "Failed to send verification email"
        };
    }

}
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  //ye jo method hai wo promise return karega wo bhi api response type ka
  try {
    await resend.emails.send({
        from:'onboarding@resend.dev',
        to:email,             
        subject: 'team@sankalp.dev',
        react: VerificationEmail({ username, otp: verifyCode }),    //component 
    });
    return { success: true, message: "verification email sent successfully" };
  } catch (emailError) {
    console.log("Error sending verification email", emailError);
    return { success: false, message: "failed to send verification email" };
  }
}

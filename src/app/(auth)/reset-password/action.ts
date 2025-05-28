"use server";
import { resetPasswordSchema, ResetPasswordValues } from "@/lib/validation";

type ResetPaswordProps = {
  newPassword: ResetPasswordValues;
  auth: {
    token: string;
    email: string;
  };
};
export async function resetPassword(
  credentials: ResetPaswordProps,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const { password } = resetPasswordSchema.parse(credentials.newPassword);

    const { token: Token, email: Email } = credentials.auth;
    if (!Email || !Token) {
      return {
        error: "Invalid reset link. Please try again.",
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: Email,
          token: Token,
          newPassword: password,
        }),
      },
    );

    const data = await response.json();
    console.log(response);

    if (data?.error) {
      return {
        error: data.error || "Invalid server response. Please try again.",
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Reset error:", error || error.message);

    return {
      error: error,
    };
  }
}

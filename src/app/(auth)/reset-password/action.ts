"use server";
import { cookies } from "next/headers";
import { resetPasswordSchema, ResetPasswordValues } from "@/lib/validation";
import { decryptForReset } from "@/lib/session";

export async function resetPassword(
  credentials: ResetPasswordValues,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const { password } = resetPasswordSchema.parse(credentials);

    const cookieStore = await cookies();
    const resetCookie = cookieStore.get("reset")?.value;
    if (!resetCookie) {
      return { error: "Something went wrong reset operation.Try letter" };
    }
    const decryptSession = await decryptForReset(resetCookie);
    if (!decryptSession) {
      return { error: "Something went wrong reset operation.Try letter" };
    }

    const { t: Token, email: Email } = decryptSession;
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

    cookieStore.delete("reset");
    return { success: true };
  } catch (error: any) {
    console.error("Reset error:", error || error.message);

    return {
      error: error,
    };
  }
}

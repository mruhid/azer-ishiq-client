"use server";
import { cookies } from "next/headers";
import { otpVerifySchema, OtpVerifyValues } from "@/lib/validation";
import { encrypt } from "@/lib/session";

export async function otpVerify(
  credentials: OtpVerifyValues,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const parsedValues = otpVerifySchema.parse(credentials);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedValues),
      },
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        error: data.error || data.message || "Verify failed. Please try again.",
      };
    }

    if (!data.response?.token) {
      return { error: "Invalid server response. Please try again." };
    }

    console.log(data);
    const { userName, email, roles, token, refreshToken } = data.response;

    const session = await encrypt({
      userName,
      email,
      roles,
      token,
      refreshToken,
    });

    const cookiesStore = await cookies();
    cookiesStore.set("user", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return { success: true };
  } catch (error: any) {
    console.error("Verify error:", error.response?.data || error.message);

    return {
      error:
        error.response?.data?.message ||
        (error.response?.status === 400
          ? "Invalid email ."
          : "Verify failed. Please try again."),
    };
  }
}

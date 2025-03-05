"use server";
import { signUpSchema, SignUpValues } from "@/lib/validation";

export async function signUp(
  credentials: SignUpValues,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const { username, email, number, password, confirmingPassword } =
      signUpSchema.parse(credentials);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          email: email,
          phoneNumber: number,
          password,
          passwordConfirmation: confirmingPassword,
        }),
      },
    );

    const data = await response.json();

    if (data?.error) {
      return {
        error: data?.error || "Invalid server response. Please try again.",
      };
    }
    return { success: true };
  } catch (error: any) {
    console.error("Sign up error:", error.response?.data || error.message);

    return { error };
  }
}

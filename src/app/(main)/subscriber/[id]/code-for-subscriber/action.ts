"use server";

import { validateRequest } from "@/lib/session";
type Data = {
  id: number;
};
export async function codeApply(
  dataValue: Data,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const auth = await validateRequest();
    if (!auth.session) {
      return { error: "Invalid token" };
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber/sb-code?id=${dataValue.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.session}`,
        },
      },
    );

    const data = await response.json();
    console.log(response);

    if (!response.ok || data.error) {
      return {
        error:
          data.error ||
          data.message ||
          "Creating subscriber  code failed. Please try again.",
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error(" Server error:", error.message || error);
    return { error: "Something went wrong. Please try again later." };
  }
}

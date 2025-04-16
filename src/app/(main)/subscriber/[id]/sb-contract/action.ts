"use server";
import { validateRequest } from "@/lib/session";

export default async function sbContractApply(
  id: number,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const token = await validateRequest();
    if (!token.session) {
      return { error: "Unauthorized" };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber/sb-apply?id=${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.session}`,
        },
      },
    );

    const data = await response.json();
    console.log("Response Data:", data);

    if (!response.ok) {
      return {
        error:
          data.message || "SB-contract accepting failed. Please try again.",
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Server error:", error);

    return {
      error:
        error?.response?.data?.message ||
        (error?.response?.status === 400
          ? "Invalid operation."
          : "SB-contract accepting failed. Please try again."),
    };
  }
}

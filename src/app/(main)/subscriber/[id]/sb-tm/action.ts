"use server";
import { validateRequest } from "@/lib/session";

type CredentialsType = {
  data: { tmId: number };
  subsId: number;
};
export default async function sbTmApply(
  values: CredentialsType,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const token = await validateRequest();
    if (!token.session) {
      return { error: "Unauthorized" };
    }

    console.log(values);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber/sb-tm?id=${values.subsId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.session}`,
        },
        body: JSON.stringify(values.data),
      },
    );

    const data = await response.json();
    console.log("Response Data:", data);

    if (!response.ok) {
      return {
        error: data.message || "SB-tm connecting failed. Please try again.",
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
          : "SB-tm creating operation failed. Please try again."),
    };
  }
}

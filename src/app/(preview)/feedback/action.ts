"use server";
import { FeedbackValues } from "@/lib/validation";

export default async function ApplyFeedback(
  credentials: FeedbackValues,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ElectronicAppeal`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      },
    );

    const data = await response.json();
    console.log(credentials);
    console.log("Response Data:", data);

    if (!response.ok) {
      return {
        error:
          data.message ||
          data.error ||
          data.errors.message ||
          "Əməliyyat zamanı xəta baş verdi,lütfən biraz sonra yenidən yoxlayın",
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Server error:", error);

    return {
      error:
        error?.response?.data?.message ||
        (error?.response?.status === 400
          ? "Səhv əməliyyat"
          : "Əməliyyat zamanı xəta baş verdi,lütfən biraz sonra yenidən yoxlayın"),
    };
  }
}

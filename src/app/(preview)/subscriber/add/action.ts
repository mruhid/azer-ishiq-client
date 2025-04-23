"use server";
import { validateRequest } from "@/lib/session";
import { SubscriberValues } from "@/lib/validation";

export default async function addSubscriber(
  credentials: SubscriberValues,
): Promise<{ success?: boolean; id?: string; error?: string }> {
  try {
    const token = await validateRequest();
    if (!token.session) {
      return { error: "Unauthorized" };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.session}`,
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
          "Add subscriber failed. Please try again.",
      };
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error("Server error:", error);

    return {
      error:
        error?.response?.data?.message ||
        (error?.response?.status === 400
          ? "Invalid operation."
          : "Subscriber add operation failed. Please try again."),
    };
  }
}

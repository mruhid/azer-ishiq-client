"use server";
import { validateRequest } from "@/lib/session";
import { CounterValuesProps } from "./SubscriberCounterFeed";

type CredentialsType = {
  id: number;
  credentials: CounterValuesProps;
};
export default async function sbCounterUpdate(
  values: CredentialsType,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const token = await validateRequest();
    if (!token.session) {
      return { error: "Unauthorized" };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber/counter-update?id=${values.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.session}`,
        },
        body: JSON.stringify(values.credentials),
      },
    );

    const data = await response.json();
    console.log("Response Data:", data);

    if (!response.ok) {
      return {
        error: data.message || "Counter editing failed. Please try again.",
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
          : "SB-counter editing operation failed. Please try again."),
    };
  }
}

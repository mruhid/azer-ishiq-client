"use server";

import { validateRequest } from "@/lib/session";

export async function deleteSubs(
  id: number,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const token = await validateRequest();
    if (!token.session) {
      return { error: "Unauthorized" };
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/substation/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.session}`,
        },
      },
    );

    if (!response.ok) {
      const errorMessage = `Failed to delete substation. Status: ${response.status}`;
      console.error(errorMessage);
      return { error: errorMessage };
    }

    const data = await response.json();
    console.log("Delete response:", data);

    if (data?.error) {
      return { error: data.error || "An unknown error occurred." };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Delete sub error:", error.message || error);
    return { error: "Something went wrong. Please try again later." };
  }
}

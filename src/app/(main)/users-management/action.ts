"use server";
import { validateRequest } from "@/lib/session";

export async function toggleUserBlockedStatus({
  id,
  check,
}: {
  id: number;
  check: boolean;
}): Promise<{ id: number; check: boolean }> {
  try {
    const token = await validateRequest();

    if (!token.session || !token.user) throw new Error("Unauthorized");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/block`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.session}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          isBlocked: check,
        }),
      },
    );

    const data = await response.json();
    if (!response.ok)
      throw new Error(data?.message || "Failed to update user blocked status");

    return { id, check };
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}

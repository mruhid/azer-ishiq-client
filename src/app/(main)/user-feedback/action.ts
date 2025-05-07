"use server";

import { validateRequest } from "@/lib/session";

export async function updateMessageReadStatus({
  id,
  read,
}: {
  id: number;
  read: boolean;
}): Promise<{ id: number; read: boolean }> {
  const token = await validateRequest();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/ElectronicAppeal/${id}/mark-as-read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token.session}`,
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();
  if (!response.ok)
    throw new Error(data?.message || "Failed to update message read status");

  return { id, read };
}

"use server";
import { validateRequest } from "@/lib/session";

export async function toggleUserBlockedStatus({
  id,
  check,
}: {
  id: number;
  check: boolean;
}): Promise<{ id: number; check: boolean }> {
  const token = await validateRequest();
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
}

export async function changeUserRoles({
  id,
  roles,
}: {
  id: number;
  roles: string[];
}): Promise<{ id: number; roles: string[]; error?: string }> {
  const token = await validateRequest();
  const capitalizeRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/assign-roles`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.session}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
        roleNames: roles.map((a) => capitalizeRole(a)),
      }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update user roles");
  }
  return { id, roles };
}

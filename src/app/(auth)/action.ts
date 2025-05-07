"use server";

import { validateRequest } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookiesStore = await cookies();
  cookiesStore.delete("user");
  redirect("/service");
}

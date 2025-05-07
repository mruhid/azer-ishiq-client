"use server";
import ProfileLayout from "@/components/profile/ProfileLayout";
import { validateRequest } from "@/lib/session";
import { UserDataProps } from "@/lib/type";
import { sendRequest } from "@/lib/utils";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

const getUser = cache(async (id: number): Promise<UserDataProps | null> => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      console.warn("Session not found");
      return null;
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`;
    const user = await sendRequest<UserDataProps>(url, "GET", session);
    if (!user) notFound();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
});
type Props = {
  params: {
    userId: number;
  };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUser(Number(params.userId));
  return {
    title: user ? `(${user.userName}) Profile` : "Profile Not Found",
  };
}

export default async function Page({ params }: Props) {
  const user = await getUser(params.userId);
  const { user: loggedInUser, session } = await validateRequest();
  if (!loggedInUser || !session) redirect("/login");
  if (!user) return notFound();
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1000px] bg-secondary text-foreground">
      <ProfileLayout
        isAdmin={false}
        session={session}
        loggedInUserId={loggedInUser.id}
        userId={params.userId}
        user={user}
      />
    </main>
  );
}

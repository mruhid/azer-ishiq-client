import { cache } from "react";
import { MyStatusProps, Subscriber } from "@/lib/type";
import { validateRequest } from "@/lib/session";
import { sendRequest } from "@/lib/utils";
import { Metadata } from "next";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import { notFound, redirect } from "next/navigation";
import SubscriberContractFeed from "./SubscriberContractFeed";
const getSubscriber = cache(
  async (id: number): Promise<MyStatusProps | null> => {
    try {
      const { session } = await validateRequest();
      if (!session) {
        return null;
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber/me`;
      const subs = await sendRequest<MyStatusProps[]>(url, "GET", session);
      const value = subs.find((f) => f.id == id);
      if (!value) {
        return null;
      }
      return value;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  },
);
export async function generateMetadata({
  params: { id },
}: {
  params: { id: number };
}): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) redirect("/service");

  const subs = await getSubscriber(id);

  return {
    title: `(${subs ? ` ${subs.fullName}` : "Not-Found"})SB Contract`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return <UnauthorizedPage />;
  }

  const subscriber = await getSubscriber(id);
  if (!subscriber) {
    return notFound();
  }

  return (
    <main className="mx-auto w-full h-screen min-w-0 max-w-[1080px] space-y-5 text-center">
      <SubscriberContractFeed subscriber={subscriber} />
    </main>
  );
}

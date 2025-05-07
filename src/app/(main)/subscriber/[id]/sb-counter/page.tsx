import { cache } from "react";
import { Subscriber } from "@/lib/type";
import { validateRequest } from "@/lib/session";
import { sendRequest, CapitalizeFirstLetter } from "@/lib/utils";
import { Metadata } from "next";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import { notFound } from "next/navigation";
import SubscriberCounterFeed from "./SubscriberCounterFeed";
const getSubscriber = cache(async (id: number): Promise<Subscriber | null> => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      return null;
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber/${id}`;
    const subs = await sendRequest<Subscriber>(url, "GET", session);

    return subs;
  } catch (error) {
    console.error("Error fetching substation:", error);
    return null;
  }
});
export async function generateMetadata({
  params: { id },
}: {
  params: { id: number };
}): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const subs = await getSubscriber(id);

  return {
    title: `(${subs ? `${CapitalizeFirstLetter(subs.name)} ${CapitalizeFirstLetter(subs.surname)}` : "Not-Found"})SB Counter`,
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
    <main className="mx-auto w-full min-w-0 max-w-[1080px] space-y-5 text-center">
      <SubscriberCounterFeed subscriber={subscriber} />
    </main>
  );
}

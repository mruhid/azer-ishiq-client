import { cache } from "react";
import { Subscriber } from "@/lib/type";
import { validateRequest } from "@/lib/session";
import { sendRequest, CapitalizeFirstLetter } from "@/lib/utils";
import { Metadata } from "next";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import { notFound, redirect } from "next/navigation";
import SubscriberCounterFeed from "./SubscriberCounterFeed";
import UpdateImg from "@/assets/updateGif.gif";
import UserAvatar from "@/components/UserAvatar";

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
    title: `(${subs ? `${CapitalizeFirstLetter(subs.name)} ${CapitalizeFirstLetter(subs.surname)}` : "Not-Found"})Edit Counter`,
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
  if (Number(subscriber.status) <= 3) {
    redirect("/subscriber");
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-[1080px] space-y-5 text-center">
      <div className="mx-2 flex items-center justify-around rounded-xl bg-primary py-2 text-center text-xl font-semibold">
        <div className="px-2 text-start text-white">
          <p>{CapitalizeFirstLetter(subscriber.name)} {CapitalizeFirstLetter(subscriber.surname)}</p>
          <p className="text-[1rem]">You can update subscriber counter information on here</p>
        </div>
        <UserAvatar avatarUrl={UpdateImg} size={80} />
      </div>
      <SubscriberCounterFeed subscriber={subscriber} />
    </main>
  );
}

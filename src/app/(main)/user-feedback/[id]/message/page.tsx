import UnauthorizedPage from "@/components/UnauthorizedPage";
import UserAvatar from "@/components/UserAvatar";
import { engAppealTopic } from "@/lib/constant";
import { validateRequest } from "@/lib/session";
import { FeedbackObject } from "@/lib/type";
import { CapitalizeFirstLetter, sendRequest } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import SendEmailPopover, { CallPhonePopover } from "./SendEmailPopover";
import { MoveLeft } from "lucide-react";
import NavigateBtns from "./NavigateBtns";

const getMessages = cache(
  async (id: number): Promise<FeedbackObject | null> => {
    try {
      const { session } = await validateRequest();
      if (!session) {
        return null;
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/ElectronicAppeal/${id}`;
      const tm = await sendRequest<FeedbackObject>(url, "GET", session);

      return tm;
    } catch (error) {
      console.error("Error fetching messages:", error);
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

  if (!loggedInUser) return {};

  const message = await getMessages(id);

  return {
    title: `By (${message ? CapitalizeFirstLetter(message.name) + " " + CapitalizeFirstLetter(message.surname) : "Not-Found"}) message`,
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

  const message = await getMessages(id);
  if (!message) {
    return notFound();
  }
  return (
    <>
      <NavigateBtns />
      <main className="mx-auto flex min-h-screen w-full max-w-[1000px] items-start justify-start gap-4">
        <UserAvatar
          className="border border-primary/50"
          avatarUrl={""}
          size={60}
        />
        <div className="flex w-full flex-col items-start justify-start gap-4">
          <h1 className="text-xl font-semibold">
            Topic:
            {engAppealTopic[Number(message.topic) - 1]}
          </h1>
          <div className="flex items-start justify-start gap-x-1">
            <p className="text-md font-semibold capitalize">
              {message.name} {message.surname}
            </p>
            <SendEmailPopover email={message.email} />
            <CallPhonePopover number={message.phoneNumber} />
          </div>
          <h2 className="font-semibold">Content:</h2>
          <p className="text-md font-normal capitalize">{message.content}</p>
        </div>
      </main>
    </>
  );
}

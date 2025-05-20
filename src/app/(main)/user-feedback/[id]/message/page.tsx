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
import NavigateBtns from "./NavigateBtns";

const getMessages = cache(
  async (id: number): Promise<FeedbackObject | null> => {
    try {
      const { session } = await validateRequest();
      if (!session) return null;

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
  if (!loggedInUser) return <UnauthorizedPage />;

  const message = await getMessages(id);
  if (!message) return notFound();

  return (
    <>
      <NavigateBtns />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <section className="flex flex-col items-start gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-700 dark:bg-zinc-900 sm:flex-row">
          <UserAvatar
            className="border border-primary/50"
            avatarUrl={""}
            size={72}
          />

          <div className="flex w-full flex-col gap-4">
            <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 sm:text-2xl">
              Topic:{" "}
              <span className="font-medium text-primary">
                {engAppealTopic[Number(message.topic) - 1]}
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-zinc-700 dark:text-zinc-200">
              <p className="text-md font-medium capitalize">
                {message.name} {message.surname}
              </p>
              <SendEmailPopover email={message.email} />
              <CallPhonePopover number={message.phoneNumber} />
            </div>

            <div>
              <h2 className="font-semibold text-zinc-800 dark:text-zinc-100">
                Content:
              </h2>
              <p className="text-md mt-1 whitespace-pre-line font-normal capitalize text-zinc-600 dark:text-zinc-300">
                {message.content}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

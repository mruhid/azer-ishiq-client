import { Metadata } from "next";
import AddSubscriberForm from "./AddSubscriberForm";
import { validateRequest } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Add subscriber",
};

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");
  return (
    <main className="mx-auto w-full min-w-0 max-w-[1000px] space-y-5 text-center">
      <AddSubscriberForm />
    </main>
  );
}

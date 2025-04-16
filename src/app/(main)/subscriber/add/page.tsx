import { Metadata } from "next";
import AddSubscriberForm from "./AddSubscriberForm";

export const metadata: Metadata = {
  title: "Add subscriber",
};

export default function Page() {
  return (
    <main className="mx-auto w-full min-w-0 max-w-[1000px] space-y-5 text-center">
      <AddSubscriberForm />
    </main>
  );
}

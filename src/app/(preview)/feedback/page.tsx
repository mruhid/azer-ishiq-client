import { Metadata } from "next";
import Feedback from "./Feedback";

export const metadata: Metadata = {
  title: "Support",
};
export default function Page() {
  return (
    <main className="w-full max-w-[1100px] mx-auto min-w-0 space-y-2">
      <Feedback />
    </main>
  );
}

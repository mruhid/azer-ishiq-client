import AboutLayout from "@/components/about/AboutLayout";
import EngineerView from "@/components/engineer/EngineerView";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Engineer",
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5">
      <EngineerView lang="az" />
    </main>
  );
}

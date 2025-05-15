import EngineerView from "@/components/engineer/EngineerView";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Developers",
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1000px] space-y-5">
      <div className="mx-2">
        <EngineerView />
      </div>
    </main>
  );
}

import RulesComponent from "@/components/Rules";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Rules",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 text-muted-foreground">
      <RulesComponent />
    </main>
  );
}

import TermsOfUse from "@/components/Terms-Of-Use";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Documentation",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 py-10 text-muted-foreground">
      <TermsOfUse />
    </main>
  );
}

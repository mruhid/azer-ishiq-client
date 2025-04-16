import { Metadata } from "next";
import SubstationFeed from "./SubstationFeed";
import { validateRequest } from "@/lib/session";
export const metadata: Metadata = {
  title: "Add substation",
};
export default async function Page() {
  const { user } = await validateRequest();
  
  return (
    <main className="mx-auto w-full min-w-0 max-w-[1000px] space-y-5 text-center">
      <h1 className="text-2xl font-bold text-primary">Add substations</h1>
      <SubstationFeed />
    </main>
  );
}

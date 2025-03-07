import { Metadata } from "next";
import SubstationFeed from "./SubstationFeed";
export const metadata: Metadata = {
  title: "Add substation",
};
export default function Page() {
  return (
    <main className="mx-auto w-full min-w-0  max-w-[1000px] space-y-5 text-center">
      <h1>Add substations</h1>
      <SubstationFeed/>
    </main>
  );
}

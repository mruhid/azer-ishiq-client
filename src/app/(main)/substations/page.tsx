import { Metadata } from "next";
import SubstationFeed from "./SubstationFeed";

export const metadata: Metadata = {
  title: "Substations",
};
export default function Page() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[1000px] space-y-5">
      <SubstationFeed />
    </div>
  );
}

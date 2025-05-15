import { Metadata } from "next";
import FeedbackCharts from "./FeedbackCharts";
import { LucideBarChartBig } from "lucide-react";

export const metadata: Metadata = {
  title: "Feedback statistics",
};
export default function Page() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[1000px] space-y-5">
      <div className="my-2 flex w-full items-center justify-between px-2">
        <h1 className="text-2xl font-semibold text-primary">
          Messages statistics
        </h1>
        <LucideBarChartBig size={40} className="text-primary" />
      </div>
      <FeedbackCharts />
    </div>
  );
}

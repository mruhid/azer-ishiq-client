import { Metadata } from "next";
import ServiceFeed from "./ServiceFeed";
import ElectricityDebtCheck from "@/components/ElectricityDebtCheck";
import NotificationBoxes from "@/components/NotificationBoxes";
import NewsCarousel from "@/components/NewsCarousel";
export const metadata: Metadata = {
  title: "Service",
};
export default function Page() {
  return (
    <>
      <NewsCarousel />
      <main className="mx-auto w-full max-w-[1100px] px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Elektrik xidmətləri</h1>
        <ServiceFeed />
        <NotificationBoxes />
        <ElectricityDebtCheck />
      </main>
    </>
  );
}

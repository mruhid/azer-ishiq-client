import HeroCards from "@/components/HeroCard";
import RegionFilter from "./RegionFilter";
import { hasAccessToRoute } from "@/lib/session";
import UnauthorizedPage from "@/components/UnauthorizedPage";

export default async function Home() {
  const hasAccsees = await hasAccessToRoute("/");
  if (!hasAccsees) {
    return <UnauthorizedPage />;
  }
  return (
    <div className="mx-auto w-full min-w-0 max-w-[1000px] space-y-5">
      <HeroCards />
      <RegionFilter />
    </div>
  );
}

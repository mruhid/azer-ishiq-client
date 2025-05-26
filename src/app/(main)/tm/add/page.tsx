import { Metadata } from "next";
import { hasAccessToRoute, validateRequest } from "@/lib/session";
import AddTMFeed from "./AddTMFeed";
import UnauthorizedPage from "@/components/UnauthorizedPage";
export const metadata: Metadata = {
  title: "Add TM",
};
export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return <UnauthorizedPage />;
  }
  const hasAccsees = await hasAccessToRoute("/tm/add");
  if (!hasAccsees) {
    return <UnauthorizedPage />;
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-[1000px] space-y-5 text-center">
      <AddTMFeed />
    </main>
  );
}

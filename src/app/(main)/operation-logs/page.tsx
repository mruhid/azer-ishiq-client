import { Metadata } from "next";
import OperationHistoryFeed from "./OperationHistoryFeed";
import { validateRequest } from "@/lib/session";
import UnauthorizedPage from "@/components/UnauthorizedPage";

export const metadata: Metadata = {
  title: "Operation History",
};
export default async function Page() {
  const { user } = await validateRequest();
  if (user?.roles.length == 1 && user.roles[0] == "User") {
    return <UnauthorizedPage />;
  }
  return (
    <main className="w-full min-w-0 space-y-2">
      <OperationHistoryFeed />
    </main>
  );
}

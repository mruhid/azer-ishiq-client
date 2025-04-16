import { Metadata } from "next";
import UserManagementFeed from "./UserManagementFeed";

export const metadata: Metadata = {
  title: "Users Management",
};
export default function Page() {
  return (
    <main className="w-full min-w-0 space-y-2">
      <UserManagementFeed />
    </main>
  );
}

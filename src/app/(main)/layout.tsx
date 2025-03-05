import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import { validateRequest } from "@/lib/session";
import Navbar from "./Navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  // if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen bg-secondary flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}

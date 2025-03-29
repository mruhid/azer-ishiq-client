import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import { validateRequest } from "@/lib/session";
import Navbar from "./Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import SideBar from "@/components/SideBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  // if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <SidebarProvider >
        <div className="flex w-full bg-background">
          <SideBar />

          <div className="flex flex-1 bg-secondary flex-col">
            <Navbar />

            <main className="flex flex-1 flex-col items-center bg-secondary py-4 text-foreground">
              <div className="w-full">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}

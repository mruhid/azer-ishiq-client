import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import { validateRequest } from "@/lib/session";
import Navbar from "./Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import SideBar from "@/components/SideBar";
import UserInformationSideBar from "@/components/UserInformationSideBar";
import UserInformationProvider from "./UserInformationContext";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/service");
  if (
    session.user.roles.length === 1 &&
    session.user.roles[0].toLowerCase() === "user"
  )
    redirect(`/user-account/${session.user.id}`);
  return (
    <SessionProvider value={session}>
      <UserInformationProvider>
        <SidebarProvider>
          <div className="flex w-full bg-secondary">
            <SideBar />
            <div className="flex flex-1 flex-col bg-secondary">
              <Navbar />
              <main className="flex flex-1 flex-col items-center bg-gradient-to-br from-secondary/50 via-secondary to-background py-4 text-foreground">
                <div className="w-full">{children}</div>
              </main>
            </div>
            <UserInformationSideBar />
          </div>
        </SidebarProvider>
      </UserInformationProvider>
    </SessionProvider>
  );
}

import { validateRequest } from "@/lib/session";
import SessionProvider from "./SessionProvider";
import Navbar from "./service/NavBar";
import Footer from "@/components/Footer";
import { MessageCircle } from "lucide-react";
import AutoChat from "@/components/auto-chats/AutoChats";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  return (
    <SessionProvider value={session}>
      <div className="flex w-full bg-secondary">
        <div className="flex flex-1 flex-col">
          <Navbar />
          <main className="flex flex-1 flex-col items-center text-foreground">
            <div className="w-full">{children}</div>
          </main>
          <AutoChat />
          <Footer />
        </div>
      </div>
    </SessionProvider>
  );
}

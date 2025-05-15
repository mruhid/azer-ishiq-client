import ChatProvider from "@/components/chats/ChatProvider";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Chat",
};
export default function ChatPage() {
  return (
    <main className="mx-auto h-[450px] w-full px-3 lg:h-[500px]">
      <ChatProvider />
    </main>
  );
}



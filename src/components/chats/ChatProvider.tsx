"use client";
import { UserCells } from "@/lib/type";
import { useState } from "react";
import ContactPeople from "./ContactPeople";
import Chat from "./Chat";

export interface ChatPeopleProps {
  id: string;
  userName: string;
  unreadCount?: number;
  isOnline?: boolean; // ✅ новое поле
}
export default function ChatProvider() {
  const [resepien, setResepien] = useState<UserCells | null>(null);
  const [users,setUsers]=useState<ChatPeopleProps |null>(null)
  return (
    <div className="flex h-full w-full items-start justify-start">
      <ContactPeople setResepien={setResepien} />
      <Chat setUsers={setUsers} resepien={resepien} />
    </div>
  );
}

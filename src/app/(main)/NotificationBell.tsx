"use client";
import { BellIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useSession } from "./SessionProvider";
import Link from "next/link";

interface User {
  id: number;
  userName: string;
  unreadCount?: number;
  isOnline?: boolean;
  lastMessage?: string;
}
export default function NotificationBell() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalMessageCount, setTotalMessageCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { session, user } = useSession();
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL_CHAT}/chathub`, {
        accessTokenFactory: () => session,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;
    setLoading(true);

    connection
      .start()
      .then(async () => {
        console.log("✅ Connected");

        const [allUsers, unreadCounts] = await Promise.all([
          connection.invoke("GetAllUsersExceptMe"),
          connection.invoke("GetUnreadCountsForAllUsers"),
        ]);

        const usersWithExtras: User[] = allUsers.map((u: User) => ({
          ...u,
          unreadCount: unreadCounts[u.id] || 0,
        }));

        setUsers(usersWithExtras);
        setTotalMessageCount(
          usersWithExtras.reduce(
            (total, user) => total + (user.unreadCount ?? 0),
            0,
          ),
        );
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });

    return () => {
      connection.stop();
    };
  }, []);
  console.log(users, totalMessageCount);

  return (
    <Link
      href={"/chat"}
      className="relative mr-4 hidden size-10 items-center justify-center rounded-full border bg-card md:flex"
      onMouseEnter={(e) => {
        e.currentTarget.classList.add("animate-[ring_0.6s_ease-in-out]");
      }}
      onAnimationEnd={(e) => {
        e.currentTarget.classList.remove("animate-[ring_0.6s_ease-in-out]");
      }}
      style={{
        transformOrigin: "top center",
      }}
    >
      {totalMessageCount ? (
        <div className="absolute -right-2 -top-2 z-10 size-6 rounded-full">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-red-500 text-sm text-white">
            <p>{totalMessageCount}</p>
          </div>
        </div>
      ) : (
        ""
      )}
      <BellIcon className="text-foreground" />
    </Link>
  );
}

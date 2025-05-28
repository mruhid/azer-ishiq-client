"use client";
import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useSession } from "@/app/(main)/SessionProvider";
import { playNotificationSound } from "@/lib/utils";
import { Loader2, MailIcon, MessageCircleDashed, SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import MediumScreenContactList from "./MediumScreenContactList";

export interface User {
  id: number;
  userName: string;
  unreadCount?: number;
  isOnline?: boolean;
  lastMessage?: string;
}

export interface Message {
  id?: number | string;
  receiverId: number;
  senderId: number;
  groupName: null | string;
  text: string;
  sentAt: string;
}
function groupMessagesByDate(messages: Message[]) {
  const groups: { [date: string]: Message[] } = {};

  messages.forEach((msg) => {
    const date = new Date(msg.sentAt);
    const key = date.toDateString(); // e.g., "Mon Oct 07 2024"
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(msg);
  });

  return groups;
}
function getFormattedDateLabel(dateStr: string): string {
  const today = new Date();
  const msgDate = new Date(dateStr);
  const isToday = msgDate.toDateString() === today.toDateString();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = msgDate.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return msgDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ChatProvider() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageLoading, setMessageLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { session, user } = useSession();

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout>();
  const selectedUserRef = useRef<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageText]);
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL_CHAT}/chathub`, {
        accessTokenFactory: () => session,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;

    setLoading(true); // start loading

    connection
      .start()
      .then(async () => {
        console.log("✅ Connected");

        const [allUsers, unreadCounts, onlineUserIds] = await Promise.all([
          connection.invoke("GetAllUsersExceptMe"),
          connection.invoke("GetUnreadCountsForAllUsers"),
          connection.invoke("GetOnlineUserIds"),
        ]);

        const usersWithExtras: User[] = allUsers.map((u: User) => ({
          ...u,
          unreadCount: unreadCounts[u.id] || 0,
          isOnline: onlineUserIds.includes(u.id),
        }));

        setUsers(usersWithExtras);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false); // done loading regardless of success or failure
      });

    connection.on("ReceiveMessage", (message: Message) => {
      const { senderId, text, sentAt } = message;
      const currentSelected = selectedUserRef.current;
      if (senderId === currentSelected?.id) {
        playNotificationSound(false);

        setMessages((prev) => [
          ...prev,
          {
            id: prev.length > 0 ? Number(prev[prev.length - 1].id!) + 1 : 1,
            text,
            senderId,
            receiverId: currentSelected.id,
            sentAt: sentAt ? String(new Date(sentAt)) : String(new Date()),
            groupName: null,
          },
        ]);
      } else {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === senderId
              ? {
                  ...u,
                  unreadCount: (u.unreadCount || 0) + 1,
                  lastMessage: text,
                }
              : u,
          ),
        );
      }
    });

    connection.on("LoadMessages", (msgs: Message[]) => {
      setMessages(msgs);
      setMessageLoading(false);
    });

    connection.on("UserOnline", (userId: number) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isOnline: true } : u)),
      );
      setSelectedUser((prev) => (prev ? { ...prev, isOnline: true } : prev));
    });

    connection.on("UserOffline", (userId: number) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isOnline: false } : u)),
      );
      setSelectedUser((prev) => (prev ? { ...prev, isOnline: false } : prev));
    });

    connection.on("UserTyping", (userId: number) => {
      const currentSelected = selectedUserRef.current;
      if (currentSelected?.id === userId) {
        setIsTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 1500);
      }
    });

    return () => {
      connection.stop();
    };
  }, []);

  const selectUser = (user: User) => {
    selectedUserRef.current = user;
    setSelectedUser(user);
    setMessages([]);

    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      connectionRef.current
        .invoke("GetMessagesWithUser", user.id)
        .catch(console.error);
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, unreadCount: 0 } : u)),
    );
  };

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || !selectedUserRef.current || !user) return;

    const connection = connectionRef.current;
    const receiver = selectedUserRef.current;

    if (!connection || connection.state !== "Connected") {
      console.warn("SignalR is not connected");
      return;
    }

    const message: Message = {
      senderId: user.id,
      receiverId: receiver.id,
      groupName: null,
      text: trimmedText,
      sentAt: new Date().toISOString(),
    };

    try {
      await connection.invoke("SendPrivateMessage", receiver.id, trimmedText);
      playNotificationSound(true);

      setMessages((prev) => [...prev, message]);
      setMessageText("");
    } catch (error) {
      console.error("Message send failed:", error);
    }
  };

  const handleTyping = () => {
    if (
      selectedUser &&
      connectionRef.current?.state === signalR.HubConnectionState.Connected
    ) {
      connectionRef.current
        .invoke("Typing", selectedUser.id)
        .catch(console.error);
    }
  };
  return (
    <div className="flex h-full w-full items-start justify-start">
      {/* Contact */}

      <div className="flex h-full rounded-l-xl border border-r-0 border-primary bg-muted-foreground/40 backdrop-blur-xl lg:hidden">
        {/* Medium screen contact list */}
        <MediumScreenContactList
          loading={loading}
          users={users}
          selectUser={selectUser}
        />
      </div>

      <div className="scrollbar-custom rounded-b-x hidden h-full w-[350px] overflow-y-auto rounded-l-xl rounded-r-none border border-primary lg:flex">
        <div className="flex w-full flex-col">
          <header className="sticky top-0 flex h-20 items-center gap-4 border-b bg-muted-foreground/40 p-4 backdrop-blur-xl">
            <div className="flex h-20 w-full items-center justify-center">
              <h1 className="text-xl font-semibold">Contact People</h1>
            </div>
          </header>

          {/* Loading State */}
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="size-14 animate-spin text-primary" />
            </div>
          ) : false ? (
            <div className="flex h-full w-full items-center justify-center">
              <h1 className="p-4 text-center text-2xl text-destructive">
                An error occurred.
              </h1>
            </div>
          ) : !loading && users && users.length > 0 ? (
            users.map((item, index) => (
              <div
                key={index}
                onClick={() => selectUser(item)}
                className="flex cursor-pointer items-center gap-2 border-y bg-secondary px-4 py-2 transition hover:bg-muted-foreground/20"
              >
                {/* Circle avatar */}
                <div className="w-[45px]">
                  <div className="flex h-[40px] w-[40px] select-none items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white shadow-md">
                    {item.userName.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* User info and unread count */}
                <div className="flex w-full items-center justify-between rounded-lg py-2 transition">
                  {/* User Info + Status */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize text-foreground">
                      {item.userName}
                    </span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        item.isOnline ? "bg-green-500" : "bg-red-500"
                      }`}
                      title={item.isOnline ? "Online" : "Offline"}
                    />
                  </div>

                  {/* Unread Count */}
                  {item.unreadCount ? (
                    <div className="flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                      {item.unreadCount}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <h1 className="p-4 text-center text-2xl text-muted-foreground">
                No people found.
              </h1>
            </div>
          )}
        </div>
      </div>
      {/* Chats */}
      {selectedUser ? (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-r-xl border-y border-r border-primary">
          {/* Header */}
          <header className="flex h-20 items-center gap-4 border-b border-primary bg-muted-foreground/40 p-4 backdrop-blur-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
              {selectedUser.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-lg font-semibold capitalize">
                {selectedUser.userName}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedUser.isOnline ? (
                  <div className="flex items-center gap-x-1">
                    <p>Online</p>
                    <div className="h-3 w-3 rounded-full bg-green-600"></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-x-1">
                    <p>Ofline</p>
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground"></div>
            </div>
          </header>

          {/* Messages */}

          <div className="flex-1 space-y-2 overflow-y-auto border-l border-primary bg-secondary p-4 lg:border-l-0">
            {!messageLoading ? (
              messages && messages.length > 0 ? (
                Object.entries(groupMessagesByDate(messages)).map(
                  ([dateStr, msgs]) => (
                    <div key={dateStr}>
                      {/* Date Separator */}
                      <div className="mx-auto my-4 w-fit rounded-full bg-gray-400 px-4 py-1 text-center text-xs font-semibold text-white shadow">
                        {getFormattedDateLabel(dateStr)}
                      </div>

                      {/* Messages in that group */}
                      {msgs.map((msg, index) => {
                        return (
                          <div
                            key={index}
                            className={`relative my-2 max-w-[300px] rounded-2xl px-4 py-2 shadow ${
                              msg.senderId == user?.id
                                ? "ml-auto rounded-br-none bg-green-700 text-white"
                                : "mr-auto rounded-bl-none border border-muted-foreground/30 bg-card text-foreground"
                            }`}
                          >
                            {/* Message text */}
                            <div className="break-words text-sm">
                              {msg.text}
                            </div>

                            {/* Timestamp */}
                            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                              {new Date(msg.sentAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ),
                )
              ) : (
                <div className="mt-2 flex w-full items-center justify-center">
                  <div className="flex items-center justify-center gap-x-2 rounded-xl bg-muted-foreground/50 px-6 py-3 text-sm text-foreground shadow-md backdrop-blur-2xl">
                    <MailIcon />{" "}
                    <p>
                      No messages with this user yet. Start the conversation!
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex w-full items-center justify-center">
                <Loader2 className="size-15 animate-spin" />
              </div>
            )}

            {isTyping ? (
              <div
                className={`my-2 mr-auto flex max-w-[80px] items-center justify-center gap-x-2 rounded-2xl rounded-bl-none bg-muted-foreground/50 px-4 py-2 text-sm text-muted-foreground transition-opacity duration-300 ${
                  isTyping ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <span className="typing-dot">•</span>
                <span className="typing-dot">•</span>
                <span className="typing-dot">•</span>
              </div>
            ) : (
              ""
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 border-l border-t border-primary bg-muted-foreground/10 p-4 shadow-sm lg:border-l-0">
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={(e) => {
                handleTyping();
                setMessageText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // prevent newline
                  sendMessage(messageText);
                }
              }}
              autoFocus
              placeholder="Type your message..."
              className={`max-h-[200px] flex-1 resize-none overflow-hidden overflow-y-auto rounded-xl border border-muted-foreground/40 bg-secondary p-2 text-sm leading-tight focus:border-[2px] focus:border-primary focus:outline-none`}
              rows={1}
              style={{
                lineHeight: "1.4",
                minHeight: "40px",
                maxHeight: "150px",
              }}
            />
            <Button
              onClick={() => sendMessage(messageText)}
              className="rounded-xl bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            >
              <SendIcon />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-r-xl border-y border-r border-primary bg-muted/30 text-muted-foreground">
          {/* Icon */}
          <div className="mb-4 rounded-full bg-muted p-6 shadow-sm">
            <MessageCircleDashed size={80} />
          </div>

          {/* Title */}
          <h2 className="mb-2 text-2xl font-semibold">
            No conversation selected
          </h2>

          {/* Subtext */}
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            Select a person from your contact list or start a new conversation
            to begin chatting.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MessageCircleDashed, SendIcon } from "lucide-react";
import { UserCells } from "@/lib/type";
import { useSession } from "@/app/(main)/SessionProvider";
import * as signalR from "@microsoft/signalr";
import { playNotificationSound } from "@/lib/utils";
import { ChatPeopleProps } from "./ChatProvider";
interface Message {
  id?: number;
  text: string;
  groupName: string | null;
  receiverId: number;
  senderId: number;
  sentAt: Date;
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

const Chat = ({ resepien,setUsers }: { 
  resepien: UserCells | null ;
  setUsers:Dispatch<SetStateAction<ChatPeopleProps | null>>;
}

) => {
  if (!resepien) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-r-xl border-y border-r border-primary bg-muted/30 text-muted-foreground">
        {/* Icon */}
        <div className="mb-4 rounded-full bg-muted p-6 shadow-sm">
          <MessageCircleDashed size={80}/>
         
        </div>

        {/* Title */}
        <h2 className="mb-2 text-2xl font-semibold">
          No conversation selected
        </h2>

        {/* Subtext */}
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          Select a person from your contact list or start a new conversation to
          begin chatting.
        </p>
      </div>
    );
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { session, user } = useSession();
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create SignalR connection on mount
  useEffect(() => {
    if (!session || !resepien) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL_CHAT}/chathub`, {
        accessTokenFactory: () => session, // Adjust according to your session shape
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;

    connection.on("ReceiveMessage", (senderId: number, message: string) => {

      if (String(senderId) === String(resepien.id) || senderId === user?.id) {
        playNotificationSound(false);
        setMessages((prev) => {
          const newMessage = {
            id: prev.length > 0 ? prev[prev.length - 1].id! + 1 : 1,
            text: message,
            groupName: null,
            receiverId: 0,
            senderId: senderId,
            sentAt: new Date(),
          };


          return [...prev, newMessage];
        });
      }
    });

    connection.on("LoadMessages", (loadedMessages: Message[]) => {
      setMessages(loadedMessages);
    });

    const start = async () => {
      try {
        await connection.start();
        await connection.invoke("GetMessagesWithUser", resepien.id);
      } catch (err) {
        console.error("SignalR start failed:", err);
      }
    };

    start();

    return () => {
      connection.off("ReceiveMessage");
      connection.off("LoadMessages");
      connection.stop();
    };
  }, [resepien.id, session]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const connection = connectionRef.current;
    if (connection && connection.state === "Connected") {
      const message: Message = {
        senderId: user.id,
        receiverId: resepien.id,
        groupName: null,
        text,
        sentAt: new Date(),
      };

      try {
        await connection.invoke("SendMessage", resepien.id, text);
        playNotificationSound(true);
        setMessages((prev) => [...prev, message]);
        setInput("");
      } catch (err) {
        console.error("Send failed", err);
      }
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-r-xl border-y border-r border-primary">
      {/* Header */}
      <header className="flex h-20 items-center gap-4 border-b bg-muted-foreground/40 p-4 backdrop-blur-xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
          {resepien.userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-lg font-semibold capitalize">
            {resepien.userName}
          </div>
          <div className="text-xs text-muted-foreground">Online</div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-2 overflow-y-auto bg-secondary p-4">
        {Object.entries(groupMessagesByDate(messages)).map(
          ([dateStr, msgs]) => (
            <div key={dateStr}>
              <div className="mx-auto my-4 w-[100px] rounded-lg bg-gray-400 py-2 text-center text-sm font-semibold text-white">
                {getFormattedDateLabel(dateStr)}
              </div>
              {msgs.map((msg, index) => (
                <div
                  key={index}
                  className={`relative my-2 max-w-[75%] rounded-2xl px-4 py-2 shadow ${
                    msg.senderId === user?.id
                      ? "ml-auto rounded-br-none bg-green-700 text-white"
                      : "mr-auto rounded-bl-none border bg-card text-foreground"
                  }`}
                >
                  {/* Message text */}
                  <div className="break-words text-sm">{msg.text}</div>

                  {/* Timestamp & (optional) check marks */}
                  <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                    {new Date(msg.sentAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          ),
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t bg-muted-foreground/10 p-4 shadow-sm">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          autoFocus
          placeholder="Type your message..."
          className="flex-1 rounded-xl border border-muted-foreground/40 bg-secondary p-2"
        />
        <Button
          onClick={() => sendMessage(input)}
          className="rounded-xl bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  );
};

export default Chat;

// const Chat = ({ resepien }: { resepien: UserCells | null }) => {
//   if (!resepien) {
//     return <h1>error</h1>;
//   }

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState<string>("");
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const { session, user } = useSession();

//   const connectionRef = useRef<signalR.HubConnection | null>(null);

//   // Scroll to bottom on new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);
//   console.log(messages);

//   // Create SignalR connection once
//   useEffect(() => {
//     const connect = async () => {
//       const connection = new signalR.HubConnectionBuilder()
//         .withUrl("http://192.168.137.152:5252/chathub", {
//           accessTokenFactory: () => session,
//         })
//         .withAutomaticReconnect()
//         .build();

//       connectionRef.current = connection;

//       // Setup handlers once
//       connection.on("ReceiveMessage", (senderId: string, message: Message) => {
//         if (String(resepien.id) === senderId) {
//           setMessages((prev) => [...prev, message]);
//         }
//       });

//       connection.on("LoadMessages", (loadedMessages: Message[]) => {
//         setMessages(loadedMessages);
//       });

//       try {
//         await connection.start();
//         console.log("SignalR connected");
//         await connection.invoke("GetMessagesWithUser", resepien.id);
//       } catch (err) {
//         console.error("SignalR connection error:", err);
//       }
//     };

//     connect();

//     return () => {
//       connectionRef.current?.stop();
//     };
//   }, [resepien.id, session]);

//   const sendMessage = async (text: string) => {
//     if (!text.trim()) return;

//     const connection = connectionRef.current;
//     if (connection && connection.state === "Connected") {
//       const message: Message = {
//         senderId: user.id,
//         groupName: null,
//         receiverId: resepien.id,
//         text,
//         timestamp: new Date(),
//       };

//       try {
//         await connection.invoke("SendMessage", resepien.id, text);
//         setMessages((prev) => [...prev, message]);
//         setInput("");
//       } catch (err) {
//         console.error("Send failed", err);
//       }
//     }
//   };

//   return (
//     <div className="flex h-full w-full flex-col overflow-hidden rounded-r-xl border-y border-r border-primary">
//       {/* Header */}
//       <header className="flex h-20 items-center gap-4 border-b bg-muted-foreground/40 p-4 backdrop-blur-xl">
//         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
//           A
//         </div>
//         <div>
//           <div className="text-lg font-semibold capitalize">
//             {resepien.userName}
//           </div>
//           <div className="text-xs text-muted-foreground">Online</div>
//         </div>
//       </header>

//       {/* Messages */}
//       <div className="flex-1 space-y-2 overflow-y-auto bg-secondary p-4">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`max-w-xs rounded-lg px-4 py-2 shadow ${
//               msg.senderId === user.id
//                 ? "ml-auto bg-blue-100"
//                 : "mr-auto bg-muted-foreground/20"
//             }`}
//           >
//             <div className="text-sm">{msg.text}</div>
//             <div className="text-right text-[10px] text-muted-foreground/40">
//               {new Date(msg.timestamp).toLocaleTimeString()}
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="flex gap-2 border-t bg-muted-foreground/10 p-4 shadow-sm">
//         <Input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
//           autoFocus
//           placeholder="Type your message..."
//           className="flex-1 rounded-xl border border-muted-foreground/40 bg-secondary p-2"
//         />
//         <Button
//           onClick={() => sendMessage(input)}
//           className="rounded-xl bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
//         >
//           <SendIcon />
//         </Button>
//       </div>
//     </div>
//   );
// };

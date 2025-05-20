"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UserAvatar from "../UserAvatar";
import { bootChatResponse } from "./bootChatResponse";
import Link from "next/link";
import { playNotificationSound } from "@/lib/utils";

export default function AutoChat() {
  const [messages, setMessages] = useState([
    {
      from: "agent",
      text: "Salam.Azərişıq ASC-nin onlayn çatına xoş gəlmisiniz!",
    },
    {
      from: "agent",
      text: "Zəhmət olmasa müraciətinizin əhatə dairəsini seçin:",
    },
  ]);
  const [options, setOptions] = useState(Object.keys(bootChatResponse));
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSeeServices = () => {
    setMessages((prev) => [
      ...prev,
      {
        from: "agent",
        text: "Məlumat əldə etmək üçün müraciətinizin əhatə dairəsini seçin:",
      },
    ]);
    setOptions(Object.keys(bootChatResponse));
  };
  const handleSend = (side: boolean) => {
    if (newMessage.trim()) {
      setMessages((prev) => [...prev, { from: "user", text: newMessage }]);
      playNotificationSound(true);
      setNewMessage("");

      setOptions([]);
    }
  };

  const handleOptionClick = (option: string) => {
    const response = bootChatResponse[option as keyof typeof bootChatResponse];

    setMessages((prev) => [
      ...prev,
      { from: "user", text: option },
      {
        from: "agent",
        text: response.url
          ? ` ${response.message}\n [Link](${response.url})`
          : "Bu xidmət növü hazırlıq mərhələsindədir, tezliklə yaradılacaq.",
      },
    ]);
    playNotificationSound(false);

    setOptions([]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="fixed bottom-28 right-5 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-primary/90">
          <MessageCircle size={24} />
        </div>
      </SheetTrigger>
      <SheetContent className="flex w-[350px] flex-col bg-secondary ">
        <SheetHeader>
          <SheetTitle className="border-b pb-2">
            <div className="flex w-full items-center gap-3">
              <UserAvatar
                className="border-[3px] border-primary"
                avatarUrl={"azerishiq"}
              />
              <h1> Azərishıq Chat</h1>
            </div>
          </SheetTitle>
        </SheetHeader>

        <Card className="w-full flex-1 space-y-2 overflow-y-auto rounded-xl bg-secondary p-3 shadow-sm">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex w-full py-2 justify-${msg.from === "user" ? "end" : "start"}`}
            >
              <div
                className={`max-w-[200px] whitespace-pre-wrap rounded-lg p-2 text-sm ${
                  msg.from === "user"
                    ? "self-end bg-foreground font-medium text-secondary max-w-[200px] "
                    : "self-start bg-muted-foreground/10 font-medium text-foreground shadow-sm"
                }`}
              >
                {msg.text.includes("[Link](") ? (
                  <span>
                    {msg.text.split("[Link](")[0]}
                    <br />
                    <Link
                      href={msg.text.split("[Link](")[1].replace(")", "")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="mt-2 w-full rounded-xl border bg-secondary text-primary underline hover:bg-secondary">
                        Keçid üçün kilkləyin
                      </Button>
                    </Link>

                    <Button
                      onClick={handleSeeServices}
                      className="mt-2 w-full rounded-xl border bg-secondary text-foreground hover:bg-secondary"
                    >
                      Xidmətləri yenidən gör
                    </Button>
                  </span>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {options.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-start gap-2">
              {options.map((opt) => (
                <div
                  key={opt}
                  className="max-w-[200px] cursor-pointer self-start whitespace-pre-wrap rounded-lg border p-2 text-sm font-medium text-foreground shadow-sm"
                  onClick={() => handleOptionClick(opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="mt-4 flex items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            className="rounded-xl border bg-secondary"
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(true)}
          />
          <Button
            className="rounded-xl"
            variant="default"
            onClick={() => handleSend(true)}
          >
            ➤
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { BellIcon } from "lucide-react";
import Link from "next/link";

export default function NotificationBell() {
  return (
    <Link
      href={"/chat"}
      className="relative mr-4 hidden size-10 items-center justify-center rounded-full border bg-card lg:flex"
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
      <BellIcon className="text-foreground" />
    </Link>
  );
}

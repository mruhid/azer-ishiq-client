"use client";
import { useSidebar } from "@/components/ui/sidebar";
import SubscriberDataTable from "./SubscriberDataTable";

export default function SubscriberFeed() {
  const { open } = useSidebar();
  return (
    <div
      className={`mx-auto w-full space-y-4 px-2 transition-all duration-300 ${
        open ? "max-w-[1100px]" : "max-w-full px-6"
      }rounded-2xl border border-muted-foreground/40 bg-card/70 shadow-lg backdrop-blur-md`}
    >
      <SubscriberDataTable />
    </div>
  );
}

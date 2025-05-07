"use client";

import { logout } from "@/app/(auth)/action";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function LogoutBtn() {
  return (
    <Button
      onClick={() => {
        logout();
      }}
      className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-destructive px-4 py-2 text-white shadow-md transition-all duration-300 hover:scale-105 hover:border-destructive/60 hover:bg-card hover:text-destructive"
    >
      <LogOut className="h-5 w-5" />
      <span className="text-base font-medium">Logout</span>
    </Button>
  );
}

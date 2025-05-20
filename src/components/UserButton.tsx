"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  LogOutIcon,
  MessageCircleCodeIcon,
  Monitor,
  Moon,
  Settings2,
  Sun,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { logout } from "@/app/(auth)/action";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();

  const { theme, setTheme } = useTheme();

  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-full border-[3px] border-primary/60 bg-card p-1 shadow-sm transition-all hover:brightness-105",
            className,
          )}
        >
          <UserAvatar avatarUrl={"azerishiq"} size={40} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 rounded-xl border border-muted-foreground/20 shadow-xl"
      >
        <div className="mb-2 flex items-center gap-3 border-b border-muted pb-2">
          <UserAvatar avatarUrl={""} size={35} />
          <div>
            <p className="text-sm font-medium">@{user?.userName}</p>
            <p className="text-xs text-muted-foreground">Logged in</p>
          </div>
        </div>

        <Link href={`/users/${user?.id}`}>
          <DropdownMenuItem className="rounded-lg py-2 transition-all hover:bg-primary/10">
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <Link href={`/chat`}>
          <DropdownMenuItem className="rounded-lg py-2 transition-all hover:bg-primary/10">
            <MessageCircleCodeIcon className="mr-2 size-4" />
            Messages
          </DropdownMenuItem>
        </Link>
        <Link href={`/user-feedback`}>
          <DropdownMenuItem className="rounded-lg py-2 transition-all hover:bg-primary/10">
            <UserCheckIcon className="mr-2 size-4" />
            User feedback
          </DropdownMenuItem>
        </Link>
        <Link href={`/service`}>
          <DropdownMenuItem className="rounded-lg py-2 transition-all hover:bg-primary/10">
            <Settings2 className="mr-2 size-4" />
            Service
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-lg py-2">
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="rounded-lg py-2">
              <DropdownMenuItem
                className="rounded-lg py-2"
                onClick={() => setTheme("system")}
              >
                <Monitor className="mr-2 size-4" />
                System default
                {theme === "system" && <Check className="size- ms-2" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg py-2"
                onClick={() => setTheme("light")}
              >
                <Sun className="mr-2 size-4" />
                Light
                {theme === "light" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg py-2"
                onClick={() => setTheme("dark")}
              >
                <Moon className="mr-2 size-4" />
                Dark
                {theme === "dark" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            queryClient.clear();
            logout();
          }}
          className="rounded-lg py-2 transition-all hover:bg-destructive/10"
        >
          <LogOutIcon className="mr-2 size-4 text-destructive" />
          <span className="text-destructive">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

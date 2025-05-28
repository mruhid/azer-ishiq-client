import Link from "next/link";
import {
  Menu,
  LogOut,
  User,
  Home,
  Info,
  Users,
  FileText,
  MessageCircle,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSession } from "./SessionProvider";
import { logout } from "../(auth)/action";
import UserAvatar from "@/components/UserAvatar";

export default function SidebarMenu() {
  const { user } = useSession();

  const navLinks = [
    { href: "/service", label: "Xidmətlər", icon: Home },
    { href: "/about-us", label: "Haqqımızda", icon: Info },
    { href: "/developers", label: "Mühəndislər", icon: Users },
    { href: "/feedback", label: "Istək və şikayətlər", icon: MessageCircle },
    {
      href: "/about-us/documentation",
      label: "Istifadə qaydaları",
      icon: FileText,
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu size={24} />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[260px] px-5 sm:w-[300px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Menyu</SheetTitle>
        </SheetHeader>

        {user ? (
          <>
            {/* Profile Section */}
            <Link
              href={"/user-account/me"}
              className="mb-2 flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted-foreground/30"
            >
              <UserAvatar
                avatarUrl={""}
                size={35}
                className="border border-primary"
              />
              <p className="text-md font-semibold">{user.userName}</p>
            </Link>

            {/* Menu Links */}
            <nav className="space-y-3">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-[15px] font-medium text-foreground transition hover:bg-muted-foreground/30"
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              <Link
                href={`/user-account/${user.id}`}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-[15px] font-medium text-foreground transition hover:bg-muted-foreground/30"
              >
                <User size={18} />
                Profilim
              </Link>
            </nav>

            {/* Logout */}
            <div className="mt-10 border-t pt-4">
              <p className="mb-2 text-xs text-muted-foreground">
                Hesabdan çıxış
              </p>
              <Button
                className="flex w-full items-center gap-2"
                variant="destructive"
                onClick={() => logout()}
              >
                <LogOut size={18} />
                Çıxış et
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Public Menu */}
            <nav className="mt-6 space-y-3">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-[15px] font-medium text-foreground transition hover:bg-muted-foreground/30"
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              <Link
                href="/login"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-[15px] font-medium text-foreground transition hover:hover:bg-muted-foreground/30"
              >
                <LogIn size={18} />
                Giriş
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-[15px] font-medium text-foreground transition hover:hover:bg-muted-foreground/30"
              >
                <UserPlus size={18} />
                Qeydiyyat
              </Link>
            </nav>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

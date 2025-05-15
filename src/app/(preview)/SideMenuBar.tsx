import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useSession } from "./SessionProvider";
import { logout } from "../(auth)/action";

export default function SidebarMenu() {
  const { user } = useSession();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu size={30} className="text-foreground" />
      </SheetTrigger>
      <SheetContent className="w-[250px] sm:w-[300px]">
        <SheetHeader>
          <SheetTitle>Menyu</SheetTitle>
        </SheetHeader>

        {user ? (
          <>
            {/* Profile Section */}
            <div className="mb-6 mt-4 flex items-center gap-4">
              <div>
                <p className="font-semibold">{user.userName}</p>
              </div>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col space-y-4">
              <Link
                href="/service"
                className="text-lg font-medium transition hover:text-primary"
              >
                Xidmətlər
              </Link>
              <Link
                href="/about-us"
                className="text-lg font-medium transition hover:text-primary"
              >
                Haqqımızda
              </Link>
              <Link
                href="/developers"
                className="text-lg font-medium transition hover:text-primary"
              >
                Mühəndislər
              </Link>
              <Link
                href={`/user-account/${user.id}`}
                className="text-lg font-medium transition hover:text-primary"
              >
                Profilim
              </Link>
            </div>

            {/* Logout */}
            <div className="mt-10 w-full border-t pt-4">
              <p className="mb-2 text-sm text-muted-foreground">
                Hesabdan çıxış
              </p>
              <Button
                className="w-full"
                variant="destructive"
                onClick={() => logout()}
              >
                Çıxış et
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Public Links */}
            <div className="mt-6 flex flex-col space-y-4">
              <Link
                href="/service"
                className="text-lg font-medium transition hover:text-primary"
              >
                Xidmətlər
              </Link>
              <Link
                href="/about-us"
                className="text-lg font-medium transition hover:text-primary"
              >
                Haqqımızda
              </Link>
              <Link
                href="/developers"
                className="text-lg font-medium transition hover:text-primary"
              >
                Mühəndislər
              </Link>
              <Link
                href="/login"
                className="text-lg font-medium transition hover:text-primary"
              >
                Giriş
              </Link>
              <Link
                href="/signup"
                className="text-lg font-medium transition hover:text-primary"
              >
                Qeydiyyat
              </Link>
            </div>
          </>
        )}

        <SheetFooter className="mt-10">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Bağla
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

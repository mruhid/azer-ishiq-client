import { ContactIcon, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { User } from "./ChatProvider";
import { Button } from "../ui/button";
import { useState } from "react";

interface MediumScreenContactListProps {
  loading: boolean;
  users: User[];
  selectUser: (user: User) => void;
}
export default function MediumScreenContactList({
  loading,
  users,
  selectUser,
}: MediumScreenContactListProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="flex size-20 cursor-pointer items-center justify-center rounded-none rounded-l-xl lg:hidden">
          <div className="flex size-12 items-center justify-center rounded-sm border border-primary bg-secondary">
            <ContactIcon size={30} className="text-foreground" />
          </div>
        </div>
      </SheetTrigger>
      <SheetContent side={"left"} className="w-[300px] bg-secondary">
        <SheetHeader>
          <SheetTitle className="w-full py-2 text-center">Contact</SheetTitle>
        </SheetHeader>
        <div className="scrollbar-custom flex h-[450px] w-[270px] grid-cols-1 flex-col overflow-y-auto">
          {/* Loading State */}
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="size-15 animate-spin" />
            </div>
          ) : false ? (
            <div className="flex h-full w-full items-center justify-center">
              <h1 className="p-4 text-center text-2xl text-destructive">
                An error occurred.
              </h1>
            </div>
          ) : users && users.length > 0 ? (
            users.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  selectUser(item);
                  setIsOpen(false);
                }}
                className="flex cursor-pointer items-center gap-2 border-y bg-secondary px-4 py-2 transition hover:bg-muted-foreground/20"
              >
                {/* Circle avatar */}
                <div className="w-[45px]">
                  <div className="flex h-[40px] w-[40px] select-none items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white shadow-md">
                    {item.userName.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* User info and unread count */}
                <div className="flex w-full items-center justify-between rounded-lg py-2">
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
        <SheetFooter className="mt-10">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

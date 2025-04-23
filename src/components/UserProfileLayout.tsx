"use server";
import { UserDataProps } from "@/lib/type";
import UserAvatar from "./UserAvatar";
import { formatDate } from "date-fns";
import { Button } from "./ui/button";
import { logout } from "@/app/(auth)/action";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { validateRequest } from "@/lib/session";

export default async function UserProfileLayout({
  userInfo,
  userId,
}: {
  userInfo: UserDataProps;
  userId: number;
}) {
  const { user: loggedInUser } = await validateRequest();
  return (
    <div className="col-span-1 rounded-2xl border border-muted-foreground/40 bg-card p-6 shadow-md md:col-span-1">
      <UserAvatar className="mx-auto my-2" avatarUrl={""} size={130} />
      <div className="space-y-1 text-center">
        <p className="text-lg font-semibold">{userInfo.userName}</p>
        <p className="text-muted-foreground">{userInfo.email}</p>
        <p className="text-muted-foreground">{userInfo.phoneNumber}</p>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm font-semibold">User's role</p>
          <p className="text-muted-foreground">
            {userInfo.userRoles
              .slice()
              .sort((a, b) => a.localeCompare(b))
              .map((item, index) => (
                <span key={index}>
                  {item}
                  {index < userInfo.userRoles.length - 1 ? ", " : ""}
                </span>
              ))}
          </p>
        </div>
        <div className="flex w-full items-center justify-between">
          <p className="text-sm font-semibold">Ip address</p>
          <p className="text-muted-foreground">{userInfo.ipAddress}</p>
        </div>
        <div className="flex w-full items-center justify-between">
          <p className="text-sm font-semibold">Member since</p>
          <p className="text-muted-foreground">
            {" "}
            {formatDate(userInfo.createdAt, "MMM d, yyyy")}
          </p>
        </div>
      </div>
      {Number(userId) === Number(loggedInUser?.id) ? (
        <Button
          onClick={logout}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-destructive px-4 py-2 text-white shadow-md transition-all duration-300 hover:scale-105 hover:border-destructive/60 hover:bg-card hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-base font-medium">Logout</span>
        </Button>
      ) : (
        <Link href={`mailto:${userInfo.email}`} target="_blank">
          <Button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-primary px-4 py-2 text-white shadow-md transition-all duration-300 hover:scale-105 hover:border-muted-foreground/70 hover:bg-card hover:text-primary">
            Send Email
          </Button>
        </Link>
      )}
    </div>
  );
}

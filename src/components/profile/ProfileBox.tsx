"use server";
import { UserDataProps } from "@/lib/type";
import { formatDate } from "date-fns";
import Link from "next/link";
import { validateRequest } from "@/lib/session";
import LogoutBtn from "../LogoutBtn";
import { Button } from "../ui/button";
import UserAvatar from "../UserAvatar";

export default async function UserProfileLayout({
  userInfo,
  isAdmin,
  userId,
  dashboard,
}: {
  userInfo: UserDataProps;
  userId: number | string;
  isAdmin: boolean;
  dashboard: boolean;
}) {
  const { user: loggedInUser } = await validateRequest();

  return (
    <div className="col-span-1 rounded-2xl border border-muted-foreground/40 bg-card p-6 shadow-md md:col-span-1">
      <UserAvatar
        className="mx-auto my-2 border border-primary"
        avatarUrl={""}
        size={130}
      />
      <div className="space-y-1 text-center">
        <p className="text-lg font-semibold">{userInfo.userName}</p>
        <p className="text-muted-foreground">{userInfo.email}</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-2">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm font-semibold">
            {dashboard ? "Phone" : "Telefon"}
          </p>
          <p className="text-muted-foreground">{userInfo.phoneNumber}</p>
        </div>

        <div className="flex w-full items-center justify-between">
          <p className="text-sm font-semibold">
            {dashboard ? "Registration Date" : "Qeydiyyat tarixi"}
          </p>
          <p className="text-muted-foreground">
            {formatDate(userInfo.createdAt, "MMM d, yyyy")}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="mt-2 flex w-full flex-col items-center justify-center gap-2">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm font-semibold">IP</p>
            <p className="text-muted-foreground">{userInfo.ipAddress}</p>
          </div>

          <div className="flex w-full items-center justify-between">
            <p className="text-sm font-semibold">
              {dashboard ? "Roles" : "Rollar"}
            </p>
            <p className="text-muted-foreground">
              {userInfo.userRoles
                .slice(0, 3)
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
            <p className="text-sm font-semibold">
              {dashboard ? "Block Status" : "Blok status"}
            </p>
            <p className="text-muted-foreground">
              {userInfo.isBlocked
                ? dashboard
                  ? "Blocked"
                  : "Bloklanıb"
                : dashboard
                  ? "Unblocked"
                  : "Bloklanmayıb"}
            </p>
          </div>
        </div>
      )}

      {Number(userId) === Number(loggedInUser?.id) || userId === "me" ? (
        <LogoutBtn />
      ) : (
        <Link href={`mailto:${userInfo.email}`} target="_blank">
          <Button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-primary px-4 py-2 text-white shadow-md transition-all duration-300 hover:scale-105 hover:border-muted-foreground/70 hover:bg-card hover:text-primary">
            {dashboard ? "Send Email" : "Email göndər"}
          </Button>
        </Link>
      )}
    </div>
  );
}

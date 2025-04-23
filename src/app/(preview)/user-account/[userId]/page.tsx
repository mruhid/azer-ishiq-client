"use server";
import { logout } from "@/app/(auth)/action";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { validateRequest } from "@/lib/session";
import { UserDataProps } from "@/lib/type";
import { sendRequest } from "@/lib/utils";
import { formatDate } from "date-fns";
import { LogOut } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import StatusBar from "./StatusBar";
import UserProfileLayout from "@/components/UserProfileLayout";

const getUser = cache(async (id: number): Promise<UserDataProps | null> => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      console.warn("Session not found");
      return null;
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`;
    const user = await sendRequest<UserDataProps>(url, "GET", session);
    if (!user) notFound();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
});
type Props = {
  params: {
    userId: number;
  };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUser(Number(params.userId));
  return {
    title: user ? `(${user.userName})-Profile` : "Profile Not Found",
  };
}

export default async function Page({ params }: Props) {
  const user = await getUser(params.userId);
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) redirect("/login");
  if (!user) return notFound();
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1000px] bg-secondary text-foreground">
      {/* Main Content */}
      <div className="flex-1 px-10 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <UserProfileLayout userInfo={user} userId={params.userId} />
          {/* <div className="col-span-1 rounded-2xl border border-muted-foreground/40 bg-card p-6 shadow-md md:col-span-1">
            <UserAvatar className="mx-auto my-2" avatarUrl={""} size={130} />
            <div className="space-y-1 text-center">
              <p className="text-lg font-semibold">{user.userName}</p>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-muted-foreground">{user.phoneNumber}</p>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <div className="flex w-full items-center justify-between">
                <p className="text-sm font-semibold">User's role</p>
                <p className="text-muted-foreground">
                  {user.userRoles
                    .slice()
                    .sort((a, b) => a.localeCompare(b))
                    .map((item, index) => (
                      <span key={index}>
                        {item}
                        {index < user.userRoles.length - 1 ? ", " : ""}
                      </span>
                    ))}
                </p>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-sm font-semibold">Ip address</p>
                <p className="text-muted-foreground">{user.ipAddress}</p>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-sm font-semibold">Member since</p>
                <p className="text-muted-foreground">
                  {" "}
                  {formatDate(user.createdAt, "MMM d, yyyy")}
                </p>
              </div>
            </div>
            {Number(params.userId) === Number(loggedInUser?.id) ? (
              <Button
                onClick={logout}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-destructive px-4 py-2 text-white shadow-md transition-all duration-300 hover:scale-105 hover:border-destructive/60 hover:bg-card hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-base font-medium">Logout</span>
              </Button>
            ) : (
              <Link href={`mailto:${user.email}`} target="_blank">
                <Button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-primary px-4 py-2 text-white shadow-md transition-all duration-300 hover:scale-105 hover:border-muted-foreground/70 hover:bg-card hover:text-primary">
                  Send Email
                </Button>
              </Link>
            )}
          </div> */}

          {/* Accounts */}
          <div className="col-span-1 ml-2">
            <div className="mb-8 rounded-2xl border border-muted-foreground/40 bg-card p-6 shadow-md">
              <h3 className="mb-4 text-lg font-bold">My xPay accounts</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Active account</span>
                  <span className="text-gray-600">8430 5689 6890 4256</span>
                  <button className="rounded-md bg-red-500 px-3 py-1 text-white">
                    Block Account
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Blocked account</span>
                  <span className="text-gray-600">8430 5689 4256</span>
                  <button className="rounded-md bg-green-500 px-3 py-1 text-white">
                    Unblock account
                  </button>
                </div>
              </div>
            </div>
            {params.userId == loggedInUser.id ? <StatusBar /> : ""}
          </div>
        </div>
      </div>
    </main>
  );
}

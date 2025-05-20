import { UserDataProps } from "@/lib/type";
import StatusBar from "./StatusBar";
import UserProfileLayout from "./ProfileBox";

export default function ProfileLayout({
  user,
  session,
  userId,
  isAdmin,
  loggedInUserId,
  dashboard,
}: {
  user: UserDataProps;
  session: string;
  userId: number | string;
  isAdmin: boolean;
  loggedInUserId: number;
  dashboard?: boolean;
}) {
  const profileStyle =
    userId == loggedInUserId || userId == "me"
      ? `grid  grid-cols-1 gap-6 md:grid-cols-2`
      : `grid mx-auto grid-cols-1 max-w-[500px]`;
  return (
    <div className="flex-1 px-10 py-8">
      <div className={profileStyle}>
        {/* Profile Card */}
        <UserProfileLayout
          dashboard={dashboard ? true : false}
          isAdmin={isAdmin}
          userInfo={user}
          userId={userId}
        />
        {/* Accounts */}
        <div className="col-span-1 ml-2">
          {userId == loggedInUserId || userId == "me" ? (
            <StatusBar
              dashboard={dashboard ? true : false}
              session={session}
              userId={userId}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useUserInformation } from "@/app/(main)/UserInformationContext";
import { motion } from "framer-motion";
import { Circle, Mail, PhoneIcon, XIcon } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { useQuery } from "@tanstack/react-query";
import { UserDataProps } from "@/lib/type";
import { useSession } from "@/app/(main)/SessionProvider";
import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

const UserInformationSideBar: React.FC = () => {
  const { session } = useSession();
  const { isOpen, setId, UserId, toggleSidebar } = useUserInformation();
  if (!isOpen || !UserId) return null;

  const {
    data: userData,
    isPending,
    isError,
  } = useQuery<UserDataProps>({
    queryKey: ["userData", UserId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${UserId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return response.json();
    },

    staleTime: Infinity,
  });

  if (isPending) {
    return <UserCardSkeleton />;
  }
  if (isError) {
    return <UserCardError />;
  }

  const date = new Date(userData.createdAt);

  const formatted = date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <motion.div
      className="fixed right-0 top-0 z-50 h-screen w-[280px] bg-card py-5 opacity-50 shadow-md md:sticky md:opacity-100"
      initial={{ right: "-300px", opacity: 0 }}
      animate={{ right: 0, opacity: 1 }}
      exit={{ right: "-300px", opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 30,
        opacity: { duration: 0.5 },
        right: { duration: 0.5 },
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-[260px] flex-col items-start justify-center rounded-xl bg-secondary shadow-md">
        <div className="flex w-full items-start justify-between px-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex cursor-pointer items-center gap-2">
                  <Circle
                    size={20}
                    className={`rounded-full ${userData.isBlocked ? "bg-red-600 text-red-600" : "bg-green-600 text-green-600"} `}
                  />
                  <h2 className="text-lg font-semibold">{userData.userName}</h2>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-start text-[12px]">
                  This user are {userData.isBlocked ? "blocked" : "unblocked"}{" "}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <XIcon
            onClick={() => {
              toggleSidebar();
              setId(0);
            }}
            className="rounded-full border border-secondary transition-all duration-300 hover:border-foreground/20"
          />
        </div>

        <div className="my-2 w-full py-2">
          <UserAvatar className="mx-auto shadow-md" size={130} avatarUrl={""} />
        </div>

        <div className="flex w-full items-center justify-between px-2 py-2">
          <div className="my-1 flex w-[120px] flex-col items-start justify-start">
            <p className="text-start text-[12px]">
              +
              {userData.phoneNumber ? userData.phoneNumber : "Number not found"}
            </p>
            <div className="flex h-[40px] w-full cursor-pointer items-center justify-center gap-3 rounded-sm border border-primary bg-primary capitalize text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary">
              <PhoneIcon />
              <p>Call</p>
            </div>
          </div>
          <div className="my-1 flex w-[120px] flex-col items-start justify-start">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="cursor-pointer text-start text-[12px]">
                    {userData.email.slice(0, 17)}...
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-start text-[12px]">{userData.email}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex h-[40px] w-full cursor-pointer items-center justify-center gap-3 rounded-sm border border-primary bg-card capitalize text-primary transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-primary hover:text-white">
              <Mail />
              <p>Email</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <section className="mx-auto mt-6 w-full space-y-4">
          <h3 className="mx-2 text-sm font-semibold text-muted-foreground">
            User Info
          </h3>
          <div className="mx-auto w-full max-w-[236px] space-y-3 rounded-md bg-card p-3 shadow-sm">
            <InfoRow label="Username" value={userData.userName} />
            <InfoRow
              label="Role"
              value={userData.userRoles.map((item, index) => (
                <span key={index}>
                  {item}
                  {index < userData.userRoles.length - 1 ? ", " : ""}
                </span>
              ))}
            />
            <InfoRow label="IP Address" value={userData.ipAddress} />
            <InfoRow label="Registered" value={formatted} />
            <InfoRow label="Proficiency" value="Engineer" />
            <InfoRow label="Location" value="Baku" />
          </div>
        </section>
      </div>
    </motion.div>
  );
};
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | ReactNode;
}) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);
export function UserCardSkeleton() {
  const { setId, toggleSidebar } = useUserInformation();

  return (
    <div className="fixed right-0 top-0 z-50 h-screen w-[280px] bg-card py-5 opacity-50 shadow-md md:sticky md:opacity-100">
      <div className="mx-auto flex h-full w-full max-w-[260px] flex-col items-start justify-center rounded-xl bg-secondary py-2 shadow-md">
        <div className="mt-4 flex w-full items-start justify-between px-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full bg-muted-foreground/60" />
            <Skeleton className="h-5 w-20 bg-muted-foreground/60" />
          </div>
          <XIcon
            onClick={() => {
              toggleSidebar();
              setId(0);
            }}
            className="rounded-full border border-secondary transition-all duration-300 hover:border-foreground/20"
          />
        </div>

        <div className="my-2 w-full py-2">
          <Skeleton className="mx-auto h-[130px] w-[130px] rounded-full bg-muted-foreground/60" />
        </div>

        <div className="flex w-full items-center justify-between px-2 py-2">
          <div className="my-1 flex w-[120px] flex-col items-start justify-start gap-2">
            <Skeleton className="h-4 w-[100px] bg-muted-foreground/60" />
            <Skeleton className="h-10 w-full rounded-sm bg-muted-foreground/60" />
          </div>
          <div className="my-1 flex w-[120px] flex-col items-start justify-start gap-2">
            <Skeleton className="h-4 w-[100px] bg-muted-foreground/60" />
            <Skeleton className="h-10 w-full rounded-sm bg-muted-foreground/60" />
          </div>
        </div>

        <section className="mx-auto mt-6 w-full space-y-4">
          <Skeleton className="mx-2 h-4 w-20 bg-muted-foreground/60" />
          <div className="mx-auto w-full max-w-[236px] space-y-3 rounded-md bg-card p-3 shadow-sm">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="space-y-1">
                <Skeleton className="h-3 w-20 bg-muted-foreground/60" />
                <Skeleton className="h-4 w-full bg-muted-foreground/60" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
export function UserCardError() {
  const { setId, toggleSidebar } = useUserInformation();
  return (
    <div className="fixed right-0 top-0 z-50 h-screen w-[280px] bg-card py-5 opacity-50 shadow-md md:sticky md:opacity-100">
      <div className="mx-auto h-full w-full max-w-[260px] rounded-xl bg-secondary py-2 shadow-md">
        <div className="mx-auto flex w-full max-w-[260px] flex-col items-start justify-center">
          <div className="mt-4 flex w-full items-start justify-between px-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Circle
                      size={20}
                      className={`rounded-full bg-red-600 text-red-600`}
                    />
                    <h2 className="text-lg font-semibold">Server Error</h2>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-start text-[12px]">
                    Server did not response
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <XIcon
              onClick={() => {
                toggleSidebar();
                setId(0);
              }}
              className="rounded-full border border-secondary transition-all duration-300 hover:border-foreground/20"
            />
          </div>

          <div className="my-2 w-full py-2">
            <UserAvatar
              className="mx-auto shadow-md"
              size={130}
              avatarUrl={""}
            />
          </div>
          <div className="my-2 w-full py-2">
            <p className="mx-2 rounded-md border border-muted-foreground/60 bg-card py-2 text-center text-xl font-medium text-destructive">
              Failed to load user data.
            </p>
            <p className="text-md mx-2 mt-2 rounded-md border border-muted-foreground/60 bg-card px-1 py-2 text-start font-medium text-destructive">
              There may be some error on this server or due to the development
              work of our engineers, please log in again after a while{" "}
            </p>
          </div>
          <Button
            onClick={() => {
              toggleSidebar();
              setId(0);
            }}
            className="w-full rounded-sm border border-transparent bg-primary text-white transition-all duration-300 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
export default UserInformationSideBar;

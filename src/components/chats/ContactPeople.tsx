"use client";

import { fetchQueryFN } from "@/app/(main)/fetchQueryFN";
import { useSession } from "@/app/(main)/SessionProvider";
import { UserCells, UserManagementProps } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export default function ContactPeople({
  setResepien,
}: {
  setResepien: Dispatch<SetStateAction<UserCells | null>>;
}) {
  const { session, user } = useSession();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/?page=${pageNumber}&pageSize=20`;
  const {
    data: contacts,
    error,
    isPending,
    isError,
  } = useQuery<UserManagementProps>({
    queryKey: ["user-message-contact-feed", pageNumber],
    queryFn: fetchQueryFN<UserManagementProps>(url, session),
    staleTime: Infinity,
  });

  let filteredContacts: UserCells[] | undefined = contacts?.items.filter((f) =>
    f.userRoles.some((role) => role.toLowerCase() !== "user"),
  );

  const me = filteredContacts?.find((f) => f.id === user.id);

  if (filteredContacts && me) {
    filteredContacts = filteredContacts.filter((f) => f.id !== user.id);
    filteredContacts = [{ ...me, userName: "Me" }, ...filteredContacts];
  }

  return (
    <ContactsView
      isPending={isPending}
      isError={isError}
      setResepien={setResepien}
      contact={filteredContacts}
    />
  );
}

export function ContactsView({
  contact,
  setResepien,
  isError,
  isPending,
}: {
  contact: UserCells[] | undefined;
  setResepien: Dispatch<SetStateAction<UserCells | null>>;
  isError: boolean;
  isPending: boolean;
}) {
  return (
    <div className="scrollbar-custom rounded-b-x h-full w-[350px] overflow-y-auto rounded-l-xl rounded-r-none border border-primary">
      <div className="grid w-full grid-cols-1">
        <header className="sticky top-0 flex h-20 items-center gap-4 border-b bg-muted-foreground/40 p-4 backdrop-blur-xl">
          <h1 className="text-xl font-semibold">Contact people</h1>
        </header>

        {/* Loading State */}
        {isPending ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="size-15 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex h-full w-full items-center justify-center">
            <h1 className="p-4 text-center text-2xl text-destructive">
              An error occurred.
            </h1>
          </div>
        ) : contact && contact.length > 0 ? (
          contact.map((item, index) => (
            <div
              key={index}
              onClick={() => setResepien(item)}
              className="flex cursor-pointer items-center gap-2 border-y bg-secondary px-4 py-2 transition hover:bg-muted-foreground/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold text-secondary">
                {item.userName.slice(0, 1).toUpperCase()}
              </div>
              <div className="font-medium text-foreground">{item.userName}</div>
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
    </div>
  );
}

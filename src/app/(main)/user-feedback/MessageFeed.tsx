"use client";

import { FeedBackProps } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import { fetchQueryFN } from "../fetchQueryFN";
import { useSession } from "../SessionProvider";
import MessageBox from "@/components/MessageBox";
import { useState } from "react";
import { PaginationBox } from "@/components/PaginationBox";
import { AlertCircle, Loader2 } from "lucide-react";

export default function MessageFeed({ type }: { type: string }) {
  const { session } = useSession();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/ElectronicAppeal?Page=${pageNumber}&PageSize=10${type !== "default" ? `&IsRead=${type === "read"}` : ""} `;

  const {
    data: messages,
    isPending,
    isError,
  } = useQuery<FeedBackProps>({
    queryKey: [
      "user-feedback",
      pageNumber,
      type !== "default" ? type == "read" : "all",
    ],
    queryFn: fetchQueryFN<FeedBackProps>(url, session),
    staleTime: Infinity,
  });

  if (isPending) {
    return (
      <div className="mx-auto w-full">
        <Loader2 className="size-205 mx-auto animate-spin" />
      </div>
    );
  }
  if (isError) {
    return (
      <h1 className="mx-auto w-full text-2xl text-destructive">Server error</h1>
    );
  }
  return (
    <div className="h-screen w-full">
      {messages.items.length ? (
        messages.items.map((item) => (
          <MessageBox
            key={item.id}
            id={item.id}
            message={item.content.slice(0, 35)}
            fullname={item.name + " " + item.surname}
            dateTime={item.createdAt}
            isRead={item.isRead}
          />
        ))
      ) : (
        <div className="flex h-20 w-full items-center justify-center gap-2 rounded-md border">
          <AlertCircle />
          <p className="text-xl font-semibold">No result</p>
        </div>
      )}
      {Math.ceil(messages.totalCount / messages.pageSize) > 1 &&
      messages.items.length > 0 ? (
        <div className="mx-2 w-full">
          <PaginationBox
            totalPage={messages.totalCount}
            page={pageNumber}
            setPageNumber={setPageNumber}
            size={Math.ceil(messages.totalCount / messages.pageSize)}
          />
        </div>
      ) : null}
    </div>
  );
}

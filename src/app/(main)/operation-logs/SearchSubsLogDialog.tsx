"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchCheck } from "lucide-react";
import { SubscriberDataProps } from "@/lib/type";
import { fetchQueryFN } from "../fetchQueryFN";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "../SessionProvider";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingButton from "@/components/LoadingButton";

export default function SearchSubsDialog() {
  const [open, setOpen] = useState(false);
  const [subCode, setSubCode] = useState("");
  const [inputCode, setInputSubCode] = useState("");

  const { session } = useSession();

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/log/by-subscriber-code/${subCode}`;

  const {
    data: subscriberData,
    isPending,
    isError,
    error,
    refetch
  } = useQuery<SubscriberDataProps[]>({
    queryKey: ["subscriber-logs-byId", subCode],
    queryFn: fetchQueryFN<SubscriberDataProps[]>(url, session),
    enabled: !!subCode,
    staleTime: Infinity,
    retry: false,
  });

  const handleSearch = () => {
    setSubCode(inputCode);
    refetch(); 

  };

  const handleDialogChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setSubCode("");
      setInputSubCode("");
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="ml-4 rounded-sm border border-transparent bg-primary text-white transition-all duration-300 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary">
          <SearchCheck className="mr-2 h-4 w-4" />
          Search log by subscriber's code
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-secondary">
        <DialogHeader>
          <DialogTitle>Search by Subscriber Code</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="Enter subscriber code..."
            value={inputCode}
            onChange={(e) => setInputSubCode(e.target.value)}
            className="bg-card"
          />
          <Button
            disabled={isPending && !inputCode}
            onClick={handleSearch}
            className="ml-4 rounded-sm border border-transparent bg-primary text-white transition-all duration-300 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary"
          >
            Search
          </Button>
        </div>

        {subCode && isPending && <SubsLoading />}
        {subCode && isError && (
          <p className="mt-4 text-center font-semibold text-destructive">
            Invalid subscriber's code,please try correct one
          </p>
        )}

        {!isPending && !isError && subscriberData && (
          <ScrollArea className="scrollbar-thin scrollbar-thumb-primary scrollbar-track-muted mt-4 h-64 w-full overflow-y-auto rounded-md border p-4">
            {subscriberData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data found</p>
            ) : (
              <div className="space-y-4">
                {subscriberData.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border bg-card p-3 shadow-sm dark:bg-muted"
                  >
                    <div className="flex w-full items-start justify-between">
                      <div className="font-semibold">{item.action}</div>
                      <div className="text-sm font-normal">
                        {item.userRoles
                          .slice()
                          .sort((a, b) => a.localeCompare(b))
                          .join(", ")}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      By {item.userName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function SubsLoading() {
  return (
    <ScrollArea className="scrollbar-thin scrollbar-thumb-primary scrollbar-track-muted mt-4 h-64 w-full overflow-y-auto rounded-md border p-4">
      <div className="space-y-4">
        <div className="rounded-md border bg-card p-3 shadow-sm dark:bg-muted">
          <div className="flex w-full items-start justify-between">
            <div className="font-semibold">
              <Skeleton className="h-6 w-28 bg-muted-foreground/60" />
            </div>
            <div className="text-sm font-normal">
              <div className="font-semibold">
                <Skeleton className="h-6 w-24 bg-muted-foreground/60" />
              </div>
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <Skeleton className="h-20 w-44 bg-muted-foreground/60" />
          </div>
        </div>
        <div className="rounded-md border bg-card p-3 shadow-sm dark:bg-muted">
          <div className="flex w-full items-start justify-between">
            <div className="font-semibold">
              <Skeleton className="h-6 w-28 bg-muted-foreground/60" />
            </div>
            <div className="text-sm font-normal">
              <div className="font-semibold">
                <Skeleton className="h-6 w-24 bg-muted-foreground/60" />
              </div>
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <Skeleton className="h-10 w-44 bg-muted-foreground/60" />
          </div>
        </div>
        <div className="rounded-md border bg-card p-3 shadow-sm dark:bg-muted">
          <div className="flex w-full items-start justify-between">
            <div className="font-semibold">
              <Skeleton className="h-6 w-28 bg-muted-foreground/60" />
            </div>
            <div className="text-sm font-normal">
              <div className="font-semibold">
                <Skeleton className="h-6 w-24 bg-muted-foreground/60" />
              </div>
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <Skeleton className="h-20 w-44 bg-muted-foreground/60" />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

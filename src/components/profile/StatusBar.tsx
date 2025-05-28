"use client";
import { fetchQueryFN } from "@/app/(main)/fetchQueryFN";
import { MyStatusProps } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function StatusBar({
  userId,
  session,
  dashboard,
}: {
  userId: number | string;
  session: string;
  dashboard: boolean;
}) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber/me`;

  const {
    data: myStatus,
    isPending,
    isError,
  } = useQuery<MyStatusProps[]>({
    queryKey: ["my-subscriber-status", userId],
    queryFn: fetchQueryFN<MyStatusProps[]>(url, session),
    retry: false,
    staleTime: Infinity,
  });

  return (
    <div
      className={`rounded-2xl border border-muted-foreground/40 bg-card p-6 shadow-md ${
        dashboard ? "p-4" : "p-6"
      }`}
    >
      <h3 className="mb-4 text-lg font-bold">
        {dashboard ? "My appeals" : "Müraciətlərim"}
      </h3>

      {!isError ? (
        isPending ? (
          Array.from({ length: dashboard ? 2 : 3 }).map((_, i) => (
            <div
              key={i}
              className="relative flex items-start gap-3 rounded p-3"
            >
              <div className="absolute -left-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-primary shadow-md"></div>
              <div className="w-full space-y-3">
                <Skeleton className="h-14 w-full rounded-xl bg-muted-foreground/70" />
              </div>
            </div>
          ))
        ) : myStatus && myStatus.length > 0 ? (
          myStatus.map((a, i) => (
            <div
              key={i}
              className="relative flex items-start gap-3 rounded p-3"
            >
              <div className="text-md absolute -left-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-md">
                {i + 1}
              </div>

              <MyStatusLevels dasboard={dashboard} data={a} />
            </div>
          ))
        ) : (
          <h1 className="py-3 text-xl font-semibold text-destructive">
            {dashboard ? "" : "Müraciət tapılmadı"}
          </h1>
        )
      ) : (
        <h1 className="py-3 text-xl font-semibold text-destructive">
          {dashboard ? "" : "Müraciət tapılmadı"}
        </h1>
      )}
    </div>
  );
}

export function MyStatusLevels({
  data,
  dasboard,
}: {
  data: MyStatusProps;
  dasboard: boolean;
}) {
  const [open, setOpen] = useState(false);

  const statusArr = !dasboard
    ? ["Qeydiyyat", "Kod açma", "Sayğac quraşdırma", "TM əlaqəsi", "Müqavilə"]
    : [
        "Registration",
        "Code generation",
        "Meter installation",
        "Transformer connection",
        "Contract",
      ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-muted-foreground/60 bg-card p-4 shadow-md transition-all duration-300 hover:border-primary hover:bg-secondary hover:text-primary">
          {!dasboard
            ? "Elektrik şəbəkəsinə qoşulma"
            : "Connection to electric network"}
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-secondary">
        <DialogHeader>
          <DialogTitle>{!dasboard ? "Müraciətim" : "My Request"}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="lex mx-auto flex items-center justify-center gap-x-1">
            {statusArr.map((item, i) => {
              const step = i + 1;
              const isActive = step <= Number(data.requestStatus);
              const showConfirmBox =
                step === 5 && Number(data.requestStatus) === 4;
              const hideConfirmText =
                Number(data.requestStatus) === 5 && step === 5;

              return showConfirmBox && !hideConfirmText ? (
                <Link
                  href={`/subscriber/${data.id}/sb-contract`}
                  className="text-md flex h-10 cursor-pointer items-center justify-center rounded-full border bg-green-100 px-3 text-center text-green-800"
                  key={i}
                >
                  <p>{!dasboard ? "Muqaviləni imzala" : "Sign the contract"}</p>
                </Link>
              ) : (
                <div
                  className={`cursor-pointer rounded-full ${isActive ? "bg-green-200 text-green-800" : "bg-red-200 text-destructive"} text-md flex h-10 w-10 items-center justify-center border text-center`}
                  key={i}
                >
                  <p>{step}</p>
                </div>
              );
            })}
          </div>
        </DialogDescription>

        <ScrollArea className="scrollbar-thin scrollbar-thumb-primary scrollbar-track-muted mt-4 h-64 w-full overflow-y-auto rounded-md border p-4">
          <div className="rounded-xl px-6 py-2">
            <div className="space-y-4 capitalize">
              <div className="flex flex-col items-center justify-start rounded-xl border bg-card p-4 shadow-sm">
                <p className="font-semibold">{data.fullName}</p>
                <ul className="my-2 w-full space-y-1">
                  <li className="flex w-full items-center justify-between">
                    <p className="text-sm">{!dasboard ? "Ünvan" : "Address"}</p>
                    <span className="text-ms items-center text-muted-foreground">
                      {data.address}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <p className="text-sm">{!dasboard ? "Telefon" : "Phone"}</p>
                    <span className="text-ms items-center text-muted-foreground">
                      {data.phoneNumber}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <p className="text-sm">FIN</p>
                    <span className="text-ms items-center text-muted-foreground">
                      {data.finCode}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <p className="text-sm">
                      {!dasboard ? "Əhali status" : "Population status"}
                    </p>
                    <span className="text-ms items-center text-muted-foreground">
                      {data.populationStatus.toLowerCase() === "population"
                        ? !dasboard
                          ? "Əhali"
                          : "Population"
                        : !dasboard
                          ? "Qeyri-əhali"
                          : "Non-population"}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <p className="text-sm">ATS</p>
                    <span className="text-ms items-center text-muted-foreground">
                      {data.ats}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <ul className="my-2 space-y-3 rounded-xl border bg-card p-4">
              <p className="text-center font-semibold">
                {!dasboard ? "Mərhələ" : "Stages"}
              </p>
              {statusArr.map((item, i) => {
                const step = i + 1;
                const isActive = step <= Number(data.requestStatus);
                const isLastStep = step === 5;
                const showConfirmLink =
                  isLastStep && Number(data.requestStatus) === 4;

                if (showConfirmLink) {
                  return (
                    <Link
                      href={`/subscriber/${data.id}/sb-contract`}
                      key={i}
                      className="flex justify-between"
                    >
                      <span>{item}</span>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-sm text-green-700">
                        {!dasboard
                          ? "Müqavilənizi təstiqləyin"
                          : "Confirm your contract"}
                      </span>
                    </Link>
                  );
                }

                return (
                  <li key={i} className="flex justify-between">
                    <span>{item}</span>
                    <span
                      className={`rounded-full ${
                        isActive
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                      } px-2 py-1 text-sm`}
                    >
                      {isActive
                        ? !dasboard
                          ? "Təstiq"
                          : "Approved"
                        : !dasboard
                          ? "Gözləmə"
                          : "Pending"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

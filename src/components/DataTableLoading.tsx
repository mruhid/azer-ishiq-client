import { Skeleton } from "./ui/skeleton";

export default function DataTableLoading() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between space-x-4 py-4">
        <div className="space-y-4">
          <Skeleton className="m-2 h-10 w-[13rem] rounded-xl bg-muted-foreground" />
        </div>
        <div className="space-y-4">
          <Skeleton className="m-2 h-10 w-32 rounded-xl bg-muted-foreground" />
        </div>
      </div>

      <div className="m-2 space-x-4">
        <div className="w-full space-y-2">
          <Skeleton className="h-[15rem] w-full rounded-xl bg-muted-foreground" />
        </div>
      </div>

      <div className="space-x-4">
        <div className="space-y-2">
          <Skeleton className="mx-auto h-10 w-52 rounded-xl bg-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
export function SubscriberTableLoading() {
  return (
    <div className="w-full rounded-xl border border-muted-foreground/80 bg-card p-2">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-4">
          <div className="m-2 text-xl font-bold">Table Loading</div>
        </div>
        <div className="space-y-4">
          <Skeleton className="m-2 h-12 w-48 rounded-xl bg-muted-foreground" />
        </div>
      </div>

      <div className="m-2">
        <div className="mb-2 flex w-full items-center justify-between">
          <div className="space-y-4">
            <Skeleton className="my-2 h-12 w-48 rounded-xl bg-muted-foreground" />
          </div>
          <div className="space-y-4">
            <Skeleton className="m-2 h-12 w-48 rounded-xl bg-muted-foreground" />
          </div>{" "}
          <div className="space-y-4">
            <Skeleton className="m-2 h-12 w-48 rounded-xl bg-muted-foreground" />
          </div>{" "}
          <div className="space-y-4">
            <Skeleton className="my-2 h-12 w-48 rounded-xl bg-muted-foreground" />
          </div>
        </div>
        <div className="w-full space-y-2">
          <Skeleton className="h-[17rem] w-full rounded-xl bg-muted-foreground" />
        </div>
      </div>

      <div>
        <div className="space-y-2">
          <Skeleton className="mx-auto h-10 w-52 rounded-xl bg-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

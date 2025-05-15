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
    <div className="w-full rounded-xl border border-muted-foreground/80 bg-card p-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xl font-bold">Table Loading</div>
        <Skeleton className="h-10 w-full rounded-xl bg-muted-foreground sm:w-48" />
      </div>

      {/* Top Filters or Action Row */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <Skeleton className="h-10 w-full rounded-xl bg-muted-foreground sm:w-48" />
        <Skeleton className="h-10 w-full rounded-xl bg-muted-foreground sm:w-48" />
        <Skeleton className="h-10 hidden sm:block w-full rounded-xl bg-muted-foreground sm:w-48" />
        <Skeleton className="h-10 hidden sm:block w-full rounded-xl bg-muted-foreground sm:w-48" />
      </div>

      {/* Table Skeleton */}
      <div className="mt-6 w-full">
        <Skeleton className="h-[17rem] w-full rounded-xl bg-muted-foreground" />
      </div>

      {/* Bottom Pagination or Action */}
      <div className="mt-6 flex justify-center">
        <Skeleton className="h-10 w-48 rounded-xl bg-muted-foreground" />
      </div>
    </div>
  );
}

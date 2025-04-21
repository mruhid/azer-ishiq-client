"use client";

import * as React from "react";
import { Search, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCells, UserManagementProps } from "@/lib/type";
import { useSession } from "../SessionProvider";
import { useQuery } from "@tanstack/react-query";
import DataTableLoading from "@/components/DataTableLoading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToggleUserBlockedMutation } from "./mutation";
import { fetchQueryFN } from "../fetchQueryFN";
import DataTableLayout from "@/components/DataTableLayout";
import { ColumnDef } from "@tanstack/react-table";
import { SelectLayout } from "@/components/FilterElementLayout";

type FilterType = {
  user: string;
  isBlocked: string;
  userName: string;
  ipAddress: string;
  createdAtFrom: string;
  createdAtTo: string;
  ip: string;
  action: boolean;
};

export default function UsersDataTable() {
  const mutation = useToggleUserBlockedMutation();
  const columns: ColumnDef<UserCells>[] = [
    {
      id: "ID",
      header: () => <div className="hidden sm:block">ID</div>,
      cell: ({ row }) => <div className="hidden sm:block">{row.index + 1}</div>,
    },
    {
      accessorKey: "userName",
      header: () => <div>User Name</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("userName")}</div>
      ),
    },
    {
      accessorKey: "userRoles",
      header: () => <div className="hidden lg:block">User Roles</div>,
      cell: ({ row }) => (
        <div className="hidden capitalize lg:block">
          {row.original.userRoles
            .slice()
            .sort((a, b) => a.localeCompare(b))
            .map((item, index) => (
              <span key={index}>
                {item}
                {index < row.original.userRoles.length - 1 ? ", " : ""}
              </span>
            ))}
        </div>
      ),
    },

    {
      accessorKey: "email",
      header: () => <div className="hidden sm:block">Email</div>,
      cell: ({ row }) => (
        <div className="hidden lowercase sm:block">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "createdAt", // Corrected the typo here
      header: () => <div className="hidden lg:block">Created At</div>,
      cell: ({ row }) => (
        <div className="hidden py-2 lg:block">
          {new Date(row.getValue("createdAt")).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      ),
    },
    {
      accessorKey: "ipAddress",
      header: () => <div className="hidden lg:block">IpAddress</div>,
      cell: ({ row }) => (
        <div className="my-2 hidden lg:block">
          {row.getValue("ipAddress")
            ? row.getValue("ipAddress")
            : "No IP Address"}
        </div>
      ),
    },
    {
      accessorKey: "failedAttempts",
      header: () => (
        <div className="hidden text-center lg:block">Failed Attempt</div>
      ),
      cell: ({ row }) => {
        const attempts = Number(row.getValue("failedAttempts"));
        let bg = "bg-green-100 text-green-700";
        if (attempts >= 0 && attempts < 2) bg = "bg-green-300 text-foreground";
        else if (attempts >= 2 && attempts < 3) bg = "bg-red-400 text-white";
        else if (attempts >= 3) bg = "bg-red-600 text-white";

        return (
          <div className="my-2 hidden justify-center lg:flex">
            <div className={`rounded-full px-3 py-1 text-sm font-medium ${bg}`}>
              {attempts}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "isBlocked",
      header: () => <div className="text-left">User IsBlocked</div>,
      cell: ({ row }) => {
        const isBlocked = row.original.isBlocked;
        const userId = row.original.id;

        const handleToggle = async () => {
          mutation.mutate({ id: userId, check: !isBlocked });
        };

        return (
          <div className="flex items-center justify-start space-x-1">
            <button
              onClick={handleToggle}
              disabled={mutation.isPending}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-500 focus:outline-none ${isBlocked ? "bg-red-500" : "bg-green-500"} ${mutation.isPending ? "cursor-wait opacity-60" : ""}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-500 ease-in-out ${isBlocked ? "translate-x-7" : "translate-x-1"}`}
              />
            </button>
            <span
              className={`text-sm font-semibold transition-colors duration-300 ${
                isBlocked ? "text-red-600" : "text-green-600"
              }`}
            >
              {mutation.isPending
                ? "Saving."
                : isBlocked
                  ? "Blocked"
                  : "Active "}
            </span>
          </div>
        );
      },
    },
  ];

  const [filterData, setFilteredData] = React.useState<FilterType>({
    user: "",
    userName: "",
    ip: "",
    ipAddress: "",
    isBlocked: "",
    createdAtFrom: "",
    createdAtTo: "",
    action: false,
  });

  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const { session } = useSession();
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/?page=${pageNumber}&pageSize=8${
    filterData.action
      ? `${filterData.userName ? `&userName=${filterData.userName}` : ""}` +
        `${filterData.ipAddress ? `&ipAddress=${filterData.ipAddress}` : ""}` +
        `${filterData.isBlocked ? `&isBlocked=${filterData.isBlocked}` : ""}` +
        `${filterData.createdAtFrom ? `&createdAtFrom=${filterData.createdAtFrom}` : ""}` +
        `${filterData.createdAtTo ? `&createdAtTo=${filterData.createdAtTo}` : ""}`
      : ""
  }`;
  const {
    data: UsersData,
    error,
    isPending,
    isError,
  } = useQuery<UserManagementProps>({
    queryKey: [
      "user-management-feed",
      pageNumber,
      ...(filterData.action
        ? [
            filterData.userName,
            filterData.ipAddress,
            filterData.isBlocked,
            filterData.createdAtFrom,
            filterData.createdAtTo,
          ]
        : []),
    ],
    queryFn: fetchQueryFN<UserManagementProps>(url, session),
    staleTime: Infinity,
  });

  if (isError) {
    return (
      <h1 className="px-2 py-4 text-center text-2xl font-semibold text-destructive">
        {(error as Error).message}
      </h1>
    );
  }
  if (isPending) {
    return <DataTableLoading />;
  }

  const handleFilter = () => {
    setFilteredData((prev) => ({
      ...prev,
      userName: prev.user,
      ipAddress: prev.ip,
      action: true,
    }));
  };
  const resetFilter = () => {
    setFilteredData({
      user: "",
      ip: "",
      userName: "",
      ipAddress: "",
      isBlocked: "",
      createdAtFrom: "",
      createdAtTo: "",
      action: false,
    });
  };
  return (
    <div className="w-full px-2">
      <div className="flex flex-col flex-wrap items-center justify-center gap-4 px-2 py-4 md:flex-row md:px-0 lg:justify-between lg:gap-0">
        <div className="flex w-full flex-col items-start justify-start gap-y-1 md:w-36">
          <p className="ml-1 text-sm font-bold">User Name</p>
          <Input
            placeholder="Filter username..."
            value={filterData.user}
            onChange={(event) =>
              setFilteredData((prev) => ({
                ...prev,
                user: event.target.value,
              }))
            }
            className="w-full bg-card"
          />
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-y-1 md:w-36">
          <p className="ml-1 text-sm font-bold">Ip Address</p>
          <Input
            placeholder="Filter ipaddress..."
            value={filterData.ip}
            onChange={(event) =>
              setFilteredData((prev) => ({
                ...prev,
                ip: event.target.value,
              }))
            }
            className="w-full bg-card"
          />
        </div>{" "}
        <div className="flex w-full flex-col items-start justify-start gap-y-1 md:w-[18rem]">
          <p className="ml-1 text-sm font-bold">From-To Date Picker</p>
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-card text-left"
                >
                  {filterData.createdAtFrom || "Select Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    filterData.createdAtFrom
                      ? new Date(filterData.createdAtFrom)
                      : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      setFilteredData((prev) => ({
                        ...prev,
                        createdAtFrom: format(date, "yyyy-MM-dd"),
                      }));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-card text-left"
                >
                  {filterData.createdAtTo || "Select End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    filterData.createdAtTo
                      ? new Date(filterData.createdAtTo)
                      : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      setFilteredData((prev) => ({
                        ...prev,
                        createdAtTo: format(date, "yyyy-MM-dd"),
                      }));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <SelectLayout
          title="User IsBlocked"
          value={String(filterData.isBlocked)}
          placeholder="Select an action"
          onChange={(value) =>
            setFilteredData((prev) => ({
              ...prev,
              isBlocked: value === "" ? "" : value,
            }))
          }
          selectData={[
            { id: "all", name: "All" },
            { id: "true", name: "Blocked users" },
            { id: "false", name: "Unblocked users" },
          ]}
          isLoading={false}
        />
        {/* <div className="flex w-full flex-col items-start justify-start gap-y-1 md:w-36">
          <p className="ml-1 text-sm font-bold">User Isblocked</p>
          <Select
            value={String(filterData.isBlocked)}
            onValueChange={(value) =>
              setFilteredData((prev) => ({
                ...prev,
                isBlocked: value === "" ? "" : value,
              }))
            }
          >
            <SelectTrigger className="w-full rounded-md bg-card text-sm font-normal">
              <SelectValue placeholder={"Select a action"} />
            </SelectTrigger>
            <SelectContent className="rounded-md bg-card text-sm font-normal">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Blocked users</SelectItem>
              <SelectItem value="false">Unblocked users</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
        <div className="hidden flex-col items-start justify-start gap-y-1 md:flex">
          <p className="ml-1 text-sm font-bold opacity-0">
            From-To Date Picker
          </p>

          <div>
            <Button
              className="ml-4 rounded-sm border border-foreground bg-card text-foreground transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary"
              onClick={resetFilter}
            >
              <TimerReset />
              Reset
            </Button>
            <Button
              className="ml-4 rounded-sm border border-transparent bg-primary text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary"
              onClick={handleFilter}
            >
              <Search /> Search
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-y-1 md:hidden">
          <p className="ml-1 text-sm font-bold opacity-0">
            From-To Date Picker
          </p>

          <div className="flex w-full flex-col gap-y-2">
            <Button
              className="w-full rounded-sm border border-foreground bg-card text-foreground transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary"
              onClick={resetFilter}
            >
              <TimerReset />
              Reset
            </Button>
            <Button
              className="w-full rounded-sm border border-transparent bg-primary text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary"
              onClick={handleFilter}
            >
              <Search /> Search
            </Button>
          </div>
        </div>
       
      </div>

      <DataTableLayout
        columns={columns}
        tableData={UsersData.items}
        pagination={{
          total: UsersData.total,
          page: pageNumber,
          setPageNumber,
          pageSize: 8,
        }}
      />
    </div>
  );
}

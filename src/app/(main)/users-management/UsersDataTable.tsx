"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Search,
  TimerReset,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  OperationCells,
  OperationLogsProps,
  UserCells,
  UserManagementProps,
} from "@/lib/type";
import { useSession } from "../SessionProvider";
import { useQuery } from "@tanstack/react-query";
import DataTableLoading from "@/components/DataTableLoading";
import { PaginationBox } from "@/components/PaginationBox";
import { useUserInformation } from "../UserInformationContext";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToggleUserBlockedMutation } from "./mutation";

type FilterType = {
  user: string;
  entryName: string;
  userName: string;
  userRole: string;
  from: string;
  to: string;
  action: boolean;
};
type Role = {
  id: string;
  name: string;
};
export default function UsersDataTable() {
  const mutation = useToggleUserBlockedMutation();
  const columns: ColumnDef<UserCells>[] = [
    { id: "ID", header: "ID", cell: ({ row }) => <div>{row.index + 1}</div> },
    {
      accessorKey: "userName",
      header: "User Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("userName")}</div>
      ),
    },
    {
      accessorKey: "userRoles",
      header: "User Roles",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.userRoles.map((item, index) => (
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
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "createdAt", // Corrected the typo here
      header: () => <div>Created At</div>,
      cell: ({ row }) => (
        <div className="py-2">
          {new Date(row.getValue("createdAt")).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
    {
      accessorKey: "ipAddress",
      header: () => <div>IpAddress</div>,
      cell: ({ row }) => (
        <div className="my-2">
          {row.getValue("ipAddress")
            ? row.getValue("ipAddress")
            : "No IP Address"}
        </div>
      ),
    },
    {
      accessorKey: "failedAttempts",
      header: () => <div className="text-center">Failed Attempt</div>,
      cell: ({ row }) => {
        const attempts = Number(row.getValue("failedAttempts"));

        let bg = "bg-green-100 text-green-700";
        if (attempts >= 0 && attempts <= 3) bg = "bg-green-300 text-foreground";
        else if (attempts > 3) bg = "bg-red-100 text-red-700";

        return (
          <div className="my-2 flex justify-center">
            <div className={`rounded-full px-3 py-1 text-sm font-medium ${bg}`}>
              {attempts}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "isBlocked",
      header: () => <div className="text-left">User Action</div>,
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
                ? "Saving..."
                : isBlocked
                  ? "Blocked"
                  : "Active"}
            </span>
          </div>
        );
      },
    },
  ];

  const [filterData, setFilteredData] = React.useState<FilterType>({
    user: "",
    userName: "",
    entryName: "",
    userRole: "",
    from: "",
    to: "",
    action: false,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const { session } = useSession();
  const { isOpen, UserId, setId, toggleSidebar } = useUserInformation();
  const {
    data: UsersData,
    isPending,
    isError,
  } = useQuery<UserManagementProps>({
    queryKey: [
      "user-management-feed",
      pageNumber,
      ...(filterData.action
        ? [
            filterData.userName,
            filterData.entryName,
            filterData.userRole,
            filterData.from,
            filterData.to,
          ]
        : []),
    ],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/?page=${pageNumber}&pageSize=8${
          filterData.action
            ? `${filterData.userName ? `&userNameSearch=${filterData.userName}` : ""}` +
              `${filterData.entryName ? `&entryName=${filterData.entryName}` : ""}` +
              `${filterData.userRole ? `&userRole=${filterData.userRole}` : ""}` +
              `${filterData.from ? `&from=${filterData.from}` : ""}` +
              `${filterData.to ? `&to=${filterData.to}` : ""}`
            : ""
        }`,
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

  const {
    data: roles,
    isPending: roleLoading,
    isError: RoleError,
  } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/roles`,
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
  const {
    data: entryNames,
    isPending: entryLoading,
    isError: entryError,
  } = useQuery<string[]>({
    queryKey: ["enrties"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/entry`,
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
  const table = useReactTable({
    data: UsersData?.items ?? [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });
  if (isError) {
    return (
      <h1 className="text-center text-xl font-bold text-destructive">
        Something went wrong .Try latter
      </h1>
    );
  }
  if (isPending) {
    return <DataTableLoading />;
  }

  const handleUserData = (id: number) => {
    toggleSidebar();
    setId(id);
  };

  const handleFilter = () => {
    setFilteredData((prev) => ({
      ...prev,
      userName: prev.user,
      action: true,
    }));
  };
  const resetFilter = () => {
    setFilteredData({
      user: "",
      userName: "",
      entryName: "",
      userRole: "",
      from: "",
      to: "",
      action: false,
    });
  };
  return (
    <div className="w-full">
      <div className="flex flex-col flex-wrap items-center justify-center gap-4 py-4 md:flex-row lg:justify-between lg:gap-0">
        <div className="flex flex-col items-start justify-start gap-y-1">
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
            className="w-36 bg-card"
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-y-1">
          <p className="ml-1 text-sm font-bold">User Role</p>
          <Select
            value={filterData.userRole}
            onValueChange={(value) =>
              setFilteredData((prev) => ({
                ...prev,
                userRole: value === "all" ? "" : value,
              }))
            }
          >
            <SelectTrigger className="font-norma w-36 rounded-md bg-card text-sm">
              <SelectValue placeholder={"Select a roles"} />
            </SelectTrigger>
            <SelectContent className="rounded-md bg-card text-sm font-normal">
              <SelectItem value="all">All</SelectItem>
              {roleLoading ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-10 w-32 rounded-md bg-muted-foreground" />
                </div>
              ) : (
                ""
              )}
              {RoleError ? (
                <SelectItem disabled value="error">
                  Error fetching role
                </SelectItem>
              ) : (
                roles?.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start justify-start gap-y-1">
          <p className="ml-1 text-sm font-bold">Entry Names</p>
          <Select
            value={filterData.entryName}
            onValueChange={(value) =>
              setFilteredData((prev) => ({
                ...prev,
                entryName: value === "all" ? "" : value,
              }))
            }
          >
            <SelectTrigger className="font-norma w-36 rounded-md bg-card text-sm">
              <SelectValue placeholder={"Select a entris"} />
            </SelectTrigger>
            <SelectContent className="rounded-md bg-card text-sm font-normal">
              <SelectItem value="all">All</SelectItem>
              {entryLoading ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-10 w-32 rounded-md bg-muted-foreground" />
                </div>
              ) : (
                ""
              )}
              {entryError ? (
                <SelectItem disabled value="error">
                  Error fetching entries
                </SelectItem>
              ) : (
                entryNames?.map((role, i) => (
                  <SelectItem key={i} value={role}>
                    {role}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>{" "}
        <div className="flex flex-col items-start justify-start gap-y-1">
          <p className="ml-1 text-sm font-bold">From-To Date Picker</p>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-36 justify-start bg-card text-left"
                >
                  {filterData.from || "Select Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    filterData.from ? new Date(filterData.from) : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      setFilteredData((prev) => ({
                        ...prev,
                        from: format(date, "yyyy-MM-dd"),
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
                  className="w-36 justify-start bg-card text-left"
                >
                  {filterData.to || "Select End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filterData.to ? new Date(filterData.to) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setFilteredData((prev) => ({
                        ...prev,
                        to: format(date, "yyyy-MM-dd"),
                      }));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-y-1">
          <p className="ml-1 text-sm font-bold opacity-0">
            From-To Date Picker
          </p>

          <div>
            <Button variant={"outline"} onClick={resetFilter}>
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
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>Columns</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      <div className="overflow-hidden rounded-xl border border-muted shadow-sm">
        <Table className="bg-card">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-2 text-sm font-semibold text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`cursor-pointer transition-all duration-300 hover:bg-muted-foreground/30`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {UsersData.items.length ? (
        <PaginationBox
          totalPage={UsersData.total}
          page={pageNumber}
          setPageNumber={setPageNumber}
          size={Math.ceil(UsersData.total / 8)}
        />
      ) : (
        ""
      )}
    </div>
  );
}

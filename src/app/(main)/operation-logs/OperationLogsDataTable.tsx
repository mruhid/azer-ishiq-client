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
import { Search, TimerReset } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OperationCells, OperationLogsProps } from "@/lib/type";
import { useSession } from "../SessionProvider";
import { useQuery } from "@tanstack/react-query";
import { SubscriberTableLoading } from "@/components/DataTableLoading";
import { PaginationBox } from "@/components/PaginationBox";
import { useUserInformation } from "../UserInformationContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, formatDate } from "date-fns";

import { fetchQueryFN } from "../fetchQueryFN";
import { SelectLayout } from "@/components/FilterElementLayout";

type FilterType = {
  user: string;
  entryName: string;
  userName: string;
  userRole: string;
  from: string;
  to: string;
  action: boolean;
};
export type Role = {
  id: string;
  name: string;
};
export default function OperationLogsDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
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
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const { session } = useSession();
  const { isOpen, UserId, setId, toggleSidebar } = useUserInformation();

  const columns: ColumnDef<OperationCells>[] = [
    {
      id: "ID",
      header: "ID",
      cell: ({ row }) => <div>{row.index + 1 + (pageNumber - 1) * 8}</div>,
    },
    {
      accessorKey: "userName",
      header: "User Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("userName")}</div>
      ),
    },
    {
      accessorKey: "userRoles",
      header: () => <div className="hidden md:block">User Roles</div>,
      cell: ({ row }) => (
        <div className="hidden capitalize md:block">
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
      accessorKey: "entryName",
      header: "Entity Name",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("entryName")}</div>
      ),
    },
    {
      accessorKey: "timestamp",
      header: () => <div className="hidden lg:block">Time Stamp</div>,
      cell: ({ row }) => (
        <div className="hidden py-2 lg:block">
          {formatDate(row.getValue("timestamp"), "MMM d, yyyy")}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: () => <div className="mr-auto">Operation</div>,
      cell: ({ row }) => {
        const value = row.original.action;

        const bgColor =
          value === "Delete"
            ? "bg-destructive"
            : value === "Edit"
              ? "bg-primary"
              : "bg-green-600";

        return (
          <div className={`rounded-full py-1 text-left font-medium capitalize`}>
            {value}
          </div>
        );
      },
    },
  ];

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/log/filtered?page=${pageNumber}&pageSize=8${
    filterData.action
      ? `${filterData.userName ? `&userNameSearch=${filterData.userName}` : ""}` +
        `${filterData.entryName ? `&entityType=${filterData.entryName}` : ""}` +
        `${filterData.userRole ? `&userRole=${filterData.userRole}` : ""}` +
        `${filterData.from ? `&from=${filterData.from}` : ""}` +
        `${filterData.to ? `&to=${filterData.to}` : ""}`
      : ""
  }`;
  const {
    data: operationLogsData,
    isPending,
    isError,
    error,
  } = useQuery<OperationLogsProps>({
    queryKey: [
      "operation-logs-table-feed",
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
    queryFn: fetchQueryFN<OperationLogsProps>(url, session),

    staleTime: Infinity,
  });

  const {
    data: roles,
    isPending: roleLoading,
    isError: RoleError,
  } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchQueryFN<Role[]>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/roles`,
      session,
    ),
    staleTime: Infinity,
  });
  const {
    data: entryNames,
    isPending: entryLoading,
    isError: entryError,
  } = useQuery<string[]>({
    queryKey: ["enrties"],
    queryFn: fetchQueryFN<string[]>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/log/entities`,
      session,
    ),

    staleTime: Infinity,
  });
  const table = useReactTable({
    data: operationLogsData?.data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  if (isError) {
    return (
      <h1 className="px-2 py-4 text-center text-2xl font-semibold text-destructive">
        {(error as Error).message}
      </h1>
    );
  }
  if (isPending) {
    return <SubscriberTableLoading />;
  }

  const handleUserData = (id: number) => {
    if (!UserId) {
      toggleSidebar();
    }
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
      <div
        className={`flex flex-col flex-wrap items-center justify-center gap-4 py-4 md:flex-row md:px-0 lg:${isOpen ? `justify-center` : `justify-between`} lg:gap-0`}
      >
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
        <SelectLayout
          title="User Role"
          placeholder="Select a roles"
          value={filterData.userRole}
          isLoading={roleLoading}
          isError={RoleError}
          onChange={(value) =>
            setFilteredData((prev) => ({
              ...prev,
              userRole: value === "all" ? "" : value,
            }))
          }
          selectData={[
            { id: "all", name: "All" },
            ...(roles || []).map((role) => ({
              id: role.name,
              name: role.name,
            })),
          ]}
        />

        <SelectLayout
          title="Entry Names"
          placeholder="Select an entry"
          value={filterData.entryName}
          onChange={(value) =>
            setFilteredData((prev) => ({
              ...prev,
              entryName: value === "all" ? "" : value,
            }))
          }
          isLoading={entryLoading}
          isError={entryError}
          selectData={[
            { id: "all", name: "All" },
            ...(entryNames || []).map((entry) => ({
              id: entry,
              name: entry,
            })),
          ]}
        />

        <div className="flex w-full flex-col items-start justify-start gap-y-1 md:w-[18rem]">
          <p className="ml-1 text-sm font-bold">From-To Date Picker</p>
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-card text-left"
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
                  className="w-full justify-start bg-card text-left"
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
                  onClick={() => handleUserData(row.original.userId)}
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

      {operationLogsData.data.length ? (
        <PaginationBox
          totalPage={operationLogsData.total}
          page={pageNumber}
          setPageNumber={setPageNumber}
          size={Math.ceil(operationLogsData.total / 8)}
        />
      ) : (
        ""
      )}
    </div>
  );
}

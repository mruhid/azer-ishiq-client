"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { PaginationBox } from "@/components/PaginationBox";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "../SessionProvider";
import DataTableLoading from "@/components/DataTableLoading";
import { useToast } from "@/components/ui/use-toast";
import { SubstationDataTableProps, SubstationItemsProps } from "@/lib/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SubstationTableMapDialog } from "./[id]/SubstationDialogs";
import { fetchQueryFN } from "../fetchQueryFN";

export const columns: ColumnDef<SubstationItemsProps>[] = [
  { id: "ID", header: "ID", cell: ({ row }) => <div>{row.index + 1}</div> },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "latitude",
    header: "Location",
    cell: ({ row }) => (
      <div>
        <SubstationTableMapDialog
          ids={{
            subsId: Number(row.original.id),
            regionId: Number(row.original.regionId),
            districtId: Number(row.original.districtId),
          }}
          initialCoords={
            row.original.longitude !== "The longitude is not specified"
              ? {
                  lat: row.getValue("latitude"),
                  lng: Number(row.original.longitude),
                }
              : null
          }
        />
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div>Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const subsId = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-auto h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="rounded-xl border border-muted-foreground/40 bg-secondary backdrop-blur-md"
            align="center"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={`/substations/${subsId}`} className="hover:underline">
                See this Substation
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>View img</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function SubstationDataTable() {
  return (
    <div className="w-full rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 shadow-lg backdrop-blur-md">
      <DefaultTable />
    </div>
  );
}

export function DefaultTable() {
  const searchParams = useSearchParams();
  const region = searchParams.get("region");
  const district = searchParams.get("district");

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const { session } = useSession();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const { toast } = useToast();
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/substation/filtered?page=${pageNumber}&pageSize=8${
    region ? `&regionId=${region}` : ""
  }${district ? `&districtId=${district}` : ""}`;
  const {
    data: substationData,
    isPending,
    isError,
    error,
  } = useQuery<SubstationDataTableProps>({
    queryKey: ["substations-table-feed", pageNumber, region, district],
    queryFn: fetchQueryFN(url, session),
    staleTime: Infinity,
  });

  const table = useReactTable({
    data: substationData?.items ?? [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
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
    return <DataTableLoading />;
  }
  return (
    <div className="w-full" id="data-table">
      <h1 className="mx-3 mt-2 text-xl font-semibold text-primary/70">
        Substations Summary
      </h1>
      <div className="flex items-center pb-4">
        <Input
          placeholder="Filter substation name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="m-2 h-12 max-w-sm rounded-xl border border-muted-foreground bg-secondary backdrop-blur-md"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto mr-2 h-12 w-32 rounded-xl border border-muted-foreground bg-secondary backdrop-blur-md"
            >
              Columns <ChevronDown size={20} className="ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="rounded-xl border border-muted-foreground/40 bg-secondary backdrop-blur-md"
            align="end"
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="m-2 rounded-xl border border-muted-foreground bg-secondary backdrop-blur-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="border-b border-muted-foreground/40"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="border-b border-muted-foreground/40"
                  key={row.id}
                  data-state={row.getIsSelected()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-20 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {Math.ceil(substationData.totalCount / substationData.pageSize) ? (
        <PaginationBox
          page={pageNumber}
          setPageNumber={setPageNumber}
          size={Math.ceil(substationData.totalCount / substationData.pageSize)}
        />
      ) : (
        ""
      )}
    </div>
  );
}

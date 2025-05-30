"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
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
import { useQuery } from "@tanstack/react-query";
import { useSession } from "../SessionProvider";
import DataTableLoading from "@/components/DataTableLoading";
import { SubstationDataTableProps, SubstationItemsProps } from "@/lib/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SubstationTableMapDialog } from "./[id]/SubstationDialogs";
import { fetchQueryFN } from "../fetchQueryFN";
import DataTableLayout from "@/components/DataTableLayout";
import UnauthorizedPage from "@/components/UnauthorizedPage";

export default function SubstationDataTable() {
  return (
    <div className="w-full rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 shadow-lg backdrop-blur-md">
      <DefaultTable />
    </div>
  );
}

export function DefaultTable() {
  const [pageNumber, setPageNumber] = React.useState<number>(1);

  const columns: ColumnDef<SubstationItemsProps>[] = [
    {
      id: "ID",
      header: "ID",
      cell: ({ row }) => <div>{row.index + 1 + (pageNumber - 1) * 8}</div>,
    },
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
              row.original.longitude || row.original.latitude
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
                <Link
                  href={`/substations/${subsId}`}
                  className="hover:underline"
                >
                  See this Substation
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const searchParams = useSearchParams();
  const region = searchParams.get("region");
  const district = searchParams.get("district");

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const { session } = useSession();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
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
    queryFn: fetchQueryFN<SubstationDataTableProps>(url, session),
    staleTime: 5000,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
  });

  const table = useReactTable({
    data: substationData?.items ?? [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
      columnVisibility,
    },
  });
  if (isError) {
    return <UnauthorizedPage />;
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
      <div className="px-1">
        <DataTableLayout
          columns={columns}
          layout="fancy"
          tableData={substationData.items}
          pagination={{
            total: substationData.totalCount,
            page: pageNumber,
            setPageNumber,
            pageSize: 8,
          }}
        />
      </div>
    </div>
  );
}

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
import { useSession } from "./SessionProvider";
import DataTableLoading from "@/components/DataTableLoading";
import { Tmitem, TmRableProps } from "@/lib/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DataTableLayout from "@/components/DataTableLayout";
import { fetchQueryFN } from "./fetchQueryFN";
import UnauthorizedPage from "@/components/UnauthorizedPage";

export default function DataTable() {
  return (
    <div className="rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 shadow-lg backdrop-blur-md">
      <DefaultTable />
    </div>
  );
}

export function DefaultTable() {
  const [pageNumber, setPageNumber] = React.useState<number>(1);

  const columns: ColumnDef<Tmitem>[] = [
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
      id: "actions",
      header: () => <div>Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const tmId = row.original.id;

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
                <Link href={`/tm/${tmId}`} className="hover:underline">
                  See this TM
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
  const substation = searchParams.get("substation");

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const { session } = useSession();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/Tm/filtered?page=${pageNumber}&pageSize=8${region ? `&regionId=${region}` : ``}${district ? `&districtId=${district}` : ``}${substation ? `&substationId=${substation}` : ``}`;

  const {
    data: tmData,
    isPending,
    isError,
  } = useQuery<TmRableProps>({
    queryKey: ["Tms-table-feed", pageNumber, region, district, substation],
    queryFn: fetchQueryFN<TmRableProps>(url, session),
    retry: 1,
    staleTime: 5000,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
  });
  const table = useReactTable({
    data: tmData?.items ?? [],
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
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter tm name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="m-2 max-w-sm rounded-xl border border-muted-foreground bg-secondary backdrop-blur-md"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto mr-2 rounded-xl border border-muted-foreground bg-secondary backdrop-blur-md"
            >
              Columns <ChevronDown />
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
          tableData={tmData.items}
          pagination={{
            total: tmData.totalCount,
            page: pageNumber,
            setPageNumber,
            pageSize: 8,
          }}
        />
      </div>
    </div>
  );
}

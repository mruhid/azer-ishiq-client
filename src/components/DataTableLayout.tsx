"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import React, { Dispatch, SetStateAction } from "react";
import { PaginationBox } from "./PaginationBox";

type DataTableLayoutProps<T> = {
  columns: ColumnDef<T>[];
  tableData: T[];
  pagination?: {
    total: number;
    page: number;
    setPageNumber: Dispatch<SetStateAction<number>>;
    pageSize: number;
  };
  layout?: string;
};
export default function DataTableLayout<T>({
  columns,
  tableData,
  pagination,
  layout,
}: DataTableLayoutProps<T>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  const renderLayout = () => {
    switch (layout) {
      case "fancy":
        return (
          <div className="m-2 rounded-xl border border-muted-foreground bg-secondary backdrop-blur-md">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    className="border-b border-muted-foreground/40"
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
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
        );

      case "grid":
        return (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            {table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="mb-2 text-sm">
                    <strong className="font-semibold">
                      {cell.column.columnDef.header as string}:{" "}
                    </strong>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );

      case "default":
      default:
        return (
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
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer transition-all duration-300 hover:bg-muted-foreground/30"
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
        );
    }
  };

  return (
    <>
      {renderLayout()}
      {pagination && tableData.length > 0 ? (
        <PaginationBox
          totalPage={pagination.total}
          page={pagination.page}
          setPageNumber={pagination.setPageNumber}
          size={Math.ceil(pagination.total / pagination.pageSize)}
        />
      ) : null}
    </>
  );
}

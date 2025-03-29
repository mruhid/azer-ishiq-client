"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Subscriber, SubscribersProps } from "@/lib/type";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useSession } from "../SessionProvider";
import DataTableLoading from "@/components/DataTableLoading";
import { Input } from "@/components/ui/input";
import { PaginationBox } from "@/components/PaginationBox";
import { useToast } from "@/components/ui/use-toast";
import {
  DistrictsResponse,
  RegionObject,
  RegionsResponse,
} from "../RegionFilter";
import kyInstance from "@/lib/ky";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { string } from "zod";

export const columns: ColumnDef<Subscriber>[] = [
  {
    accessorKey: "ats",
    header: "Ats",
    cell: ({ row }) => <div>{row.getValue("ats")}</div>,
  },
  {
    accessorKey: "regionName",
    header: "Region",
    cell: ({ row }) => <div>{row.getValue("regionName")}</div>,
  },
  {
    accessorKey: "districtName",
    header: "District",
    cell: ({ row }) => <div>{row.getValue("districtName")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "surname",
    header: "Surname",
    cell: ({ row }) => <div>{row.getValue("surname")}</div>,
  },
  {
    accessorKey: "patronymic",
    header: "Patronymic",
    cell: ({ row }) => <div>{row.getValue("patronymic")}</div>,
  },
  {
    accessorKey: "createdDate",
    header: "Time",
    cell: ({ row }) => <div>{formatDate(row.getValue("createdDate"))}</div>,
  },

  {
    accessorKey: "subscriberCode",
    header: "Subscriber code",
    cell: ({ row }) => <div>{row.getValue("subscriberCode")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const arr = new Array(4).fill(null);
      const value = row.original.status;
      return (
        <div className="flex items-center justify-center">
          {arr.map((_, i) => (
            <div
              key={i}
              className={`flex h-6 w-6 items-center justify-center text-white ${
                i + 1 <= value ? "bg-green-800" : "bg-destructive"
              }`}
            >
              Y
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "populationStatus",
    header: "Population Status",
    cell: ({ row }) => (
      <div>{row.getValue("subscriberCode") == 1 ? "Y" : "N"}</div>
    ),
  },
];

export type subscriberFilderDataType = {
  regionId: null | number;
  districtId: null | number;
  territoryId: null | number;
  streetId: null | number;
};
export default function SubscriberDataTable() {
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const { session } = useSession();
  const [subscriberFilderData, setSubscriberFilderData] =
    useState<subscriberFilderDataType>({
      regionId: null,
      districtId: null,
      territoryId: null,
      streetId: null,
    });
  const {
    data: subscriberData,
    isPending,
    isError,
  } = useQuery<SubscribersProps>({
    queryKey: [
      "subscriber-table-feed",
      pageNumber,
      [
        subscriberFilderData.regionId,
        subscriberFilderData.districtId,
        subscriberFilderData.territoryId,
        subscriberFilderData.streetId,
      ],
    ],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber/filtered?page=${pageNumber}&pageSize=5${subscriberFilderData.regionId ? `&regionId=${subscriberFilderData.regionId}` : ``}${subscriberFilderData.districtId ? `&districtId=${subscriberFilderData.districtId}` : ``}${subscriberFilderData.territoryId ? `&territoryId=${subscriberFilderData.territoryId}` : ``}${subscriberFilderData.streetId ? `&streetId=${subscriberFilderData.streetId}` : ``}`,
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

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: subscriberData?.items ?? [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
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
  return (
    <>
      <SubscriberSelect
        subscriberFilderData={subscriberFilderData}
        setSubscriberFilderData={setSubscriberFilderData}
      />
      <div className="w-full" id="data-table">
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
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  className="border-b border-muted-foreground/40"
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <Input
                            placeholder={`Filter ${header.id}`}
                            value={
                              (table
                                .getColumn(header.id)
                                ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                              table
                                .getColumn(header.id)
                                ?.setFilterValue(event.target.value)
                            }
                            className="m-2 max-w-sm rounded-xl border border-muted-foreground bg-secondary backdrop-blur-md"
                          />
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
        {subscriberData.items.length ? (
          <PaginationBox
            page={pageNumber}
            setPageNumber={setPageNumber}
            size={Math.ceil(
              subscriberData.totalCount / subscriberData.pageSize,
            )}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

type SubscriberSelectProps = {
  subscriberFilderData: subscriberFilderDataType;
  setSubscriberFilderData: Dispatch<SetStateAction<subscriberFilderDataType>>;
};

export interface TerritoryResponse {
  message: string;
  territorys: RegionObject[];
}
export interface StreetResponse {
  message: string;
  streets: RegionObject[];
}
export function SubscriberSelect({
  setSubscriberFilderData,
  subscriberFilderData,
}: SubscriberSelectProps) {
  const { toast } = useToast();
  const [districtState, setDistrictState] = useState<DistrictsResponse | null>(
    null,
  );
  const [territoryState, setTerritoryState] =
    useState<TerritoryResponse | null>(null);
  const [streetState, setStreetState] = useState<StreetResponse | null>(null);
  const {
    data: regionData,
    isFetching: isFetchingRegions,
    isError: isRegionError,
  } = useQuery<RegionsResponse>({
    queryKey: ["substation-location-feed"],
    queryFn: () =>
      kyInstance
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/region`)
        .json<RegionsResponse>(),
    staleTime: Infinity,
  });

  const handleRegionChange = (value: string) => {
    const Id = parseInt(value, 10);
    if (Id) {
      setSubscriberFilderData({
        regionId: Id,
        districtId: null,
        streetId: null,
        territoryId: null,
      });

      // setValues((prevValues) => ({
      //   ...prevValues,
      //   regionId: Id,
      // }));
      fetchDistricts(Id);
    }
  };

  const fetchDistricts = async (id: number) => {
    const response = await kyInstance
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/region/${id}/districts`)
      .json<DistrictsResponse>();
    setDistrictState(response);
  };
  const fetchTerritory = async (id: number) => {
    const response = await kyInstance
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/districts/${id}/territory`,
      )
      .json<TerritoryResponse>();
    setTerritoryState(response);
  };
  const fetchStreet = async (id: number) => {
    const response = await kyInstance
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/districts/territory/${id}/street`,
      )
      .json<StreetResponse>();
    setStreetState(response);
  };
  return (
    <div className="flex flex-col flex-wrap items-center justify-center gap-4 py-2 sm:flex-row">
      <Select onValueChange={(value) => handleRegionChange(value)}>
        <SelectTrigger className="h-12 w-44 rounded-2xl border border-muted-foreground bg-secondary">
          <SelectValue
            placeholder={
              isFetchingRegions ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[136px] rounded-xl bg-muted-foreground" />
                </div>
              ) : (
                "Select a region"
              )
            }
          />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
          <SelectGroup>
            <SelectLabel className="text-left">
              <div className="text-left">Regions</div>
            </SelectLabel>
            <ScrollArea className="h-30 border-t">
              {isRegionError ? (
                <SelectItem disabled value="error">
                  Error fetching regions
                </SelectItem>
              ) : (
                regionData?.region.map((region) => (
                  <SelectItem key={region.id} value={String(region.id)}>
                    {region.name}
                  </SelectItem>
                ))
              )}
            </ScrollArea>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={String(subscriberFilderData.districtId) || ""}
        onValueChange={(value) => {
          setSubscriberFilderData((prevValues) => ({
            ...prevValues,
            districtId: Number(value),
            streetId: null,
            territoryId: null,
          }));
          fetchTerritory(parseInt(value));
        }}
      >
        <SelectTrigger className="h-12 w-44 rounded-2xl border border-muted-foreground bg-secondary">
          <SelectValue
            placeholder={
              isFetchingRegions ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[136px] rounded-xl bg-muted-foreground" />
                </div>
              ) : (
                "Select a district"
              )
            }
          />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
          <SelectGroup>
            <SelectLabel>Districts</SelectLabel>
            {districtState ? (
              districtState.districts.map((district) => (
                <SelectItem key={district.id} value={String(district.id)}>
                  {district.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="no-districts">
                Choose region options first
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={String(subscriberFilderData.territoryId) || ""}
        onValueChange={(value) => {
          setSubscriberFilderData((prevValues) => ({
            ...prevValues,
            territoryId: Number(value),
            streetId: null,
          }));
          fetchStreet(parseInt(value));
        }}
      >
        <SelectTrigger className="h-12 w-44 rounded-2xl border border-muted-foreground bg-secondary">
          <SelectValue
            placeholder={
              isFetchingRegions ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[136px] rounded-xl bg-muted-foreground" />
                </div>
              ) : (
                "Select a territory"
              )
            }
          />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
          <SelectGroup>
            <SelectLabel>Territory</SelectLabel>
            {territoryState ? (
              territoryState.territorys.map((territory) => (
                <SelectItem key={territory.id} value={String(territory.id)}>
                  {territory.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="no-districts">
                Choose district options first
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={String(subscriberFilderData.streetId) || ""}
        onValueChange={(value) => {
          setSubscriberFilderData({
            ...subscriberFilderData,
            streetId: Number(value),
          });
        }}
      >
        <SelectTrigger className="h-12 w-44 rounded-2xl border border-muted-foreground bg-secondary">
          <SelectValue
            placeholder={
              isFetchingRegions ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[136px] rounded-xl bg-muted-foreground" />
                </div>
              ) : (
                "Select a street"
              )
            }
          />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
          <SelectGroup>
            <SelectLabel>Streets</SelectLabel>
            {streetState ? (
              streetState.streets.map((street) => (
                <SelectItem key={street.id} value={String(street.id)}>
                  {street.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="no-districts">
                Choose territory options first
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

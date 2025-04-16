"use client";

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
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession } from "../SessionProvider";
import { SubscriberTableLoading } from "@/components/DataTableLoading";
import { Input } from "@/components/ui/input";
import { PaginationBox } from "@/components/PaginationBox";
import { toast, useToast } from "@/components/ui/use-toast";
import {
  DistrictsResponse,
  RegionObject,
  RegionsResponse,
} from "../RegionFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDown, Filter, SearchIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { motion } from "framer-motion";

export type subscriberFilderDataType = {
  regionId: null | number;
  districtId: null | number;
  territoryId: null | number;
  streetId: null | number;
};
export default function SubscriberDataTable() {
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const [date, setDate] = React.useState<Date>();
  const searchParams = useSearchParams();
  const region = searchParams.get("region");
  const district = searchParams.get("district");
  const territory = searchParams.get("territory");
  const street = searchParams.get("street");
  const [isOpen, SetIsOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<number | string | null>(
    null,
  );
  const [selectedPopulationStatus, setSelectedPopulationStatus] = useState<
    string | null
  >(null);
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
      region,
      district,
      territory,
      street,
    ],
    queryFn: async (): Promise<SubscribersProps> => {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber/filtered`,
      );
      url.searchParams.append("page", String(pageNumber));
      url.searchParams.append("pageSize", "10");

      if (subscriberFilderData.regionId)
        url.searchParams.append(
          "regionId",
          String(subscriberFilderData.regionId),
        );
      if (subscriberFilderData.districtId)
        url.searchParams.append(
          "districtId",
          String(subscriberFilderData.districtId),
        );
      if (subscriberFilderData.territoryId)
        url.searchParams.append(
          "territoryId",
          String(subscriberFilderData.territoryId),
        );
      if (subscriberFilderData.streetId)
        url.searchParams.append(
          "streetId",
          String(subscriberFilderData.streetId),
        );

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      // ✅ Ensure proper promise handling with await
      const data: SubscribersProps = await response.json();

      return {
        ...data,
        items: data.items.map((item) => ({
          ...item,
          status: String(item.status), // Ensure status is a string
        })),
      };
    },

    staleTime: Infinity,
  });

  const { open } = useSidebar();

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns: ColumnDef<Subscriber>[] = [
    {
      accessorKey: "ats",
      header: () => <div className="text-sm font-bold">Ats</div>,
      cell: ({ row }) => <div>{row.getValue("ats")}</div>,
    },
    {
      accessorKey: "regionName",
      header: () => <div className="text-sm font-bold capitalize">Region</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("regionName")}</div>
      ),
    },
    {
      accessorKey: "districtName",
      header: () => <div className="text-sm font-bold">District</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("districtName")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: () => <div className="text-sm font-bold capitalize">Name</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "surname",
      header: () => <div className="text-sm font-bold capitalize">Surname</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("surname")}</div>
      ),
    },
    {
      accessorKey: "patronymic",
      header: ({ column }) => (
        <div className="flex flex-col justify-start gap-y-2">
          <p className="text-sm font-bold capitalize">Patronymic</p>
          {/* <div className="relative">
            <Filter className="absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              type="text"
              name="q"
              placeholder="Search"
              className="w-full rounded-xl border border-muted-foreground bg-secondary ps-10"
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(event) => column.setFilterValue(event.target.value)}
            />
          </div> */}
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("patronymic")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className="flex flex-col justify-start gap-y-2">
          <p className="text-sm font-bold">Date time</p>
        </div>
      ),
      cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
    },
    {
      accessorKey: "subscriberCode",
      header: () => <div className="text-sm font-bold">Sb code</div>,
      cell: ({ row }) => <div>{row.getValue("subscriberCode")}</div>,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-sm font-bold">Status</div>,
      cell: ({ row }) => {
        const maxStatus = 5;
        const names = ["Y", "N", "S", "T", "M"];
        const src = [
          "/code-for-subscriber",
          "/sb-counter",
          "/sb-tm",
          "/sb-contract",
        ];
        const value = Number(row.original.status);
        const ID = row.original.id;

        return (
          <div className="flex items-center justify-start">
            {names.map((name, i) => {
              const isActive = i + 1 <= value;
              const className = `flex h-6 w-6 items-center justify-center text-white ${
                isActive ? "bg-green-700" : "bg-destructive"
              }`;

              return value < maxStatus ? (
                <Link
                  className={className}
                  key={i}
                  href={`/subscriber/${ID}${src[value - 1]}`}
                >
                  <div>{name}</div>
                </Link>
              ) : (
                <div key={i} className={className}>
                  {name}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "populationStatusName",
      header: () => <div className="text-sm font-bold">People</div>,
      cell: ({ row }) => (
        <div className="text-center text-sm">
          {row.getValue("populationStatusName") == "Population"
            ? "Country"
            : "Non-Country"}
        </div>
      ),
    },
  ];
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
    toast({
      title: "Server not working",
      description: "Please try Latter",
      variant: "destructive",
    });
    return (
      <h1 className="text-center text-xl font-bold text-destructive">
        Something went wrong .Try latter
      </h1>
    );
  }

  return (
    <div className="relative w-full overflow-x-auto rounded-lg p-4">
      <SubscriberSelect
        subscriberFilderData={subscriberFilderData}
        setSubscriberFilderData={setSubscriberFilderData}
      />

      {!isPending ? (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center rounded-xl border border-muted-foreground/40 bg-card/70 px-4 shadow-sm"
        >
          <div className="my-3 flex w-full items-center justify-between">
            <div className="text-xl font-bold">Subscriber Summary</div>
            <div className="flex items-center justify-center gap-2 px-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`ml-auto ${open ? "w-36" : "w-48"} h-12 rounded-xl border border-muted-foreground/60 backdrop-blur-md`}
                  >
                    All Columns <ChevronDown size={12} className="ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="rounded-xl border border-muted-foreground/40 bg-card backdrop-blur-md"
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
          </div>
          <table className="w-full table-fixed border-collapse overflow-hidden rounded-xl shadow-md">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="h-12 border-b border-foreground/50 bg-muted-foreground/10"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="w-1/5 pl-1 text-left font-semibold"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}

              {/* Filter Row */}
              <tr className="h-12">
                {table.getHeaderGroups()[0]?.headers.map((header) => {
                  if (header.id == "createdAt") {
                    return (
                      <th key={header.id} className="w-1/5">
                        {header.isPlaceholder ? null : (
                          <Popover open={isOpen} onOpenChange={SetIsOpen}>
                            <PopoverTrigger asChild>
                              <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                  type="text"
                                  name="q"
                                  placeholder="Pick date"
                                  className="w-full max-w-[140px] rounded-md border border-muted-foreground bg-secondary ps-10 text-sm font-normal"
                                  value={
                                    (table
                                      .getColumn(header.id)
                                      ?.getFilterValue() as string) ?? ""
                                  }
                                  // onChange={(event) =>
                                  //   table
                                  //     .getColumn(header.id)
                                  //     ?.setFilterValue(event.target.value)
                                  // }
                                />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selectedDate) => {
                                  if (selectedDate) {
                                    // Format selected date to match createdAt format
                                    const formattedDate = format(
                                      selectedDate,
                                      "yyyy-MM-dd",
                                    );

                                    // Update filter value in the table
                                    table
                                      .getColumn(header.id)
                                      ?.setFilterValue(formattedDate);

                                    // Close popover
                                    SetIsOpen(false);
                                  }
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      </th>
                    );
                  }

                  if (header.id === "status") {
                    return (
                      <th key={header.id} className="w-1/5">
                        {header.isPlaceholder ? null : (
                          <div>
                            <Select
                              value={
                                selectedStatus !== null
                                  ? String(selectedStatus)
                                  : ""
                              }
                              onValueChange={(value) => {
                                if (value === "all") {
                                  setSelectedStatus("");
                                  table
                                    .getColumn(header.id)
                                    ?.setFilterValue(undefined); // Clears the filter
                                } else {
                                  setSelectedStatus(value);
                                  table
                                    .getColumn(header.id)
                                    ?.setFilterValue(value);
                                }
                              }}
                            >
                              <SelectTrigger className="w-full max-w-[140px] rounded-md border border-muted-foreground bg-secondary text-sm font-normal">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent className="rounded-md border border-muted-foreground bg-secondary text-sm font-normal">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="2">Generate code</SelectItem>
                                <SelectItem value="3">
                                  Electric meter
                                </SelectItem>
                                <SelectItem value="4">TM connection</SelectItem>
                                <SelectItem value="5">The contract</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </th>
                    );
                  }

                  if (header.id === "populationStatusName") {
                    return (
                      <th key={header.id} className="w-1/5">
                        {header.isPlaceholder ? null : (
                          <div>
                            <Select
                              value={
                                selectedPopulationStatus !== null
                                  ? String(selectedPopulationStatus)
                                  : ""
                              }
                              onValueChange={(value) => {
                                setSelectedPopulationStatus(value);
                                table
                                  .getColumn(header.id)
                                  ?.setFilterValue(value);
                              }}
                            >
                              <SelectTrigger className="w-full max-w-[140px] rounded-md border border-muted-foreground bg-secondary text-sm font-normal">
                                <SelectValue placeholder="Select People" />
                              </SelectTrigger>
                              <SelectContent className="rounded-md border border-muted-foreground bg-secondary text-sm font-normal">
                                <SelectItem value="Population">
                                  Country
                                </SelectItem>
                                <SelectItem value="NotPopulation">
                                  Non-Country
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </th>
                    );
                  }
                  return (
                    <th key={header.id} className="w-1/5">
                      {header.isPlaceholder ? null : (
                        <div className="relative">
                          <Filter className="absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
                          <Input
                            type="text"
                            name="q"
                            placeholder={header.id}
                            className="w-full max-w-[140px] rounded-md border border-muted-foreground bg-secondary ps-10 placeholder:text-sm placeholder:font-medium"
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
                          />
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`h-12 border-b border-muted-foreground/30 transition-all hover:bg-muted-foreground/30`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`w-1/5 truncate p-3 text-left text-sm`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr className="h-12">
                  <td
                    colSpan={columns.length}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {subscriberData.items.length ||
          Math.ceil(subscriberData.totalCount / subscriberData.pageSize) !==
            1 ? (
            <PaginationBox
              page={pageNumber}
              setPageNumber={setPageNumber}
              size={Math.ceil(
                subscriberData.totalCount / subscriberData.pageSize,
              )}
            />
          ) : null}
        </motion.div>
      ) : (
        <SubscriberTableLoading />
      )}
    </div>
  );
}

type SubscriberSelectProps = {
  subscriberFilderData: subscriberFilderDataType;
  setSubscriberFilderData: Dispatch<SetStateAction<subscriberFilderDataType>>;
};

export interface TerritoryResponse {
  message: string;
  territories: RegionObject[];
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
  const { session } = useSession();
  const [districtState, setDistrictState] = useState<DistrictsResponse | null>(
    null,
  );
  const [territoryState, setTerritoryState] =
    useState<TerritoryResponse | null>(null);
  const [streetState, setStreetState] = useState<StreetResponse | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = new URLSearchParams(useSearchParams());
  const initialRegion = searchParams.get("region") || "";
  const initialDistrict = searchParams.get("district") || "";
  const initialTerritory = searchParams.get("territory") || "";
  const initialStreet = searchParams.get("street") || "";
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    initialRegion,
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    initialDistrict,
  );
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(
    initialTerritory,
  );
  const [selectedStreet, setSelectedStreet] = useState<string | null>(
    initialStreet,
  );
  const { open } = useSidebar();
  const [delayedOpen, setDelayedOpen] = useState(open);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedOpen(open);
    }, 50); // Delay only for the button

    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (initialRegion) fetchDistricts(parseInt(initialRegion));
    if (initialDistrict) fetchTerritory(parseInt(initialDistrict));
    if (initialTerritory) fetchStreet(parseInt(initialTerritory));
  }, []);
  const {
    data: regionData,
    isFetching: isFetchingRegions,
    isError: isRegionError,
  } = useQuery<RegionsResponse>({
    queryKey: ["subscriber-select-feed"],

    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/region`,
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

  const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newSearchParams = new URLSearchParams();

    event.preventDefault();

    if (selectedRegion) {
      newSearchParams.set("region", selectedRegion);
    }
    if (selectedDistrict) {
      newSearchParams.set("district", selectedDistrict);
    }

    if (selectedTerritory) {
      newSearchParams.set("territory", selectedTerritory);
    }
    if (selectedStreet) {
      newSearchParams.set("street", selectedStreet);
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);

    setTimeout(() => {
      document
        .getElementById("data-table")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  const handleClearSearch = () => {
    const newSearchParams = new URLSearchParams();

    router.push(`${pathname}?${newSearchParams.toString()}`);

    setSelectedRegion("");
    setSelectedDistrict("");
    setSelectedTerritory("");
    setSelectedTerritory("");

    setTimeout(() => {
      document
        .getElementById("data-table")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };
  const handleRegionChange = (value: string) => {
    const Id = parseInt(value, 10);
    if (Id) {
      setSubscriberFilderData({
        regionId: Id,
        districtId: null,
        streetId: null,
        territoryId: null,
      });
      fetchDistricts(Id);
    }
  };

  const fetchDistricts = async (id: number): Promise<DistrictsResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/${id}/districts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      },
    );

    const result: DistrictsResponse = await response.json();
    setDistrictState(result);
    return result;
  };
  const fetchTerritory = async (id: number): Promise<TerritoryResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/district/${id}/territories`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      },
    );
    if (!response.ok) {
      toast({
        title: "Territory not found current district",
        variant: "destructive",
      });
      throw new Error(`Error fetching streets: ${response.statusText}`);
    }
    const result: TerritoryResponse = await response.json();

    setTerritoryState(result);
    return result;
  };
  const fetchStreet = async (id: number): Promise<StreetResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/district/territory/${id}/streets`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      },
    );

    if (!response.ok) {
      toast({
        title: " Streets not found current territory",
        variant: "destructive",
      });
      throw new Error(`Error fetching streets: ${response.statusText}`);
    }

    const result: StreetResponse = await response.json();
    setStreetState(result);
    return result;
  };
  return (
    <div className="mx-auto mb-4 flex w-full flex-col items-center justify-center gap-x-5 gap-y-2 rounded-xl border border-muted-foreground/40 bg-card/50 p-2 shadow-sm backdrop-blur-md md:flex-row">
      <div
        className={`flex flex-col flex-wrap w-full items-center ${!delayedOpen ? "mx-3 w-full justify-between" : "justify-center gap-x-3 "} gap-y-2 pb-2 sm:flex-row`}
      >
        <div className={`flex w-full   ${delayedOpen ? "sm:w-36" : "sm:w-48"} flex-col justify-start`}>
          <p className="mb-2 ml-1 text-sm font-bold">Region</p>
          <Select
            value={selectedRegion || ""}
            onValueChange={(value) => {
              setSelectedRegion(value);
              handleRegionChange(value);
              setSelectedDistrict(null);
              setDistrictState(null);
              setTerritoryState(null);
              setSelectedTerritory(null);
              setSelectedStreet(null);
              setStreetState(null);
            }}
          >
            <SelectTrigger
              className={`h-12 w-full ${delayedOpen ? "sm:w-36" : "sm:w-48"} rounded-xl border border-muted-foreground bg-secondary`}
            >
              <SelectValue
                placeholder={
                  isFetchingRegions ? (
                    <div className="mx-auto space-y-2">
                      <Skeleton
                        className={`mx-auto h-9 w-full ${delayedOpen ? "sm:w-24" : "sm:w-44"} rounded-xl bg-muted-foreground`}
                      />
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
        </div>

        <div className={`flex w-full   ${delayedOpen ? "sm:w-36" : "sm:w-48"} flex-col justify-start`}>
          <p className="mb-2 ml-1 text-sm font-bold">District</p>
          <Select
            value={selectedDistrict || ""}
            onValueChange={(value) => {
              setSubscriberFilderData((prevValues) => ({
                ...prevValues,
                districtId: Number(value),
                streetId: null,
                territoryId: null,
              }));
              setSelectedDistrict(value);
              setSelectedTerritory(null);
              setTerritoryState(null);
              setSelectedStreet(null);
              setStreetState(null);
              fetchTerritory(parseInt(value));
            }}
          >
            <SelectTrigger
              className={`h-12 w-full ${delayedOpen ? "sm:w-36" : "sm:w-48"} rounded-xl border border-muted-foreground bg-secondary`}
            >
              <SelectValue
                placeholder={
                  isFetchingRegions ? (
                    <div className="mx-auto space-y-2">
                      <Skeleton
                        className={`mx-auto h-9 w-full ${delayedOpen ? "sm:w-24" : "sm:w-44"} rounded-xl bg-muted-foreground`}
                      />
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
        </div>

        <div className={`flex w-full   ${delayedOpen ? "sm:w-36" : "sm:w-48"} flex-col justify-start`}>
          <p className="mb-2 ml-1 text-sm font-bold">Territory</p>
          <Select
            value={selectedTerritory || ""}
            onValueChange={(value) => {
              setSubscriberFilderData((prevValues) => ({
                ...prevValues,
                territoryId: Number(value),
                streetId: null,
              }));
              setSelectedTerritory(value);
              setSelectedStreet(null);
              setStreetState(null);
              fetchStreet(parseInt(value));
            }}
          >
            <SelectTrigger
              className={`h-12 w-full ${delayedOpen ? "sm:w-36" : "sm:w-48"} rounded-xl border border-muted-foreground bg-secondary`}
            >
              <SelectValue
                placeholder={
                  isFetchingRegions ? (
                    <div className="mx-auto space-y-2">
                      <Skeleton
                        className={`mx-auto h-9 w-full ${delayedOpen ? "sm:w-24" : "sm:w-44"} rounded-xl bg-muted-foreground`}
                      />
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
                  territoryState.territories.map((territory) => (
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
        </div>
        <div className={`flex w-full   ${delayedOpen ? "sm:w-36" : "sm:w-48"} flex-col justify-start`}>
          <p className="mb-2 ml-1 text-sm font-bold">Street</p>
          <Select
            value={selectedStreet || ""}
            onValueChange={(value) => {
              setSubscriberFilderData({
                ...subscriberFilderData,
                streetId: Number(value),
              });
              setSelectedStreet(value);
            }}
          >
            <SelectTrigger
              className={`h-12 w-full ${delayedOpen ? "sm:w-36" : "sm:w-48"} rounded-xl border border-muted-foreground bg-secondary`}
            >
              <SelectValue
                placeholder={
                  isFetchingRegions ? (
                    <div className="mx-auto space-y-2">
                      <Skeleton
                        className={`mx-auto h-9 w-full ${delayedOpen ? "sm:w-24" : "sm:w-44"} rounded-xl bg-muted-foreground`}
                      />
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
        <div
          className={`flex w-full   ${delayedOpen ? "sm:w-36" : "sm:w-48"} flex-col justify-start`}
        >
          <p className="mb-2 ml-1 text-sm font-bold opacity-0">Street</p>
          <Button
            onClick={handleClearSearch}
            variant={"ghost"}
            className={`h-12 w-full ${delayedOpen ? "sm:w-36" : "sm:w-48"} rounded-xl border border-muted-foreground/70`}
          >
            Reset
          </Button>
        </div>
        <div
          className={`flex w-full ${delayedOpen ? "sm:w-36" : "sm:w-48"} flex-col justify-start`}
        >
          <p className="mb-2 ml-1 text-sm font-bold opacity-0">Street</p>
          <Button
            disabled={!selectedRegion}
            onClick={handleSearch}
            className={`h-12 w-full ${delayedOpen ? "sm:w-36" : "sm:w-48"} rounded-xl border border-transparent bg-primary text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary`}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/app/(main)/SessionProvider";
import { fetchQueryFN } from "@/app/(main)/fetchQueryFN";
import {
  DistrictsResponse,
  RegionsResponse,
  SubstationsResponse,
} from "@/app/(main)/RegionFilter";

export default function EditTmSelect() {
  return (
    <div className="mx-auto flex w-full flex-col mb-2 items-center justify-between rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 shadow-lg backdrop-blur-md md:flex-row">
      <FilterSelect />
    </div>
  );
}

export function FilterSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = new URLSearchParams(useSearchParams());

  const initialRegion = searchParams.get("region") || "";
  const initialDistrict = searchParams.get("district") || "";
  const initialSubstation = searchParams.get("substation") || "";

  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedSubstation, setSelectedSubstation] =
    useState(initialSubstation);
  const { session } = useSession();

  const {
    data: regionData,
    isFetching: isFetchingRegions,
    isError: isRegionError,
  } = useQuery<RegionsResponse>({
    queryKey: ["regions-feed"],
    queryFn: fetchQueryFN<RegionsResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/region`,
      session,
    ),
    staleTime: Infinity,
  });

  const { data: districtData, isFetching: isFetchingDistricts } =
    useQuery<DistrictsResponse>({
      queryKey: ["districts", selectedDistrict],
      queryFn: fetchQueryFN<DistrictsResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/${selectedRegion}/districts`,
        session,
      ),
      retry: false,
      enabled: !!selectedRegion,
    });
  const { data: substationData, isFetching: isFetchingSubstation } =
    useQuery<SubstationsResponse>({
      queryKey: ["substation", selectedSubstation],
      queryFn: fetchQueryFN<SubstationsResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/district/${selectedDistrict}/substations`,
        session,
      ),
      retry: false,
      enabled: !!selectedDistrict,
    });

  const updateQuery = (key: string, value: string | null) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setSelectedDistrict("");
    setSelectedSubstation("");
    updateQuery("region", value);
    updateQuery("district", null);
    updateQuery("substation", null);
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedSubstation("");
    updateQuery("district", value);
    updateQuery("substation", null);
  };
  const handleSubstationChange = (value: string) => {
    setSelectedSubstation(value);
    updateQuery("substation", value);
  };

  return (
    <div className="flex w-full flex-col flex-wrap items-center justify-center gap-4 pb-2 sm:flex-row sm:justify-around sm:gap-0">
      <div className="flex flex-col items-start justify-start gap-y-1">
        <p className="ml-1 text-sm font-semibold">Region</p>
        <Select value={selectedRegion} onValueChange={handleRegionChange}>
          <SelectTrigger className="h-12 w-48 rounded-2xl border border-muted-foreground bg-secondary">
            <SelectValue>
              {isFetchingRegions ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[146px] rounded-xl bg-muted-foreground" />
                </div>
              ) : selectedRegion ? (
                regionData?.region.find((r) => String(r.id) === selectedRegion)
                  ?.name || "Unknown Region"
              ) : (
                "Select a region"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
            <SelectGroup>
              <SelectLabel>Regions</SelectLabel>
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
      <div className="flex flex-col items-start justify-start gap-y-1">
        <p className="ml-1 text-sm font-semibold">District</p>
        <Select
          value={selectedDistrict || "Select district"}
          onValueChange={handleDistrictChange}
          disabled={!selectedRegion}
        >
          <SelectTrigger className="h-12 w-48 rounded-2xl border border-muted-foreground bg-secondary">
            <SelectValue>
              {isFetchingDistricts ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[146px] rounded-xl bg-muted-foreground" />
                </div>
              ) : selectedDistrict ? (
                districtData?.districts.find(
                  (r) => String(r.id) === selectedDistrict,
                )?.name || "Unknown District"
              ) : (
                "Select a district"
              )}
            </SelectValue>
          </SelectTrigger>

          <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
            <SelectGroup>
              <SelectLabel>Districts</SelectLabel>
              {districtData?.districts.length ? (
                districtData.districts.map((district) => (
                  <SelectItem key={district.id} value={String(district.id)}>
                    {district.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="no-districts">
                  No districts available
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-start justify-start gap-y-1">
        <p className="ml-1 text-sm font-semibold">Subtation</p>
        <Select
          value={selectedSubstation || "Select substation"}
          onValueChange={handleSubstationChange}
          disabled={!selectedDistrict}
        >
          <SelectTrigger className="h-12 w-48 rounded-2xl border border-muted-foreground bg-secondary">
            <SelectValue>
              {isFetchingSubstation ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[146px] rounded-xl bg-muted-foreground" />
                </div>
              ) : selectedSubstation ? (
                substationData?.substations.find(
                  (r) => String(r.id) === selectedSubstation,
                )?.name || "Unknown substation"
              ) : (
                "Select a substation"
              )}
            </SelectValue>
          </SelectTrigger>

          <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
            <SelectGroup>
              <SelectLabel>Substation</SelectLabel>
              {substationData?.substations.length ? (
                substationData?.substations.map((district) => (
                  <SelectItem key={district.id} value={String(district.id)}>
                    {district.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="no-districts">
                  No districts available
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

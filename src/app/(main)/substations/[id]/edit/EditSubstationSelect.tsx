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
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface RegionObject {
  id: number;
  name: string;
}

export interface RegionsResponse {
  message: string;
  region: RegionObject[];
}

export interface DistrictsResponse {
  message: string;
  districts: RegionObject[];
}

export default function EditSubstationSelect() {
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-between rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 shadow-lg backdrop-blur-md md:flex-row">
      <FilterSelect />
      <div className="mr-2 flex w-48">
        <Button className="ml-auto h-12 w-48 rounded-2xl bg-primary transition-all hover:bg-primary/60 md:w-20">
          Search
        </Button>
      </div>
    </div>
  );
}

export function FilterSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = new URLSearchParams(useSearchParams());

  const initialRegion = searchParams.get("region") || "";
  const initialDistrict = searchParams.get("district") || "";

  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);

  const {
    data: regionData,
    isFetching: isFetchingRegions,
    isError: isRegionError,
  } = useQuery<RegionsResponse>({
    queryKey: ["regions-feed"],
    queryFn: () =>
      kyInstance
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/region`)
        .json<RegionsResponse>(),
    staleTime: Infinity,
  });

  const { data: districtData, isFetching: isFetchingDistricts } =
    useQuery<DistrictsResponse>({
      queryKey: ["districts", selectedRegion],
      queryFn: () =>
        kyInstance
          .get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/${selectedRegion}/districts`,
          )
          .json<DistrictsResponse>(),
      enabled: !!selectedRegion,
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
    setSelectedDistrict(""); // Reset district when region changes
    updateQuery("region", value);
    updateQuery("district", null); // Remove district from URL
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    updateQuery("district", value);
  };

  const validDistrict = districtData?.districts.find(
    (d) => String(d.id) === selectedDistrict,
  );
  const districtValue = validDistrict ? selectedDistrict : "";

  return (
    <div className="flex flex-col flex-wrap items-center justify-center gap-4 py-2 sm:flex-row">
      {/* Region Select */}
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

      {/* District Select */}
      <Select
        value={selectedDistrict ||"Select district"}
        onValueChange={handleDistrictChange}
        disabled={!selectedRegion}
      >
        <SelectTrigger className="h-12 w-48 rounded-2xl border border-muted-foreground bg-secondary">
          <SelectValue>
            {isFetchingRegions ? (
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
  );
}

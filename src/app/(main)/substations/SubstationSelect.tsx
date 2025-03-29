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
import { toast } from "@/components/ui/use-toast";
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
export interface SubstationsResponse {
  message: string;
  substations: RegionObject[];
}

export default function SubstationSelect() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col items-center justify-between rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 shadow-lg backdrop-blur-md md:flex-row">
        <FilterSelect />
        <div className=" flex w-48 mr-2 ">
          {" "}
          <Button className="h-12  ml-auto w-48 rounded-2xl bg-primary transition-all hover:bg-primary/60 md:w-20">
            Search
          </Button>
        </div>
      </div>
    </>
  );
}

export function FilterSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = new URLSearchParams(useSearchParams());

  const selectedRegion = searchParams.get("region");
  const selectedDistrict = searchParams.get("district");
  const selectedSubstation = searchParams.get("substation");

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
  const { data: districtData } = useQuery<DistrictsResponse>({
    queryKey: ["districts", selectedRegion],
    queryFn: () =>
      kyInstance
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/${selectedRegion}/districts`,
        )
        .json<DistrictsResponse>(),
    enabled: !!selectedRegion,
  });
  const { data: substationData } = useQuery<SubstationsResponse>({
    queryKey: ["substations", selectedDistrict],
    queryFn: () =>
      kyInstance
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/district/${selectedDistrict}/substations`,
        )
        .json<SubstationsResponse>(),
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
  return (
    <div className="flex flex-col flex-wrap items-center justify-center gap-4 py-2 sm:flex-row">
      <Select onValueChange={(value) => updateQuery("region", value)}>
        <SelectTrigger className="h-12 w-48 rounded-2xl border border-muted-foreground bg-secondary">
          <SelectValue
            placeholder={
              isFetchingRegions ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[146px] rounded-xl bg-muted-foreground" />
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
        value={selectedDistrict || ""}
        onValueChange={(value) => updateQuery("district", value)}
      >
        <SelectTrigger className="h-12 w-48 rounded-2xl border border-muted-foreground bg-secondary">
          <SelectValue
            placeholder={
              isFetchingRegions ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[146px] rounded-xl bg-muted-foreground" />
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
            {districtData ? (
              districtData.districts.map((district) => (
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
        value={selectedSubstation || ""}
        onValueChange={(value) => updateQuery("substation", value)}
      >
        <SelectTrigger className="h-12 w-48 rounded-2xl border border-muted-foreground bg-secondary">
          <SelectValue
            placeholder={
              isFetchingRegions ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[146px] rounded-xl bg-muted-foreground" />
                </div>
              ) : (
                "Select a substation"
              )
            }
          />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
          <SelectGroup>
            <SelectLabel>Substations</SelectLabel>
            {substationData ? (
              substationData.substations.map((substation) => (
                <SelectItem key={substation.id} value={String(substation.id)}>
                  {substation.name}
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
  );
}

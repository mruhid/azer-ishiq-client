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

interface RegionObject {
  id: number;
  name: string;
}

interface RegionsResponse {
  message: string;
  region: RegionObject[];
}

interface DistrictsResponse {
  message: string;
  districts: RegionObject[];
}
interface SubstationsResponse {
  message: string;
  substations: RegionObject[];
}

export default function RegionFilter() {
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-between rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 shadow-lg backdrop-blur-md md:flex-row">
      <FilterSelect />
      <div className="mx-auto my-2 flex w-48 md:w-20">
        <Button className="h-12 w-48 rounded-2xl bg-primary transition-all hover:bg-primary/60 md:w-20">
          Search
        </Button>
      </div>
    </div>
  );
}

export function FilterSelect() {
  const [districtState, setDistrictState] = useState<DistrictsResponse | null>(
    null,
  );
  const [substationState, setSubstationState] =
    useState<SubstationsResponse | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedSubstation, setSelectedSubstation] = useState<string | null>(
    null,
  );

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
  const fetchDistricts = async (id: number) => {
    const response = await kyInstance
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/region/${id}/districts`)
      .json<DistrictsResponse>();
    setDistrictState(response);
    setSelectedDistrict(null);
    setSubstationState(null);
    setSelectedSubstation(null);
  };
  const handleRegionChange = (value: string) => {
    const regionId = value;
    if (regionId) {
      fetchDistricts(parseInt(regionId)); // Fetch districts based on region selection
    }
  };
  const fetchSubstations = async (id: number) => {
    const response = await kyInstance
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/district/${id}/substations`,
      )
      .json<SubstationsResponse>();
    setSubstationState(response);
    setSelectedSubstation(null);
  };

  return (
    <div className="flex flex-col flex-wrap items-center justify-center gap-4 py-2 sm:flex-row">
      <Select onValueChange={(value) => handleRegionChange(value)}>
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
        <SelectContent className="rounded-xl border border-muted-foreground bg-secondary text-start">
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
        onValueChange={(value) => {
          setSelectedDistrict(value);
          fetchSubstations(parseInt(value));
        }}
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
        <SelectContent>
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
        value={selectedSubstation || ""}
        onValueChange={(value) => {
          setSelectedSubstation(value);
          fetchDistricts(parseInt(value));
        }}
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
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Substations</SelectLabel>
            {substationState ? (
              substationState.substations.map((substation) => (
                <SelectItem key={substation.id} value={substation.name}>
                  {substation.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="no-districts">
                Choose substations options first
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="h-12 w-48 rounded-2xl border border-muted-foreground bg-secondary">
          <SelectValue
            placeholder={
              isFetchingRegions ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[146px] rounded-xl bg-muted-foreground" />
                </div>
              ) : (
                "Select a TM"
              )
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>TM Options</SelectLabel>
            <ScrollArea className="h-30 border-t">
              <SelectItem value="tm1">TM 1</SelectItem>
              <SelectItem value="tm2">TM 2</SelectItem>
              <SelectItem value="tm3">TM 3</SelectItem>
            </ScrollArea>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

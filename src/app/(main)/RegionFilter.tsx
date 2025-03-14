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
import DataTable from "./DataTable";
import { toast } from "@/components/ui/use-toast";

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
export interface TmsResponse {
  message: string;
  tms: RegionObject[];
}
export type URLProps = {
  activeOption: string;
  url: Url;
};
export type Url = {
  default: string;
  region: string;
  district: string;
  substation: string;
  tm: string;
};

export default function RegionFilter() {
  const [url, setUrl] = useState<URLProps>({
    activeOption: "default",
    url: {
      default: "/Tm",
      region: "/tm/regionid",
      district: "/tm/districtID",
      substation: "/tm/substationID",
      tm: "/tm/tmID",
    },
  });
  return (
    <>
      <div
        className="mx-auto flex w-full flex-col items-center justify-between rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 shadow-lg backdrop-blur-md md:flex-row"
      >
        <FilterSelect />
        <div
          className="mx-auto my-2 flex w-48 md:w-20"
        >
          {" "}
          <Button className="h-12 w-48 rounded-2xl bg-primary transition-all hover:bg-primary/60 md:w-20">
            Search
          </Button>
        </div>
      </div>

      <DataTable />
    </>
  );
}

export function FilterSelect() {
  const [districtState, setDistrictState] = useState<DistrictsResponse | null>(
    null,
  );
  const [substationState, setSubstationState] =
    useState<SubstationsResponse | null>(null);
  const [tmState, setTmState] = useState<TmsResponse | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedSubstation, setSelectedSubstation] = useState<string | null>(
    null,
  );
  const [selectedTm, setSelectedTM] = useState<string | null>(null);
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
    try {
      const response = await kyInstance
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/region/${id}/districts`)
        .json<DistrictsResponse>();
      setDistrictState(response);
      setSelectedDistrict(null);
      setSubstationState(null);
      setSelectedSubstation(null);
      setSelectedTM(null);
      setTmState(null);
    } catch (error) {
      console.log(error);
      toast({
        title: "District not found current region",
        variant: "destructive",
      });
    }
  };
  const handleRegionChange = (value: string) => {
    const regionId = value;
    if (regionId) {
      fetchDistricts(parseInt(regionId)); // Fetch districts based on region selection
    }
  };
  const fetchSubstations = async (id: number) => {
    try {
      const response = await kyInstance
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/district/${id}/substations`,
        )
        .json<SubstationsResponse>();
      setSubstationState(response);
      setSelectedSubstation(null);
      setSelectedTM(null);
      setTmState(null);
    } catch (error) {
      console.log(error);
      toast({
        title: "Substation not found current district",
        variant: "destructive",
      });
    }
  };
  const fetchTms = async (id: number) => {
    try {
      const response = await kyInstance
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/district/substation/${id}/tms`,
        )
        .json<TmsResponse>();
      setTmState(response);
      setSelectedTM(null);
    } catch (error) {
      console.log(error);
      toast({
        title: "Tms not found curret subtation",
        variant: "destructive",
      });
    }
  };

  if (isRegionError) {
    toast({
      title: "Server error",
      description: "Server not response,try latter",
    });
  }
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
        value={selectedSubstation || ""}
        onValueChange={(value) => {
          setSelectedSubstation(value);
          setSelectedTM(null);
          setTmState(null);
          fetchTms(parseInt(value));
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
        <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
          <SelectGroup>
            <SelectLabel>Substations</SelectLabel>
            {substationState ? (
              substationState.substations.map((substation) => (
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

      <Select
        value={selectedTm || ""}
        onValueChange={(value) => {
          setSelectedTM(value);
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
                "Select a TM"
              )
            }
          />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
          <SelectGroup>
            <SelectLabel>Tms</SelectLabel>
            {tmState ? (
              tmState.tms.map((tm) => (
                <SelectItem key={tm.id} value={String(tm.id)}>
                  {tm.name}
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
    </div>
  );
}

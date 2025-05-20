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
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import DataTable from "./DataTable";
import { toast } from "@/components/ui/use-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "./SessionProvider";

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
  return (
    <div className="px-6">
      <div className="mx-auto mb-4 flex w-full flex-col items-center justify-between rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 shadow-lg backdrop-blur-md md:flex-row">
        <FilterSelect />
      </div>

      <DataTable />
    </div>
  );
}

export function FilterSelect() {
  const [districtState, setDistrictState] = useState<DistrictsResponse | null>(
    null,
  );
  const [substationState, setSubstationState] =
    useState<SubstationsResponse | null>(null);
  const [tmState, setTmState] = useState<TmsResponse | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = new URLSearchParams(useSearchParams());

  const initialRegion = searchParams.get("region") || "";
  const initialDistrict = searchParams.get("district") || "";
  const initialSubstation = searchParams.get("substation") || "";

  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    initialRegion,
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    initialDistrict,
  );
  const [selectedSubstation, setSelectedSubstation] = useState<string | null>(
    initialSubstation,
  );
  const { session } = useSession();

  const [selectedTm, setSelectedTM] = useState<string | null>(null);
  useEffect(() => {
    if (initialRegion) fetchDistricts(parseInt(initialRegion));
    if (initialDistrict) fetchSubstations(parseInt(initialDistrict));
    if (initialSubstation) fetchTms(parseInt(initialSubstation));
  }, []);

  const {
    data: regionData,
    isFetching: isFetchingRegions,
    isError: isRegionError,
  } = useQuery<RegionsResponse>({
    queryKey: ["regions-feed"],
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

  const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newSearchParams = new URLSearchParams();

    event.preventDefault();

    if (selectedRegion) {
      newSearchParams.set("region", selectedRegion);
    }
    if (selectedDistrict) {
      newSearchParams.set("district", selectedDistrict);
    }

    if (selectedSubstation) {
      newSearchParams.set("substation", selectedSubstation);
    }
    // if (selectedTm) {
    //   newSearchParams.set("tm", selectedTm);
    // }
    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;

    window.history.pushState(null, "", newUrl);

    setTimeout(() => {
      document
        .getElementById("data-table")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  const handleClearSearch = () => {
    const newUrl = window.location.pathname;
    window.history.pushState(null, "", newUrl);

    setSelectedRegion("");
    setSelectedDistrict("");
    setSelectedSubstation("");

    setTimeout(() => {
      document
        .getElementById("data-table")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  const handleRegionChange = (value: string) => {
    const regionId = value;
    setSelectedRegion(value);

    if (regionId) {
      fetchDistricts(parseInt(regionId));
    }
  };

  const fetchSubstations = async (id: number): Promise<SubstationsResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/district/${id}/substations`,
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
        title: "Substations not found on current district",
        variant: "destructive",
      });
      throw new Error(`Error fetching substation: ${response.statusText}`);
    }
    const result: SubstationsResponse = await response.json();

    setSubstationState(result);
    return result;
  };

  const fetchTms = async (id: number): Promise<TmsResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/district/substation/${id}/tms`,
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
        title: "Tms not found on current substation",
        variant: "destructive",
      });
      throw new Error(`Error fetching tms: ${response.statusText}`);
    }

    const result: TmsResponse = await response.json();
    setTmState(result);
    return result;
  };
  if (isRegionError) {
    toast({
      title: "Server error",
      description: "Server not response,try latter",
      variant: "destructive",
    });
  }
  return (
    <>
      <div className="flex flex-col flex-wrap items-center justify-center gap-4 py-2 sm:flex-row">
        <Select
          value={selectedRegion || ""}
          onValueChange={(value) => {
            setDistrictState(null);
            setSelectedDistrict(null);
            setSubstationState(null);
            setSelectedSubstation(null);
            setTmState(null);
            setSelectedTM(null);
            handleRegionChange(value);
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
            setSubstationState(null);
            setTmState(null);
            setSelectedSubstation(null);
            setSelectedTM(null);
            setSelectedDistrict(value);
            fetchSubstations(parseInt(value));
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
          value={selectedSubstation || ""}
          onValueChange={(value) => {
            setTmState(null);
            setSelectedTM(null);
            setSelectedSubstation(value);
            fetchTms(parseInt(value));
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
          <SelectTrigger className="h-12 w-44 rounded-2xl border border-muted-foreground bg-secondary">
            <SelectValue
              placeholder={
                isFetchingRegions ? (
                  <div className="mx-auto space-y-2">
                    <Skeleton className="mx-auto h-9 w-[136px] rounded-xl bg-muted-foreground" />
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
      <div className="mx-auto my-2 flex w-48 items-center justify-center gap-y-1 md:w-20">
        {" "}
        <Button
          onClick={handleClearSearch}
          variant={"ghost"}
          className="ml-1 h-12 w-48 rounded-2xl border border-muted-foreground/70 md:w-20"
        >
          Reset
        </Button>
      </div>
      <div className="mx-auto my-2 flex w-48 md:w-20">
        {" "}
        <Button
          disabled={!selectedRegion}
          onClick={handleSearch}
          className="h-12 w-48 rounded-2xl bg-primary transition-all hover:bg-primary/60 md:w-20"
        >
          Search
        </Button>
      </div>
    </>
  );
}

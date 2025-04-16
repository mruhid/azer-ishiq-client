"use client";

import { SubstationValues } from "@/lib/validation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { getCoordinates } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";
import {
  DistrictsResponse,
  RegionsResponse,
  SubstationsResponse,
} from "../../RegionFilter";
import TMMap from "./TMMap";
import { TMForms } from "./TMForms";
import MapSearchedPlaceInput from "@/components/MapSearchedPlaceInput";
import { useSession } from "../../SessionProvider";

export type valueProps = {
  regionId: number;
  districtId: number;
  substationId: number;
  latitude: number;
  longitude: number;
  address: string;
};
export default function AddTMFeed() {
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 40.4093,
    lng: 49.8671,
  });

  const [values, setValues] = useState<valueProps>({
    regionId: 0,
    districtId: 0,
    substationId: 0,
    latitude: selectedLocation.lat,
    longitude: selectedLocation.lng,
    address: "No Place",
  });

  useEffect(() => {
    setValues((prevValues) => ({
      ...prevValues,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    }));
  }, [selectedLocation]);

  return (
    <>
      <SubstationSelect values={values} setValues={setValues} />
      <div className="flex flex-wrap items-center justify-around space-y-4 rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 shadow-lg backdrop-blur-md md:flex-nowrap">
        <div className="max-w-[500px] flex-col shadow-xl">
          <h1 className="my-8 block rounded-xl border border-muted-foreground/60 bg-card py-2 text-center md:hidden">
            New TM
          </h1>

          <MapSearchedPlaceInput setSelectedLocation={setSelectedLocation} />

          <TMMap
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </div>

        <div className="my-2 w-full max-w-[350px]">
          <h1 className="my-8 hidden rounded-xl border border-muted-foreground/60 bg-card py-2 text-center md:block">
            New TM
          </h1>
          <TMForms Values={values} setValues={setValues} />
        </div>
      </div>
    </>
  );
}

interface SubstationSelectProps {
  values: valueProps;
  setValues: React.Dispatch<React.SetStateAction<valueProps>>;
}
export function SubstationSelect({ values, setValues }: SubstationSelectProps) {
  const [districtState, setDistrictState] = useState<DistrictsResponse | null>(
    null,
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [substationState, setSubstationState] =
    useState<SubstationsResponse | null>(null);

  const [selectedSubstation, setSelectedSubstation] = useState<string | null>(
    null,
  );

  const { session } = useSession();
  const { toast } = useToast();
  const {
    data: regionData,
    isFetching: isFetchingRegions,
    isError: isRegionError,
  } = useQuery<RegionsResponse>({
    queryKey: ["tm-location-feed"],
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
  if (isRegionError) {
    toast({
      title: "Error",
      description: "Server not response,try latter",
      variant: "destructive",
    });
    return;
  }

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
  const handleRegionChange = (value: string) => {
    const Id = parseInt(value, 10);
    if (Id) {
      setValues((prevValues) => ({
        ...prevValues,
        regionId: Id,
      }));
      setSelectedDistrict(null);
      setDistrictState(null);
      setSubstationState(null);
      setSelectedSubstation(null);
      fetchDistricts(Id);
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
      throw new Error(`Error fetching tms: ${response.statusText}`);
    }
    const result: SubstationsResponse = await response.json();

    setSubstationState(result);
    return result;
  };
  return (
    <div className="flex flex-col flex-wrap items-center justify-center gap-4 rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 py-2 shadow-lg backdrop-blur-md sm:flex-row">
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
              {isFetchingRegions && (
                <SelectItem disabled value="error">
                  Loading...
                </SelectItem>
              )}
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
          setSubstationState(null);
          setSelectedSubstation(null);
          setValues((prevValues) => ({
            ...prevValues,
            districtId: parseInt(value, 10),
          }));
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
          setValues((prevValues) => ({
            ...prevValues,
            substationId: parseInt(value, 10),
          }));
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
    </div>
  );
}

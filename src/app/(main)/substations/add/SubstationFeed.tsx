"use client";
import SubstationMap from "./SubstationMap";

import { SubstationValues } from "@/lib/validation";
import { SubstationForm, SubstationFormProps } from "./SubstationForm";
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
import { DistrictsResponse, RegionsResponse } from "../../RegionFilter";

export type valueProps = {
  regionId: number;
  districtId: number;
  latitude: number;
  longitude: number;
  address: string;
};
export default function SubstationFeed() {
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 40.4093,
    lng: 49.8671,
  });

  const [searchedPlace, setSearchedPlace] = useState<string>("");
  const [values, setValues] = useState<valueProps>({
    regionId: 0,
    districtId: 0,
    latitude: selectedLocation.lat,
    longitude: selectedLocation.lng,
    address: searchedPlace ? searchedPlace : "No Place",
  });

  useEffect(() => {
    setValues((prevValues) => ({
      ...prevValues,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    }));
  }, [selectedLocation]);
  console.log(values);
  const handleSearchedPlace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchedPlace(value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const search = async () => {
    if (!searchedPlace.trim()) {
      toast({
        title: "You need to write something first",
        variant: "destructive",
      });
      return;
    }
    const coordinate = await getCoordinates(searchedPlace);
    if (!coordinate) {
      toast({
        title: "Place not found!",
        variant: "destructive",
      });
      return;
    }
    const { lat, lon } = coordinate;
    const newLocation = { lat: lat, lng: lon };
    setSelectedLocation(newLocation);
  };
  return (
    <>
      <SubstationSelect values={values} setValues={setValues} />
      <div className="flex flex-wrap items-center justify-around space-y-4 rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 shadow-lg backdrop-blur-md md:flex-nowrap">
        <div className="max-w-[500px] flex-col shadow-xl">
          <h1 className="my-8 block rounded-xl border border-muted-foreground/60 bg-card py-2 text-center md:hidden">
            New substation
          </h1>

          <div className="relative my-2">
            <Input
              onKeyDown={handleKeyDown}
              className="rounded-xl border border-muted-foreground/60 bg-secondary"
              onChange={handleSearchedPlace}
              value={searchedPlace}
              placeholder="Write a place to find "
            />
            <SearchIcon
              onClick={search}
              className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground"
            />
          </div>
          <SubstationMap
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </div>

        <div className="my-2 w-full max-w-[350px]">
          <h1 className="my-8 hidden rounded-xl border border-muted-foreground/60 bg-card py-2 text-center md:block">
            New substation
          </h1>
          <SubstationForm Values={values} setValues={setValues} />
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

  const { toast } = useToast();
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

  const fetchDistricts = async (id: number) => {
    const response = await kyInstance
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/region/${id}/districts`)
      .json<DistrictsResponse>();
    setDistrictState(response);
    setSelectedDistrict(null);
  };
  const handleRegionChange = (value: string) => {
    const Id = parseInt(value, 10);
    if (Id) {
      setValues((prevValues) => ({
        ...prevValues,
        regionId: Id,
      }));
      fetchDistricts(Id);
    }
  };

  if (isRegionError) {
    toast({
      title: "Error",
      description: "Server not response,try latter",
      variant: "destructive",
    });
    return;
  }

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
          setValues((prevValues) => ({
            ...prevValues,
            districtId: parseInt(value, 10),
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
  );
}

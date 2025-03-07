"use client";
import SubstationMap from "./SubstationMap";

import { SubstationValues } from "@/lib/validation";
import { SubstationForm } from "./SubstationForm";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { getCoordinates } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

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
  const [values, setValues] = useState<SubstationValues>({
    name: "",
    regionId: 0,
    districtId: 0,
    latitude: selectedLocation.lat,
    longitude: selectedLocation.lng,
    address: searchedPlace ? searchedPlace : "No Place",
    image: null,
  });

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
      toast({ title: "You need to write something first", variant: "destructive" });
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
    const newLocation = { lat, lng: lon };
    setSelectedLocation(newLocation);
  };
  return (
    <div className="flex items-center flex-wrap md:flex-nowrap justify-around space-y-4  rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 shadow-lg backdrop-blur-md">
      <div className="flex-col max-w-[500px] shadow-xl">
      <h1 className="py-2 bg-card my-8 rounded-xl block md:hidden text-center border border-muted-foreground/60">New substation</h1>

      <div className="relative my-2">
        <Input
        onKeyDown={handleKeyDown}
        className="rounded-xl bg-secondary border border-muted-foreground/60"
          onChange={handleSearchedPlace}
          value={searchedPlace}
          placeholder="Write a place to find "
        />
        <SearchIcon onClick={search} className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
      <SubstationMap
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
      </div>
      
      <div className="w-full max-w-[350px] my-2">
        <h1 className="py-2 bg-card my-8 rounded-xl hidden md:block text-center border border-muted-foreground/60">New substation</h1>
        <SubstationForm values={values} setValues={setValues} />
      </div>
    </div>
  );
}

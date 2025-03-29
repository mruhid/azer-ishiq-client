"use client";
import { getCoordinates } from "@/lib/utils";
import { toast } from "./ui/use-toast";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Loader2, SearchIcon } from "lucide-react";

type Location = {
  lat: number;
  lng: number;
};
type SearchedProps = {
  setSelectedLocation: Dispatch<SetStateAction<Location>>;
};
export default function MapSearchedPlaceInput({
  setSelectedLocation,
}: SearchedProps) {
  const [searchedPlace, setSearchedPlace] = useState<string>("");
  const [isPending, startTransition] = useTransition();

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
    startTransition(async () => {
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
    });
  };
  return (
    <div className="relative my-2">
      <Input
        onKeyDown={handleKeyDown}
        className="rounded-xl border border-muted-foreground/60 bg-secondary"
        onChange={handleSearchedPlace}
        value={searchedPlace}
        placeholder="Write a place to find "
      />
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
        {isPending ? (
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        ) : (
          <SearchIcon
            onClick={search}
            className="size-5 cursor-pointer text-muted-foreground"
          />
        )}
      </div>
    </div>
  );
}

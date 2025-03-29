"use client";
import { Dispatch, SetStateAction } from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
const MapComponent = dynamic(() => import("@/components/MapComponents"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-[350px] items-center justify-center rounded-xl">
      <Loader2Icon className="size-10 animate-spin text-muted-foreground" />
    </div>
  ),
});
type Location = {
  lat: number;
  lng: number;
};
type MapProps = {
  selectedLocation: Location;
  setSelectedLocation: Dispatch<SetStateAction<Location>>;
};

export default function SubstationMap({
  selectedLocation,
  setSelectedLocation,
}: MapProps) {
  return (
    <div className="rounded-xl bg-secondary p-2">
      <MapComponent
        initialCoords={selectedLocation}
        onLocationSelect={setSelectedLocation}
      />

      <p className="mt-4">
        <strong>Lat:</strong>
        {Number(selectedLocation.lat).toFixed(2)}
        {"  "}
        <strong>Lng:</strong>
        {Number(selectedLocation.lng).toFixed(2)}
      </p>
    </div>
  );
}

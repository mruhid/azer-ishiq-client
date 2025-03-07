"use client";
import MapComponent from "@/components/MapComponents";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

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

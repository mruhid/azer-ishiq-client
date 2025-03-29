"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapComponentProps {
  initialCoords: { lat: number; lng: number };
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
  size?:number
}

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl: "/assets/map-marker.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const LocationSelector = ({
  onLocationSelect,
}: {
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
}) => {
  useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const MapViewUpdater = ({ coords }: { coords: { lat: number; lng: number } }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([coords.lat, coords.lng], map.getZoom(), { animate: true });
  }, [coords, map]);

  return null;
};

const MapResizer = () => {
  const map = useMap();
  
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200); 
  }, [map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ initialCoords, onLocationSelect,size=350 }) => {
  const [markerPosition, setMarkerPosition] = useState(initialCoords);

  useEffect(() => {
    setMarkerPosition(initialCoords);
  }, [initialCoords]);

  return (
    <MapContainer
      center={markerPosition}
      zoom={11}
      style={{ height: `${size}px`, width: `${size}px` }}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <MapResizer />

      <MapViewUpdater coords={markerPosition} />

      <Marker position={markerPosition} icon={redIcon} />

      <LocationSelector
        onLocationSelect={(coords) => {
          setMarkerPosition(coords);
          onLocationSelect(coords);
        }}
      />
    </MapContainer>
  );
};

export default MapComponent;

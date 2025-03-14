"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapComponentProps {
  initialCoords: { lat: number; lng: number };
  size: number;
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

// Component to update map view when coordinates change
const MapViewUpdater = ({
  coords,
}: {
  coords: { lat: number; lng: number };
}) => {
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

const MapOnlyRead: React.FC<MapComponentProps> = ({ initialCoords, size }) => {
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
      touchZoom={false}
      scrollWheelZoom={false}
      boxZoom={false}
      keyboard={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapResizer />

      <MapViewUpdater coords={markerPosition} />

      {/* Static marker (Users cannot move it) */}
      <Marker position={markerPosition} icon={redIcon} />
    </MapContainer>
  );
};

export default MapOnlyRead;

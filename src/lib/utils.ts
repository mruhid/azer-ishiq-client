import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getCoordinates(place: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);
      return { lat, lon };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
  }
}

import { type ClassValue, clsx } from "clsx";
import { parse } from "date-fns";
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
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ResponseData {
  [key: string]: any;
}

export const sendRequest = async <T>(
  url: string,
  method: RequestMethod = "GET",
  token: string,
  body: Record<string, any> | null = null,
): Promise<T> => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData: ResponseData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow error for further handling
  }
};
export function formatDate(timestamp: string) {
  const fixedTimestamp = timestamp.split(".")[0] + "Z"; // Append 'Z' to ensure UTC parsing

  // Create Date object
  const date = new Date(fixedTimestamp);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  // Extract day, month, and year
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export function parseDate(dateString: string) {
  return parse(dateString, "dd/MM/yyyy", new Date());
}
export function CapitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

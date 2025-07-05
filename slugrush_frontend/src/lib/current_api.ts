import type { StatusData } from "@/src/lib/types";
import dotenv from "dotenv";
dotenv.config();

const BACKEND_URL = process.env.NEXT_PUBLIC_TEST_BACKEND_URL + "/get/count" || "";
const API_KEY = process.env.NEXT_PUBLIC_SLUGRUSH_API_KEY || "";

console.log("Using SlugRush API Key:", API_KEY);
console.log("Using Backend URL:", BACKEND_URL);

// Return Type
// {
//     "hour": 11,
//     "minute": 18,
//     "crowd_count": 110,
//     "timestamp": "2025-05-05 11:18:12"
// }

export function getStatusText(occupancy: number): string {
    if (occupancy < 30) return "Not Busy"
    if (occupancy < 70) return "Moderately Busy"
    if (occupancy < 95) return "Very Busy"
    return "Max Capacity"
}

export async function fetchCurrentStatus(): Promise<StatusData> {
    const res = await fetch(BACKEND_URL,
      {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "slugrush-api-key": API_KEY,
        },
      }
    )
    if (!res.ok) {
      console.error("Failed to fetch data:", res.status, res.statusText);
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }
    const data = await res.json();
    // console.log("get/count fetched data:", data);
    const capacity = 150
  
    const currentCount = data.crowd_count
    const currentOccupancy = Math.round((currentCount / capacity) * 100)
    const lastUpdated = new Date(data.timestamp).toISOString()
  
    return {
      currentCount,
      currentOccupancy,
      capacity,
      lastUpdated
    }
  }
  
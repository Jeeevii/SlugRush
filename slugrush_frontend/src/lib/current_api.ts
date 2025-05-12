import type { StatusData } from "@/src/lib/types";
import dotenv from "dotenv";
dotenv.config();

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/get/count` 
    : "http://localhost:8000/get/count";

// console.log("Using Backend URL:", BACKEND_URL);

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
    const res = await fetch(BACKEND_URL)
    const data = await res.json()
  
    const capacity = 150 // adjust if this varies or make it dynamic
  
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
  
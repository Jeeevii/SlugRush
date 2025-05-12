import type { HourlyEntry, ProcessedDailyData } from "@/src/lib/types"
import * as dotenv from "dotenv";
dotenv.config();

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/get/daily` 
    : "http://localhost:8000/get/daily";

   
const MAX_CAPACITY = 150

export const FetchFormattedDailyData = async (): Promise<ProcessedDailyData[]> => {
  try {
    const res = await fetch(BACKEND_URL,
      {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_SLUGRUSH_API_KEY || "",
            
        },
      }
    )
    if (!res.ok) {
      console.error("Failed to fetch data:", res.status, res.statusText);
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }
    const raw = await res.json();
    const hourlyData: HourlyEntry[] = raw.hourly_data

    const hourGroups: { [hour: number]: number[] } = {}

    // Group by hour
    for (const entry of hourlyData) {
      const hour = entry.hour
      if (!hourGroups[hour]) {
        hourGroups[hour] = []
      }
      const clampedCount = Math.min(Number(entry.crowd_count), MAX_CAPACITY)
      hourGroups[hour].push(clampedCount)
    }

    // Process into formatted structure
    const formatted: ProcessedDailyData[] = []

    for (let hour = 0; hour < 24; hour++) {
      if (hourGroups[hour]) {
        const avg =
          hourGroups[hour].reduce((sum, val) => sum + val, 0) / hourGroups[hour].length

        formatted.push({
          time: formatHour(hour),
          crowdLevel:  Math.round((avg / 150) * 100),
        })
      }
    }

    console.log("Formatted Daily Data:", formatted)
    return formatted
  } catch (error) {
    console.error("Error fetching and formatting daily data:", error)
    throw error
  }
}

function formatHour(hour: number): string {
  const suffix = hour < 12 ? "am" : "pm"
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}${suffix}`
}

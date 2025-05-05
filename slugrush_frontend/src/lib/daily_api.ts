import type { HourlyEntry, ProcessedDailyData } from "@/src/lib/types"

const BACKEND_URL = "http://localhost:8000/get/daily"

export const FetchFormattedDailyData = async (): Promise<ProcessedDailyData[]> => {
  try {
    const response = await fetch(BACKEND_URL)

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }

    const raw = await response.json()
    const hourlyData: HourlyEntry[] = raw.hourly_data

    const hourGroups: { [hour: number]: number[] } = {}

    // Group by hour
    for (const entry of hourlyData) {
      const hour = entry.hour
      if (!hourGroups[hour]) {
        hourGroups[hour] = []
      }
      hourGroups[hour].push(entry.crowd_count)
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

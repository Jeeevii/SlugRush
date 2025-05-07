import type { GymCrowdEntry, DayData } from "@/src/lib/types"

const BACKEND_URL = "http://localhost:8000/get/weekly"
const MAX_CAPACITY = 150

export async function fetchWeeklyData(): Promise<DayData[]> {
  const res = await fetch(BACKEND_URL)
  if (!res.ok) throw new Error("Failed to fetch weekly data")

  const apiData = await res.json()
  return processRawDataForWeeklyView(apiData)
}

/**
 * Process raw gym data into the format needed for weekly view
 */
export function processRawDataForWeeklyView(apiData: GymCrowdEntry): DayData[] {
  // console.log(apiData)
  const dayMap: { [key: string]: string } = {
    Monday: "MON",
    Tuesday: "TUE",
    Wednesday: "WED",
    Thursday: "THU",
    Friday: "FRI",
    Saturday: "SAT",
    Sunday: "SUN",
  }


  return apiData.map((dayObj) => {
    const hourBuckets: { [hour: number]: number[] } = {}
  
    dayObj.hourly_data.forEach((entry) => {
      if (!hourBuckets[entry.hour]) hourBuckets[entry.hour] = []
      const clampedCount = Math.min(Number(entry.crowd_count), MAX_CAPACITY)
      hourBuckets[entry.hour].push(clampedCount)
    })
  
    const isWeekend = dayObj.day_of_week === "Saturday" || dayObj.day_of_week === "Sunday"
    const startHour = isWeekend ? 8 : 6
    const endHour = isWeekend ? 20 : 23
  
    const data: number[] = []
  
    for (let hour = startHour; hour <= endHour; hour++) {
      const entries = hourBuckets[hour]
      if (entries && entries.length > 0) {
        const avgCrowd = entries.reduce((a, b) => a + b, 0) / entries.length
        const percent = Math.round((avgCrowd / MAX_CAPACITY) * 100)
        data.push(percent)
      } else {
        data.push(0) // or interpolate later
      }
    }
    const dict = {
      day: dayMap[dayObj.day_of_week],
      data,
    }
    console.log(dict)
    return dict
  })
}



/**
 * Get the current day of week (three-letter format)
 */
export function getCurrentDay(): string {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  return days[new Date().getDay()]
}
/**
 * Helper function to get best times to visit based on day data
 */
export function getBestTimesToVisit(dayData: number[]): string {
  // Find the indices with the lowest crowd levels
  const hourIndices = dayData
    .map((level, index) => ({ level, index }))
    .sort((a, b) => a.level - b.level)
    .slice(0, 3)
    .map((item) => item.index)
    .sort((a, b) => a - b)

  // Convert indices to time strings
  const times = hourIndices.map((index) => {
    // Adjust for weekends starting at 8am instead of 6am
    const day = getCurrentDay()
    const isWeekend = day === "SAT" || day === "SUN"
    const startHour = isWeekend ? 8 : 6

    const hour = (index + startHour) % 12 || 12
    const period = index + startHour < 12 ? "am" : "pm"
    return `${hour}${period}`
  })

  return times.join(", ")
}


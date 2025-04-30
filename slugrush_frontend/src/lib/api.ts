// =================================================================
// DATA TYPES - These define the structure of your data
// =================================================================

/**
 * Raw data entry from your data source (e.g., database, API)
 * This represents a single data point of gym occupancy at a specific time
 */
export interface GymCrowdEntry {
  timestamp: string // ISO string format (e.g., "2023-05-01T15:30:00Z")
  crowdCount: number // Raw count of people (e.g., 98)
  capacity: number // Maximum capacity (e.g., 150)
}

/**
 * Processed data for daily view
 * This is what the daily chart component expects
 */
export interface ProcessedDailyData {
  time: string // Formatted time (e.g., "6am", "3pm")
  crowdLevel: number // Percentage of capacity (0-100)
}

/**
 * Data structure for weekly view
 * Contains the day and an array of crowd levels throughout the day
 */
export interface DayData {
  day: string // Three-letter day (e.g., "MON", "TUE")
  data: number[] // Array of crowd levels throughout the day (percentages 0-100)
}

/**
 * Current status data for the status bar
 */
export interface StatusData {
  currentOccupancy: number // Current percentage (0-100)
  currentCount: number // Current number of people
  capacity: number // Maximum capacity
  lastUpdated: string // ISO timestamp of last update
}

// =================================================================
// SAMPLE DATA - Replace with actual API calls in production
// =================================================================

// Sample data for status bar
export const sampleStatusData: StatusData = {
  currentOccupancy: 65, // 65% full
  currentCount: 98, // 98 people currently
  capacity: 150, // Maximum capacity of 150
  lastUpdated: new Date().toISOString(), // Current time
}

// Sample data for daily view - Weekday (6am-11pm)
// This represents processed data after fetching from API
export const sampleDailyDataWeekday: ProcessedDailyData[] = [
  { time: "6am", crowdLevel: 15 },
  { time: "7am", crowdLevel: 25 },
  { time: "8am", crowdLevel: 40 },
  { time: "9am", crowdLevel: 35 },
  { time: "10am", crowdLevel: 30 },
  { time: "11am", crowdLevel: 45 },
  { time: "12pm", crowdLevel: 70 },
  { time: "1pm", crowdLevel: 85 },
  { time: "2pm", crowdLevel: 75 },
  { time: "3pm", crowdLevel: 65 },
  { time: "4pm", crowdLevel: 80 },
  { time: "5pm", crowdLevel: 95 },
  { time: "6pm", crowdLevel: 90 },
  { time: "7pm", crowdLevel: 70 },
  { time: "8pm", crowdLevel: 50 },
  { time: "9pm", crowdLevel: 30 },
  { time: "10pm", crowdLevel: 20 },
  { time: "11pm", crowdLevel: 10 },
]

// Sample data for daily view - Weekend (8am-8pm)
export const sampleDailyDataWeekend: ProcessedDailyData[] = [
  { time: "8am", crowdLevel: 20 },
  { time: "9am", crowdLevel: 30 },
  { time: "10am", crowdLevel: 40 },
  { time: "11am", crowdLevel: 50 },
  { time: "12pm", crowdLevel: 60 },
  { time: "1pm", crowdLevel: 70 },
  { time: "2pm", crowdLevel: 75 },
  { time: "3pm", crowdLevel: 65 },
  { time: "4pm", crowdLevel: 55 },
  { time: "5pm", crowdLevel: 45 },
  { time: "6pm", crowdLevel: 35 },
  { time: "7pm", crowdLevel: 25 },
  { time: "8pm", crowdLevel: 15 },
]

// Sample data for weekly view - Adjusted for correct hours
export const sampleWeeklyData: DayData[] = [
  // Weekdays: 6am-11pm (17 hours)
  { day: "MON", data: [20, 30, 40, 50, 65, 80, 90, 85, 70, 50, 35, 25, 15, 10, 5, 5, 5] },
  { day: "TUE", data: [25, 35, 45, 55, 70, 85, 95, 90, 75, 55, 40, 30, 20, 15, 10, 5, 5] },
  { day: "WED", data: [15, 25, 35, 45, 60, 75, 85, 80, 65, 45, 30, 20, 10, 5, 5, 5, 5] },
  { day: "THU", data: [30, 40, 50, 60, 75, 90, 100, 95, 80, 60, 45, 35, 25, 20, 15, 10, 5] },
  { day: "FRI", data: [35, 45, 55, 65, 80, 95, 90, 85, 70, 50, 40, 30, 20, 15, 10, 5, 5] },
  // Weekends: 8am-8pm (12 hours)
  { day: "SAT", data: [20, 30, 40, 50, 65, 75, 70, 65, 55, 40, 30, 20] },
  { day: "SUN", data: [15, 25, 35, 45, 55, 65, 60, 55, 45, 35, 25, 15] },
]

// =================================================================
// API FUNCTIONS - These will be called by components
// =================================================================

/**
 * Fetch current status for the status bar
 * In production, this would call your actual API
 */
export async function fetchCurrentStatus(): Promise<StatusData> {
  // PRODUCTION IMPLEMENTATION:
  // return await fetch("/api/gym/current").then(res => res.json())

  // For development, return static sample data with a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // You could randomize the data here if you want more realistic
      const currentData = { ...sampleStatusData }
      currentData.lastUpdated = new Date().toISOString()

      // Optional: add some randomness to make it more realistic
      const randomFactor = Math.random() * 20 - 10 // -10 to +10
      currentData.currentOccupancy = Math.max(0, Math.min(100, currentData.currentOccupancy + randomFactor))
      currentData.currentCount = Math.round(currentData.capacity * (currentData.currentOccupancy / 100))

      resolve(currentData)
    }, 500) // 500ms delay to simulate network request
  })
}

/**
 * Fetch data for daily view
 * In production, this would call your actual API
 
export async function fetchDailyData(): Promise<ProcessedDailyData[]> {
  // PRODUCTION IMPLEMENTATION:
  // return await fetch("/api/gym/daily").then(res => res.json())

  // Check if today is a weekend
  const today = new Date().getDay() // 0 = Sunday, 6 = Saturday
  const isWeekend = today === 0 || today === 6

  // For development, return static sample data with a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(isWeekend ? sampleDailyDataWeekend : sampleDailyDataWeekday)
    }, 800) // 800ms delay to simulate network request
  })
}

*/
import { FetchFormattedDailyData } from "./daily_api" 

export async function fetchDailyData(): Promise<ProcessedDailyData[]> {
  try {
    const formattedData = await FetchFormattedDailyData()
    return formattedData
  } catch (error) {
    console.error("Failed to fetch daily data from backend. Falling back to sample data.", error)

    // Optional: Fallback to sample data if needed
    const today = new Date().getDay()
    const isWeekend = today === 0 || today === 6
    return isWeekend ? sampleDailyDataWeekend : sampleDailyDataWeekday
  }
}


/**
 * Fetch weekly data
 * In production, this would call your actual API
 */
export async function fetchWeeklyData(): Promise<DayData[]> {
  // PRODUCTION IMPLEMENTATION:
  // return await fetch("/api/gym/weekly").then(res => res.json())

  // For development, return static sample data with a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleWeeklyData)
    }, 800) // 800ms delay to simulate network request
  })
}

// =================================================================
// HELPER FUNCTIONS - Utility functions for data processing
// =================================================================

/**
 * Get the current day of week (three-letter format)
 */
export function getCurrentDay(): string {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  return days[new Date().getDay()]
}

/**
 * Helper function to get status text based on occupancy
 */
export function getStatusText(occupancy: number): string {
  if (occupancy < 30) return "Not Busy"
  if (occupancy < 70) return "Moderately Busy"
  return "Very Busy"
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

// =================================================================
// DATA TRANSFORMATION FUNCTIONS - For processing raw data
// =================================================================

/**
 * Process raw gym data into the format needed for daily view
 * This is where you would transform your actual data from sensors/database
 */
export function processRawDataForDailyView(rawData: GymCrowdEntry[]): ProcessedDailyData[] {
  // Group data by hour
  const hourlyData: { [key: string]: GymCrowdEntry[] } = {}

  rawData.forEach((entry) => {
    const date = new Date(entry.timestamp)
    const hour = date.getHours()
    const hourKey = `${hour}`

    if (!hourlyData[hourKey]) {
      hourlyData[hourKey] = []
    }

    hourlyData[hourKey].push(entry)
  })

  // Calculate average for each hour
  const processedData: ProcessedDailyData[] = []

  Object.keys(hourlyData)
    .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
    .forEach((hourKey) => {
      const entries = hourlyData[hourKey]
      const hour = Number.parseInt(hourKey)

      // Calculate average crowd level
      const totalCrowdLevel = entries.reduce((sum, entry) => {
        return sum + (entry.crowdCount / entry.capacity) * 100
      }, 0)

      const avgCrowdLevel = Math.round(totalCrowdLevel / entries.length)

      // Format time (e.g., "6am", "3pm")
      const formattedHour = hour % 12 || 12
      const period = hour < 12 ? "am" : "pm"
      const time = `${formattedHour}${period}`

      processedData.push({
        time,
        crowdLevel: avgCrowdLevel,
      })
    })

  return processedData
}

/**
 * Process raw gym data into the format needed for weekly view
 */
export function processRawDataForWeeklyView(rawData: GymCrowdEntry[]): DayData[] {
  // Group data by day of week
  const dayData: { [key: string]: { [hour: string]: GymCrowdEntry[] } } = {
    MON: {},
    TUE: {},
    WED: {},
    THU: {},
    FRI: {},
    SAT: {},
    SUN: {},
  }

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  rawData.forEach((entry) => {
    const date = new Date(entry.timestamp)
    const day = days[date.getDay()]
    const hour = date.getHours()

    if (!dayData[day][hour]) {
      dayData[day][hour] = []
    }

    dayData[day][hour].push(entry)
  })

  // Process each day
  const result: DayData[] = []

  Object.keys(dayData).forEach((day) => {
    const hourlyData = dayData[day]
    const isWeekend = day === "SAT" || day === "SUN"
    const startHour = isWeekend ? 8 : 6
    const endHour = isWeekend ? 20 : 23 // 8pm or 11pm

    const data: number[] = []

    // Fill in data for each hour
    for (let hour = startHour; hour <= endHour; hour++) {
      if (hourlyData[hour] && hourlyData[hour].length > 0) {
        // Calculate average crowd level for this hour
        const entries = hourlyData[hour]
        const totalCrowdLevel = entries.reduce((sum, entry) => {
          return sum + (entry.crowdCount / entry.capacity) * 100
        }, 0)

        const avgCrowdLevel = Math.round(totalCrowdLevel / entries.length)
        data.push(avgCrowdLevel)
      } else {
        // No data for this hour, use a default or interpolated value
        // For simplicity, using 0 here, but you might want to interpolate
        data.push(0)
      }
    }

    result.push({ day, data })
  })

  return result
}

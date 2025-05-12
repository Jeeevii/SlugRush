// daily types
export interface HourlyEntry {
  hour: number
  minute: number
  crowd_count: number
  timestamp: string
}

export interface ProcessedDailyData {
  time: string
  crowdLevel: number
}

// weekly types
export type GymCrowdEntry = {
  day_of_week: string;
  hourly_data: {
    hour: number;
    minute: number;
    crowd_count: string;
  }[];
}[];

export interface DayData {
  day: string // Three-letter day (e.g., "MON", "TUE")
  data: number[] // Array of crowd levels throughout the day (percentages 0-100)
}

// current types
export interface StatusData {
  currentOccupancy: number // Current percentage (0-100)
  currentCount: number // Current number of people
  capacity: number // Maximum capacity
  lastUpdated: string // ISO timestamp of last update
}
// src/lib/api.ts

const API_BASE_URL = 'https://slugrush-backend.onrender.com';

export interface HourlyDataEntry {
  day_id: number;
  hour: number;
  minute: number;
  crowd_count: number;
  timestamp: string;
}

export interface DailyResponse {
  id: number;
  date: string;
  status: number;
  day_of_week: string;
  hourly_data: HourlyDataEntry[];
}

// Fetches the latest daily gym data
export async function fetchDaily(): Promise<HourlyDataEntry[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/get/daily`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching /get/daily:', response.status, errorText);
      throw new Error('Failed to fetch daily gym data');
    }
    const data: DailyResponse = await response.json();
    return data.hourly_data || [];
  } catch (error) {
    console.error('Error in fetchDaily:', error);
    return [];
  }
}

// // Process hourly data for charting (averaged and grouped by hour)
// export function processHourlyData(data: HourlyDataEntry[]): { time: string; crowdLevel: number }[] {
//   if (!data || data.length === 0) return [];

//   const hourlyBuckets: Record<string, { total: number; count: number }> = {};

//   data.forEach(entry => {
//     const formattedHour = `${entry.hour % 12 || 12}${entry.hour < 12 ? 'AM' : 'PM'}`;

//     if (!hourlyBuckets[formattedHour]) {
//       hourlyBuckets[formattedHour] = { total: 0, count: 0 };
//     }

//     hourlyBuckets[formattedHour].total += entry.crowd_count;
//     hourlyBuckets[formattedHour].count += 1;
//   });

//   return Object.entries(hourlyBuckets)
//     .map(([time, { total, count }]) => ({
//       time,
//       crowdLevel: Math.round((total / count) * 100 / 150), // crowd % of max capacity
//     }))
//     .sort((a, b) => {
//       const parseHour = (t: string) => {
//         const num = parseInt(t);
//         const isAM = t.includes('AM');
//         return (isAM ? 0 : 12) + (num % 12);
//       };
//       return parseHour(a.time) - parseHour(b.time);
//     });
// }

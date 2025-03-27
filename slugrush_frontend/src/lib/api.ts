// handing backend fetching and parsing for Daily and Weekly view

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface GymDataEntry {
  id: number;
  day_of_week: string;
  hour: number;
  occupancy_count: number;
  timestamp: string;
}

export async function fetchGymData(): Promise<GymDataEntry[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/gym/crowd`);
    if (!response.ok) {
      throw new Error('Failed to fetch gym data');
    }
    const data = await response.json();
    return data.gym_data || [];
  } 
  catch (error) {
    console.error('Error fetching gym data:', error);
    return [];
  }
}

// export function processDailyData(data: GymDataEntry[]): { time: string; crowdLevel: number }[] {
//   if (!data || data.length === 0) return [];
  
//   // Group by hour
//   const hourlyData: Record<string, { total: number; count: number }> = {};
  
//   // Fixed syntax error here - removed 'const' before 'entry'
//   data.forEach(entry => {
//     // Extract hour from timestamp
//     const hour = entry.timestamp.split(':')[0];
//     const formattedHour = `${parseInt(hour) % 12 || 12}${parseInt(hour) < 12 ? 'AM' : 'PM'}`;
    
//     if (!hourlyData[formattedHour]) {
//       hourlyData[formattedHour] = { total: 0, count: 0 };
//     }
    
//     hourlyData[formattedHour].total += entry.crowd_count;
//     hourlyData[formattedHour].count += 1;
//   });
  
//   // Convert to array format needed for chart
//   return Object.entries(hourlyData).map(([time, { total, count }]) => ({
//     time,
//     crowdLevel: Math.round((total / count) * 100 / 150) // Assuming max capacity is 150
//   })).sort((a, b) => {
//     // Sort by AM/PM then by hour
//     const aIsAM = a.time.includes('AM');
//     const bIsAM = b.time.includes('AM');
    
//     if (aIsAM && !bIsAM) return -1;
//     if (!aIsAM && bIsAM) return 1;
    
//     const aHour = parseInt(a.time);
//     const bHour = parseInt(b.time);
//     return aHour - bHour;
//   });
//}
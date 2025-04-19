'use client';
import { useEffect, useState } from 'react';
import { fetchData } from '@/src/lib/api';

export default function RawGymDataViewer() {
  const [data, setData] = useState<any>(null); // Use `any` for now to allow any structure.

  useEffect(() => {
    const loadData = async () => {
      try {
        const gymData = await fetchData(); // Just call fetchData to get data
        setData(gymData); // Set the fetched data to state
        console.log('💾 Raw hourly gym data:', gymData); // Log the data
      } catch (error) {
        console.error('Error fetching gym data:', error);
      }
    };
    loadData();
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="text-black">
      <h2>🧠 Hourly Gym Data</h2>
      {!data ? (
        <p>Loading...</p> // Show loading message until data is set
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre> // Render the raw data as formatted JSON
      )}
    </div>
  );
}

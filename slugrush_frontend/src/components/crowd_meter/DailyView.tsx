'use client';
import { useEffect } from 'react';
import { fetchDaily } from '@/src/lib/api';

export default function RawGymDataViewer() {
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDaily();
      console.log('💾 Raw hourly gym data:', data);
    };
    loadData();
  }, []);

  return <div>Check the console for raw gym data 🧠📊</div>;
}

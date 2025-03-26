// components/crowd-meter/CrowdMeterContainer.tsx
"use client"

import { useState } from 'react'
import DailyView from './DailyView'
import WeeklyView from './WeeklyView'

export default function CrowdMeterContainer() {
  const [activeView, setActiveView] = useState('daily')
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-[#003c6c]/10 p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#fdc700] rounded-full flex items-center justify-center">
          <span className="text-[#003c6c] font-bold">🐌</span>
        </div>
        <p className="text-[#003c6c] font-medium">
          {activeView === 'daily' 
            ? "Today's gym crowd levels" 
            : "Weekly gym crowd forecast"}
        </p>
      </div>
      
      <div className="p-4">
        <div className="flex mb-6">
          <button
            onClick={() => setActiveView('daily')}
            className={`flex-1 py-2 text-center rounded-l-md transition-colors ${
              activeView === 'daily' 
                ? 'bg-[#003c6c] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setActiveView('weekly')}
            className={`flex-1 py-2 text-center rounded-r-md transition-colors ${
              activeView === 'weekly' 
                ? 'bg-[#003c6c] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Weekly View
          </button>
        </div>
        
        {activeView === 'daily' ? <DailyView /> : <WeeklyView />}
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import DailyView from "./DailyView"
import WeeklyView from "./WeeklyView"

export default function CrowdMeterContainer() {
  const [activeView, setActiveView] = useState("daily")

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4">
      <div className="bg-[#003C6B] text-white p-4">
        <h2 className="text-xl font-bold">CROWD HISTORY</h2>
      </div>

      <div className="flex border-b ">
        {["daily", "weekly"].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`flex-1 py-3 text-center transition-colors ${
              activeView === view
                ? "bg-white text-[#003C6B] font-semibold border-b-2 border-[#FEC700]"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 cursor-pointer"
            }`}
          >
            {view === "daily" ? "Today" : "This Week"}
          </button>
        ))}
      </div>

      <div className="p-3 sm:p-4">
        {activeView === "daily" ? <DailyView /> : <WeeklyView />}
        <p className="text-center text-sm text-gray-500 mt-4">Meter based on recent average activity.</p>
      </div>
    </div>
  )
}

"use client"

import { Users, BarChart3 } from "lucide-react"

export default function PlaceholderContent() {
  return (
    <div className="space-y-4">
      {/* Status Preview */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-[#FEC700]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-[#003C6B]" />
            <h2 className="text-xl font-bold ml-2 text-[#003C6B]">Live Status</h2>
          </div>
          <div className="text-lg font-semibold px-3 py-1 rounded-full bg-[#003C6B] text-white">Coming Soon</div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#003C6B] w-1/2"></div>
        </div>
      </div>

      {/* Chart Preview */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#003C6B] text-white p-4">
          <h2 className="text-xl font-bold">CROWD HISTORY</h2>
        </div>
        <div className="p-4">
          <div className="flex border-b mb-4">
            <div className="flex-1 py-3 text-center bg-white text-[#003C6B] font-semibold border-b-2 border-[#FEC700]">
              Today
            </div>
            <div className="flex-1 py-3 text-center bg-gray-50 text-gray-600">This Week</div>
          </div>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart Preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

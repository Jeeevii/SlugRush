"use client"

import { useState, useEffect } from "react"
import { fetchWeeklyData, getCurrentDay, getBestTimesToVisit } from "@/src/lib/api"
import type { DayData } from "@/src/lib/api"
import { Clock, TrendingUp, BarChart3, Grid } from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, BarChart } from "recharts"

export default function WeeklyView() {
  const [weeklyData, setWeeklyData] = useState<DayData[]>([])
  const [selectedDay, setSelectedDay] = useState(getCurrentDay())
  const [loading, setLoading] = useState(true)
  const [viewType, setViewType] = useState<"bar" | "heatmap">("bar")

  useEffect(() => {
    loadData()
  }, [])

  // load data
  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchWeeklyData()
      setWeeklyData(data)
    } catch (error) {
      console.error("Error loading weekly data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003C6B]"></div>
      </div>
    )
  }

  // Get the selected day's data
  const selectedDayData = weeklyData.find((d) => d.day === selectedDay) || weeklyData[0]
  const currentDay = getCurrentDay()

  // Get best times to visit
  const bestTimes = selectedDayData ? getBestTimesToVisit(selectedDayData.data) : ""

  // Check if selected day is a weekend
  const isWeekend = selectedDay === "SAT" || selectedDay === "SUN"
  const hoursText = isWeekend ? "8am - 8pm" : "6am - 11pm"

  // parse data for charts
  const chartData = selectedDayData.data.map((level, index) => {
    const hour = index + (isWeekend ? 8 : 6)
    const hourFormatted = `${hour % 12 || 12}${hour < 12 ? "am" : "pm"}`
    return {
      time: hourFormatted,
      crowdLevel: level,
      fill: level > 70 ? "#003C6B" : level > 30 ? "#006AAD" : "#12A5DC",
    }
  })

  // format colors for heatmap cell - simplifed view
  const getHeatmapColor = (level: number) => {
    if (level < 30) return "bg-green-100 text-green-800"
    if (level < 50) return "bg-green-200 text-green-800"
    if (level < 70) return "bg-amber-100 text-amber-800"
    if (level < 85) return "bg-amber-200 text-amber-800"
    return "bg-red-100 text-red-800"
  }

  // get text for heatmap cell
  const getHeatmapText = (level: number) => {
    if (level < 30) return "Low"
    if (level < 70) return "Med"
    return "High"
  }

  // tooltip/legend
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{`${label}: ${payload[0].value}%`}</p>
          <p className="text-gray-600">
            {payload[0].value < 30 ? "Not Busy" : payload[0].value < 70 ? "Moderately Busy" : "Very Busy"}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      {/* day selector */}
      <div className="grid grid-cols-7 mb-4 border-b overflow-hidden ">
        {weeklyData.map((day) => (
          <button
            key={day.day}
            onClick={() => setSelectedDay(day.day)}
            className={`py-2 text-center ${
              selectedDay === day.day
                ? "text-[#003C6B] font-bold border-b-2 border-[#FEC700]"
                : day.day === currentDay
                  ? "text-gray-700 font-medium cursor-pointer"
                  : "text-gray-500 cursor-pointer"
            }`}
          >
            {day.day}
          </button>
        ))}
      </div>

      {/* type selector */}
      <div className="flex mb-4 border rounded-md overflow-hidden">
        <button
          onClick={() => setViewType("bar")}
          className={`flex-1 py-1.5 text-xs font-medium flex justify-center items-center gap-1 ${
            viewType === "bar" ? "bg-[#003C6B] text-white" : "bg-gray-50 text-gray-700 cursor-pointer"
          }`}
        >
          <BarChart3 className="h-3 w-3" />
          <span>Bar</span>
        </button>
        <button
          onClick={() => setViewType("heatmap")}
          className={`flex-1 py-1.5 text-xs font-medium flex justify-center items-center gap-1 ${
            viewType === "heatmap" ? "bg-[#003C6B] text-white" : "bg-gray-50 text-gray-700 cursor-pointer"
          }`}
        >
          <Grid className="h-3 w-3" />
          <span>Simple</span>
        </button>
      </div>

      {/* hours legend */}
      <div className="flex justify-end mb-2">
        <span className="text-xs text-gray-500">{hoursText}</span>
      </div>

      {/* Bar Chart View */}
      {viewType === "bar" && (
        <div className="bg-white rounded-lg p-3 h-[280px] text-gray-400">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap={2}>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="crowdLevel"
                radius={[2, 2, 0, 0]}
                // Use the fill property from the data
                fill="#003C6B"
                // Override with a function to determine color
                fillOpacity={0.9}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Heatmap View */}
      {viewType === "heatmap" && (
        <div className="bg-white rounded-lg p-3">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {chartData.map((item, index) => (
              <div key={index} className={`p-2 rounded-lg text-center ${getHeatmapColor(item.crowdLevel)}`}>
                <div className="text-xs font-medium">{item.time}</div>
                <div className="text-lg font-bold">{item.crowdLevel}%</div>
                <div className="text-xs">{getHeatmapText(item.crowdLevel)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best times to visit */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-[#003C6B]" />
          <h3 className="text-sm font-medium text-[#003C6B]">Best Times to Visit on {selectedDay}</h3>
        </div>
        <p className="text-sm text-gray-700">{bestTimes}</p>
      </div>

      {/* Trend analysis */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-[#003C6B]" />
          <h3 className="text-sm font-medium text-[#003C6B]">Crowd Pattern</h3>
        </div>
        <p className="text-sm text-gray-700">
          {selectedDay === "MON" || selectedDay === "WED" || selectedDay === "FRI"
            ? "Peaks during lunch (12-1pm) and after work (5-7pm)."
            : selectedDay === "TUE" || selectedDay === "THU"
              ? "Steady increase throughout the day, peaking in the evening."
              : "More consistent throughout the day with a slight afternoon peak."}
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#12A5DC] rounded-sm mr-2"></div>
          <span className="text-xs sm:text-sm text-gray-700">Not Busy (&lt;30%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#006AAD] rounded-sm mr-2"></div>
          <span className="text-xs sm:text-sm text-gray-700">Moderate (30-70%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#003C6B] rounded-sm mr-2"></div>
          <span className="text-xs sm:text-sm text-gray-700">Very Busy (&gt;70%)</span>
        </div>
      </div>
    </div>
  )
}

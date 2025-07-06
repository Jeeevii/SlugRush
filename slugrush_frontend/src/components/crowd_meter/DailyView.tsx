"use client"

import { useState, useEffect } from "react"
import { FetchFormattedDailyData } from "@/src/lib/daily_api"
import type { ProcessedDailyData } from "@/src/lib/types"
import { ArrowDownToLine, Clock, BarChart3, LayoutGrid } from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, BarChart } from "recharts"

const CACHE_DAILY_KEY = "dailyData"
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

export default function DailyView() {
  const [data, setData] = useState<ProcessedDailyData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [viewType, setViewType] = useState<"bar" | "simplified">("bar")
  const currentHour = new Date().getHours()
  const today = new Date().getDay()
  const isWeekend = today === 0 || today === 6
  const hoursText = isWeekend ? "8am - 8pm" : "6am - 11pm"
  const startHour = isWeekend ? 8 : 6
  const endHour = isWeekend ? 20 : 23

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const cachedData = localStorage.getItem(CACHE_DAILY_KEY)
      const currentTime = Date.now()

      if (cachedData){
        const { data: cachedDataArray, timestamp } = JSON.parse(cachedData)
        if (currentTime - timestamp < CACHE_DURATION) {
          console.log("Using cached daily data")
          setData(cachedDataArray)
          setLoading(false)
          return
        }
      }

      console.log("Fetching daily data from API")
      const data = await FetchFormattedDailyData()
      //console.log("Fetched daily data:", data)
      setData(data)
      localStorage.setItem(
        CACHE_DAILY_KEY,
        JSON.stringify({ data: data, timestamp: currentTime })
      )
    } catch (error) {
      console.error("Error loading daily data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    setLoading(true)
    localStorage.removeItem(CACHE_DAILY_KEY) // Clear cache to force fetch
    console.log("Refreshing daily data")
    await loadData()
  }

  // Create list of all expected hours for today
  const allHours = []
  for (let hour = startHour; hour <= endHour; hour++) {
    const isPM = hour >= 12
    const formattedHour =
      hour === 0 ? "12am" : hour === 12 ? "12pm" : `${hour % 12}${isPM ? "pm" : "am"}`
    allHours.push({ hour, time: formattedHour })
  }

  // Create map of actual data
  const dataMap = new Map(
    data.map((item) => {
      const hour = Number.parseInt(item.time)
      const isPM = item.time.includes("pm")
      const itemHour = (hour === 12 ? 12 : hour) + (isPM && hour !== 12 ? 12 : 0)
      return [itemHour, item]
    })
  )

  const chartData = allHours.map(({ hour, time }) => {
    const fetched = dataMap.get(hour)
    const isCurrent = hour === currentHour
    const isFuture = hour > currentHour
    const crowdLevel = isFuture ? 0 : fetched?.crowdLevel ?? 0

    return {
      time,
      crowdLevel,
      isCurrent,
      fill: isCurrent
        ? "#FDC700"
        : crowdLevel > 80
        ? "#003C6B"
        : crowdLevel > 45
        ? "#006AAD"
        : "#12A5DC",
    }
  })

  const currentTimeIndex = chartData.findIndex((item) => item.isCurrent)

  // Simplified time blocks
  const timeBlocks = [
    { name: "Early Morning", range: "6-9am", level: 0, count: 0 },
    { name: "Morning", range: "9am-12pm", level: 0, count: 0 },
    { name: "Afternoon", range: "12-3pm", level: 0, count: 0 },
    { name: "Late Afternoon", range: "3-6pm", level: 0, count: 0 },
    { name: "Evening", range: "6-9pm", level: 0, count: 0 },
    { name: "Night", range: "9-11pm", level: 0, count: 0 },
  ]

  data.forEach((item) => {
    const hour = Number.parseInt(item.time)
    const isPM = item.time.includes("pm")
    const hourNum = (hour === 12 ? 12 : hour) + (isPM && hour !== 12 ? 12 : 0)

    if (hourNum >= 6 && hourNum < 9) timeBlocks[0].level += item.crowdLevel, timeBlocks[0].count++
    else if (hourNum >= 9 && hourNum < 12) timeBlocks[1].level += item.crowdLevel, timeBlocks[1].count++
    else if (hourNum >= 12 && hourNum < 15) timeBlocks[2].level += item.crowdLevel, timeBlocks[2].count++
    else if (hourNum >= 15 && hourNum < 18) timeBlocks[3].level += item.crowdLevel, timeBlocks[3].count++
    else if (hourNum >= 18 && hourNum < 21) timeBlocks[4].level += item.crowdLevel, timeBlocks[4].count++
    else if (hourNum >= 21 && hourNum < 24) timeBlocks[5].level += item.crowdLevel, timeBlocks[5].count++
  })

  timeBlocks.forEach((block) => {
    if (block.count > 0) block.level = Math.round(block.level / block.count)
  })

  const currentBlock = timeBlocks.findIndex((_, index) => {
    if (currentHour >= 6 && currentHour < 9) return index === 0
    if (currentHour >= 9 && currentHour < 12) return index === 1
    if (currentHour >= 12 && currentHour < 15) return index === 2
    if (currentHour >= 15 && currentHour < 18) return index === 3
    if (currentHour >= 18 && currentHour < 21) return index === 4
    if (currentHour >= 21 && currentHour < 24) return index === 5
    return false
  })

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

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003C6B]"></div>
      </div>
    )
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-2 text-sm text-gray-500 font-bold px-2">Today's Crowd Levels</div>
      {/* View Type Selector */}
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
          onClick={() => setViewType("simplified")}
          className={`flex-1 py-1.5 text-xs font-medium flex justify-center items-center gap-1 ${
            viewType === "simplified" ? "bg-[#003C6B] text-white " : "bg-gray-50 text-gray-700 cursor-pointer"
          }`}
        >
          <LayoutGrid className="h-3 w-3" />
          <span>Simple</span>
        </button>
      </div>

      {/* Hours & Refresh */}
      <div className="flex justify-end items-center gap-2">
        <span className="text-xs text-gray-500">{hoursText}</span>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 text-xs text-[#003C6B] px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
        >
          <ArrowDownToLine className={`h-3 w-3 ${refreshing ? "animate-bounce" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>
      
      {/* Bar Chart View */}
      {viewType === "bar" && (
        <div className="bg-white text-gray-400 rounded-lg p-3 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap={2}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="crowdLevel" radius={[2, 2, 0, 0]} fillOpacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Simplified View */}
      {viewType === "simplified" && (
        <div className="bg-white rounded-lg p-3">
          <div className="grid grid-cols-3 gap-2">
            {timeBlocks.map((block, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  index === currentBlock ? "border-2 border-[#FDC700] bg-[#FEC700]/10" : "border border-gray-200"
                }`}
              >
                <div className="text-xs font-bold text-black mb-1">{block.name}</div>
                <div className="text-xs text-gray-500 mb-2">{block.range}</div>
                <div
                  className={`text-lg font-bold ${
                    block.level < 30 ? "text-green-600" : block.level < 70 ? "text-amber-500" : "text-red-600"
                  }`}
                >
                  {block.level}%
                </div>
                <div
                  className={`text-xs ${
                    block.level < 30 ? "text-green-700" : block.level < 70 ? "text-amber-700" : "text-red-700"
                  }`}
                >
                  {block.level < 30 ? "Not Busy" : block.level < 70 ? "Moderately Busy" : "Very Busy"}
                </div>
                {index === currentBlock && (
                  <div className="flex items-center mt-1 text-xs text-[#003C6B]">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Current</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#12A5DC] rounded-sm mr-2"></div>
          <span className="text-xs sm:text-sm text-gray-700">Not Busy (&lt;45%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#006AAD] rounded-sm mr-2"></div>
          <span className="text-xs sm:text-sm text-gray-700">Moderate (45-80%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#003C6B] rounded-sm mr-2"></div>
          <span className="text-xs sm:text-sm text-gray-700">Very Busy (&gt;80%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#FDC700] rounded-sm mr-2"></div>
          <span className="text-xs sm:text-sm text-gray-700">Current</span>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        Last updated: {new Date().toLocaleTimeString()} • Updates every 30 minutes
      </div>
    </div>
  )
}

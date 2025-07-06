"use client"

import { useState, useEffect } from "react"
import { Users, RefreshCw } from "lucide-react"
import { fetchCurrentStatus, getStatusText } from "@/src/lib/current_api"
import type { StatusData } from "@/src/lib/types"

const CACHE_STATUS_KEY = "statusData"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default function StatusBar() {
  const [statusData, setStatusData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // fetch data on component mount
  useEffect(() => {
    loadData()

    // refresh data every 5 mins
    const interval = setInterval(() => {
      loadData(false)
    }, CACHE_DURATION)

    return () => clearInterval(interval)
  }, [])

  // function to load data - on every mount
  const loadData = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true)
    }
    try {
      const cachedData = localStorage.getItem(CACHE_STATUS_KEY)
      const currentTime = Date.now() 

      if (cachedData){ // if cached data exists
        //console.log("loading cached data:", JSON.parse(cachedData))
        const {data, timestamp} = JSON.parse(cachedData)
        if (currentTime - timestamp < CACHE_DURATION) {
          console.log("Using cached status data")
          setStatusData(data)
          setLoading(false)
          return
        }
      }

      // cache data doesnt exist (or expired)
      console.log("fetching status data from API")
      const data = await fetchCurrentStatus() // fetch data from get/count
      //console.log("fetched status data:", data)
      setStatusData(data) // update state 
      localStorage.setItem(
        CACHE_STATUS_KEY,
        JSON.stringify({data: data, timestamp: currentTime})
      )
      //console.log("caching current status data:", data)
    } catch (error) {
      console.error("Error loading status data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // handle manual refetch/clear cache
  const handleRefresh = async () => {
    setRefreshing(true)
    setLoading(true)
    localStorage.removeItem(CACHE_STATUS_KEY) // clear cache
    await loadData(false) // fetch fresh data
    //window.location.reload()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-[#FDC700] animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded-full w-full"></div>
      </div>
    )
  }

  if (!statusData) return null

  const statusText = getStatusText(statusData.currentOccupancy)
  const lastUpdated = new Date(statusData.lastUpdated).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-[#FDC700]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-[#003C6B]" />
          <h2 className="text-xl font-bold ml-2 text-[#003C6B]">Current Status:</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold px-3 py-1 rounded-full bg-[#003C6B] text-white">{statusText}</div>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 text-gray-500 cursor-pointer ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* People count */}
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-gray-600 font-medium">Current Occupancy:</span>
        <span className="font-bold text-[#003C6B]">
          {statusData.currentCount} / {statusData.capacity} people
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#003C6B] transition-all duration-500"
          style={{ width: `${statusData.currentOccupancy}%` }}
        ></div>
      </div>

      {/* Markers */}
      <div className="flex justify-between text-xs text-gray-500 font-medium mt-1">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>

      <div className="text-xs text-gray-500 mt-2 text-right">Last updated: {lastUpdated}</div>
    </div>
  )
}

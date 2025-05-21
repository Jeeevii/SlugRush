"use client"

import { useState, useEffect } from "react"
import { Clock, ChevronDown, ChevronUp } from "lucide-react"

interface ScheduleDay {
  day: string
  hours: string
  note?: string
}

// hardcoded hours for now, need some kind of api/scrape to automate gym hours in backend
const defaultSchedule: ScheduleDay[] = [
  { day: "Monday", hours: "6:00 AM - 11:00 PM" },
  { day: "Tuesday", hours: "6:00 AM - 11:00 PM" },
  { day: "Wednesday", hours: "6:00 AM - 11:00 PM" },
  { day: "Thursday", hours: "6:00 AM - 11:00 PM" },
  { day: "Friday", hours: "6:00 AM - 11:00 PM" },
  { day: "Saturday", hours: "8:00 AM - 8:00 PM" },
  { day: "Sunday", hours: "8:00 AM - 8:00 PM" },
]

export default function GymHours() {
  const [schedule, setSchedule] = useState<ScheduleDay[]>(defaultSchedule)
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        setSchedule(defaultSchedule)
      } catch (error) {
        console.error("Error fetching gym schedule:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [])

  const getDayName = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[new Date().getDay()]
  }

  const todaySchedule = schedule.find((day) => day.day === getDayName())

  // monkey brain ahh hardcoded logic - SWAP THIS OUT ONCE WE HAVE A REAL API
  const isGymOpen = () => {
    const now = new Date()
    
    // Get current time in Santa Cruz timezone
    const nowInSantaCruz = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now)

    const [currentHour, currentMinute] = nowInSantaCruz.split(":").map(Number)

    // 0-6 = Sunday-Saturday
    const currentDay = now.getDay()

    // weekend check, else default to weekdays
    const isWeekend = currentDay === 0 || currentDay === 6

    // weekdays: 6:00 AM - 11:00 PM
    if (!isWeekend) {
      return (
        (currentHour > 6 || (currentHour === 6 && currentMinute >= 0)) &&
        (currentHour < 23 || (currentHour === 23 && currentMinute === 0))
      )
    }

    // weekends: 8:00 AM - 8:00 PM
    return (
      (currentHour > 8 || (currentHour === 8 && currentMinute >= 0)) &&
      (currentHour < 20 || (currentHour === 20 && currentMinute === 0))
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-[#003C6B] text-white cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Gym Hours</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>

      <div className="p-3 border-b font-bold text-black border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">Today ({getDayName()}):</span>
            <span className="text-sm">{todaySchedule?.hours}</span>
          </div>
          {loading ? (
            <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
          ) : (
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isGymOpen() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {isGymOpen() ? "Open Now" : "Closed Now"}
            </span>
          )}
        </div>
        {todaySchedule?.note && <p className="text-xs text-amber-600 mt-1">{todaySchedule.note}</p>}
      </div>

      {isExpanded && (
        <div className="p-3 font-bold text-gray-600">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {schedule.map((day) => (
              <div key={day.day} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                <span className="text-sm font-medium">{day.day}:</span>
                <span className="text-sm">{day.hours}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Automatic schedule updates coming soon.
          </p>
        </div>
      )}
    </div>
  )
}

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

  // Beta version - manual, would be fetch function in future (or from api.ts)
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true)
      try {
        // const response = await fetch('/api/gym/schedule');
        // const data = await response.json();
        // setSchedule(data);

        // for now, simulate a delay and use the default schedule
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Simulate a special note for today
        // const today = new Date().getDay() // 0 = Sunday, 6 = Saturday
        const updatedSchedule = [...defaultSchedule]
        // // notes in case of updates
        // if (today === 2) {
        //   // Tuesday
        //   updatedSchedule[today].note = "Closes early at 10:00 PM for maintenance"
        // }
        setSchedule(updatedSchedule)
      } catch (error) {
        console.error("Error fetching gym schedule:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [])

  // Get today's day name
  const getDayName = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[new Date().getDay()]
  }

  // Find today's schedule
  const todaySchedule = schedule.find((day) => day.day === getDayName())

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

      {/* Highlight current day's hours*/}
      <div className="p-3 border-b font-bold text-black border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">Today ({getDayName()}):</span>
            <span className="text-sm">{todaySchedule?.hours}</span>
          </div>
          {loading ? (
            <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
          ) : (
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Open Now</span>
          )}
        </div>
        {todaySchedule?.note && <p className="text-xs text-amber-600 mt-1">{todaySchedule.note}</p>}
      </div>

      {/* Expandable full schedule */}
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
            {/* Last updated: {new Date().toLocaleDateString()} */}
          </p>
        </div>
      )}
    </div>
  )
}

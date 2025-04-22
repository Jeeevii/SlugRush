"use client"

import { useState, useEffect } from "react"
import LiveIndicator from "./ui/LiveIndicator"
import { Menu } from "lucide-react"

export default function Header() {
  const [greeting, setGreeting] = useState("")

  // Set time-based greeting
  useEffect(() => {
    const hour = new Date().getHours()
    let newGreeting = ""

    if (hour < 12) newGreeting = "Good morning"
    else if (hour < 18) newGreeting = "Good afternoon"
    else newGreeting = "Good evening"

    setGreeting(newGreeting)
  }, [])

  return (
    <header className="bg-[#003C6B] text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FEC700] rounded-full flex items-center justify-center">
              <span className="text-[#003C6B] text-xl font-bold">🐌</span>
            </div>
            <h1 className="text-2xl font-bold">SlugRush</h1>
          </div>

          <div className="flex items-center gap-3">
            <LiveIndicator />
            <button className="p-1.5 rounded hover:bg-[#002a4d] transition-colors cursor-pointer">
              <Menu className="h-5 w-5" />
            </button>
            {/* Add a About/Contact/Whatever page when menu is clicked? */}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between">
          <p className="text-sm text-gray-200 font-bold">{greeting}, Slugs!</p>
          <span className="text-sm text-[#FEC700]">UCSC Fitness Center's Crowd Meter</span>
        </div>
      </div>
    </header>
  )
}

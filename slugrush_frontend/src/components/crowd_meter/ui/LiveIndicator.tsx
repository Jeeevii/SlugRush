"use client"

import { useEffect, useState } from "react"

export default function LiveIndicator() {
  const [isVisible, setIsVisible] = useState(true)

  // create flashing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-2.5 h-2.5 rounded-full ${isVisible ? "bg-red-500" : "bg-red-300"} transition-colors duration-300`}
      ></div>
      <span className="text-xs font-semibold uppercase tracking-wider">Live</span>
    </div>
  )
}

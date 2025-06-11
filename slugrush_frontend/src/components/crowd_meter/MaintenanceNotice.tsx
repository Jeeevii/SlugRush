"use client"

import { useState } from "react"
import { Construction, Calendar, X } from "lucide-react"

export default function MaintenanceNotice() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-[#FEC700] border-l-4 border-[#003C6B] shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="bg-[#003C6B] rounded-full p-2 text-white flex-shrink-0 mt-0.5">
            <Construction className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-bold text-[#003C6B] text-sm sm:text-base">
                  🚧 SlugRush Is Preparing for Official Release 🚧
                </h3>
                <p className="text-[#003C6B]/80 text-xs sm:text-sm mt-1">
                  I’m currently optimizing the backend for scalability on Free Tier constraints, adding caching for a smoother frontend experience, and making some final UI/UX tweaks. 
                  The official launch is planned for{" "}
                  <span className="font-semibold">July 2025</span>.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="bg-[#003C6B] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>July 2025</span>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 rounded-full hover:bg-[#003C6B]/10 transition-colors"
                  aria-label="Dismiss notice"
                >
                  <X className="h-4 w-4 text-[#003C6B] cursor-pointer" />
                </button>
              </div>
            </div>

            <div className="mt-2 text-xs sm:text-sm text-[#003C6B]/80">
              Thanks for your patience! In the meantime, you can check out the{" "}
              <a
                href="https://github.com/Jeeevii/SlugRush/tree/main?tab=readme-ov-file"
                className="text-[#003C6B] underline hover:text-[#002a4d]"
                rel="noopener noreferrer"
              >
                GitHub repo
              </a>{" "}
              for live updates on development.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

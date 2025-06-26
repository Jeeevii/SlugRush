"use client"

import type React from "react"
import { Lock, Calendar } from "lucide-react"

interface ComingSoonOverlayProps {
  children: React.ReactNode
}

export default function ComingSoonOverlay({ children }: ComingSoonOverlayProps) {
  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none">{children}</div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg border border-[#003C6B]/20 p-6 max-w-sm mx-4 text-center">
          <div className="bg-[#003C6B] rounded-full p-3 w-fit mx-auto mb-4">
            <Lock className="h-6 w-6 text-white" />
          </div>

          <h3 className="font-bold text-[#003C6B] text-xl mb-3">Coming Soon</h3>

          <div className="space-y-2 mb-4">
            <div className="bg-[#003C6B]/5 py-2 px-4 rounded-md">
              <span className="font-medium text-[#003C6B]">Live Status</span>
            </div>
            <div className="bg-[#003C6B]/5 py-2 px-4 rounded-md">
              <span className="font-medium text-[#003C6B]">Crowd History</span>
            </div>
            <div className="bg-[#003C6B]/5 py-2 px-4 rounded-md">
              <span className="font-medium text-[#003C6B]">Gym Hours</span>
            </div>
          </div>

          <div className="bg-[#FEC700]/10 border border-[#FEC700]/20 rounded-lg p-3 flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4 text-[#003C6B]" />
            <span className="text-sm font-medium text-[#003C6B]">Available Early July 2025</span>
          </div>
        </div>
      </div>
    </div>
  )
}

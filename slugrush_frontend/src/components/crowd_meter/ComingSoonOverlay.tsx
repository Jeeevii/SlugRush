"use client"

import type React from "react"
import { Lock, Calendar, Github } from "lucide-react"

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

          {/* Launch Date */}
          <div className="bg-[#FEC700]/10 border border-[#FEC700]/20 rounded-lg p-3 flex items-center justify-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-[#003C6B]" />
            <span className="text-sm font-medium text-[#003C6B]">Available Early July 2025</span>
          </div>

          {/* ⭐️ Highlighted GitHub Link */}
          <a
            href="https://github.com/Jeeevii/SlugRush/tree/Jeevi?tab=readme-ov-file"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#003C6B]/5 border border-[#003C6B]/10 rounded-lg px-4 py-2 mt-1 text-sm font-medium text-[#003C6B] hover:bg-[#003C6B]/10 transition flex items-center justify-center gap-2"
          >
            <Github className="h-4 w-4" />
            Check out GitHub for live updates
          </a>
        </div>
      </div>
    </div>
  )
}

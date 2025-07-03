"use client"

import { useState, useEffect } from "react"
import LiveIndicator from "./ui/LiveIndicator"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const [greeting, setGreeting] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
          <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#FDC700] rounded-full flex items-center justify-center">
                <img src="/icons/web-app-manifest-512x512.png" alt="Mr.Slug" className="w-10 h-10 rounded-full" />
                {/* <span className="text-[#003C6B] text-xl font-bold">🐌</span> */}
              </div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">SlugRush</h1>
                <div className="ml-2">
                  <LiveIndicator />
                </div>
              </div>
            </Link>
          {/* default menu */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1">
              <Link href="/about" className="px-2 py-1.5 text-sm rounded hover:bg-[#002a4d] transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="px-2 py-1.5 text-sm rounded hover:bg-[#002a4d] transition-colors">
                Contact
              </Link>
            </div>
            <button
              className="md:hidden p-1.5 rounded hover:bg-[#002a4d] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen &&  (
          <div className="md:hidden mt-2 pt-2 border-t border-[#004d8a]">
            <Link
              href="/about"
              className="block w-full text-right px-2 py-2 hover:bg-[#002a4d] rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="block w-full text-right px-2 py-2 hover:bg-[#002a4d] rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center justify-between">
          <p className="text-sm text-gray-200 font-bold">{greeting}, Slugs!</p>
          <span className="text-sm text-[#FEC700]">UCSC Facility Occupancy Counts</span>
        </div>
      </div>
    </header>
  )
}

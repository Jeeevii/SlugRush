"use client"

import { useState, useEffect } from "react"
import { X, Download, Smartphone } from "lucide-react"
import Link from "next/link"

export default function InstallGuide() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const hasDismissed = localStorage.getItem("pwa-prompt-dismissed")
    const hasInstalled = localStorage.getItem("pwa-installed")

    if (hasDismissed || hasInstalled) {
      return
    }

    // Check if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    if (isMobile) {
      // Show prompt after a short delay
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 3000) // Show after 3 seconds

      return () => clearTimeout(timer)
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        localStorage.setItem("pwa-installed", "true")
      }

      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-prompt-dismissed", "true")
  }

  const handleDontAskAgain = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-prompt-dismissed", "true")
    // Set expiration for 30 days
    const expiration = new Date()
    expiration.setDate(expiration.getDate() + 30)
    localStorage.setItem("pwa-prompt-expiration", expiration.toISOString())
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-[#003C6B]/20 p-4">
        <div className="flex items-start gap-3">
          <div className="bg-[#003C6B] rounded-full p-2 flex-shrink-0">
            <Smartphone className="h-5 w-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#003C6B] text-sm mb-1">Get the SlugRush App</h3>
            <p className="text-xs text-gray-600 mb-3">
              Add SlugRush to your home screen for quick access and a better experience!
            </p>

            <div className="flex flex-col gap-2">
              {deferredPrompt ? (
                <button
                  onClick={handleInstall}
                  className="bg-[#003C6B] text-white px-3 py-2 rounded text-sm font-medium hover:bg-[#002a4d] transition-colors flex items-center justify-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Install App
                </button>
              ) : (
                <Link
                  href="/download"
                  className="bg-[#003C6B] text-white px-3 py-2 rounded text-sm font-medium hover:bg-[#002a4d] transition-colors flex items-center justify-center gap-1"
                  onClick={() => setShowPrompt(false)}
                >
                  <Download className="h-4 w-4" />
                  See Instructions
                </Link>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleDismiss}
                  className="flex-1 text-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-100 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleDontAskAgain}
                  className="flex-1 text-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-100 transition-colors"
                >
                  Don't Ask Again
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}

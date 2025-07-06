import Header from "../../components/crowd_meter/Header"
import { ArrowLeft, Smartphone, Monitor, Share, Plus, Home, DollarSign } from "lucide-react"
import Link from "next/link"

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header with back button */}
          <div className="bg-[#003C6B] text-white p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold">Get SlugRush App</h1>
            </div>
            <p className="text-gray-200 text-sm sm:text-base">Add SlugRush to your home screen for quick access</p>
          </div>

          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Why Download Section */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-[#003C6B] mb-4">Why Add to Home Screen?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-[#FEC700]/10 border border-[#FEC700]/20 rounded-lg p-3 sm:p-4 text-center">
                  <div className="bg-[#003C6B] rounded-full p-2 sm:p-3 w-fit mx-auto mb-2 sm:mb-3">
                    <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-[#003C6B] mb-1 sm:mb-2 text-sm sm:text-base">Quick Access</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Launch SlugRush instantly from your home screen</p>
                </div>

                <div className="bg-[#12A5DC]/10 border border-[#12A5DC]/20 rounded-lg p-3 sm:p-4 text-center">
                  <div className="bg-[#003C6B] rounded-full p-2 sm:p-3 w-fit mx-auto mb-2 sm:mb-3">
                    <Monitor className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-[#003C6B] mb-1 sm:mb-2 text-sm sm:text-base">App-Like Experience</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Full-screen experience without browser bars</p>
                </div>
              </div>
            </section>

            {/* Installation Instructions */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-[#003C6B] mb-4 text-center">
                How to Add SlugRush to Your Home Screen
              </h2>

              <div className="bg-gradient-to-br from-[#FEC700]/5 to-[#12A5DC]/5 border border-[#003C6B]/20 rounded-lg p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Instructions */}
                  <div className="space-y-4">
                    <div className="text-center lg:text-left mb-4">
                      <h3 className="font-bold text-[#003C6B] text-base sm:text-lg mb-2">
                        📱 iPhone/iPad & 🤖 Android
                      </h3>
                      <p className="text-sm text-gray-600">Works on both iOS Safari and Android Chrome</p>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-[#003C6B] text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-[#003C6B] text-sm sm:text-base">
                            Open SlugRush in your browser
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">Use Safari (iOS) or Chrome (Android)</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-[#003C6B] text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-[#003C6B] text-sm sm:text-base">Tap the Share/Menu button</p>
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 flex-wrap">
                            Look for <Share className="h-3 w-3 sm:h-4 sm:w-4" /> (iOS) or ⋮ (Android)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-[#003C6B] text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          3
                        </div>
                        <div>
                          <p className="font-medium text-[#003C6B] text-sm sm:text-base">Select "Add to Home Screen"</p>
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 flex-wrap">
                            Tap <Plus className="h-3 w-3 sm:h-4 sm:w-4" /> "Add to Home Screen" option
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-[#003C6B] text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          4
                        </div>
                        <div>
                          <p className="font-medium text-[#003C6B] text-sm sm:text-base">Confirm and Add</p>
                          <p className="text-xs sm:text-sm text-gray-600">Tap "Add" to complete the installation</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Demo GIF Placeholder */}
                  <div className="bg-gray-100 rounded-lg p-4 sm:p-6 flex items-center justify-center min-h-[250px] sm:min-h-[300px]">
                    <div className="text-center">
                        <img
                            src="/slugrush_guide.gif"
                            alt="Add to Home Screen Demo"
                            className="rounded-lg shadow-sm mx-auto max-w-full h-auto"
                        />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Why PWA Section */}
            {/* <section>
              <h2 className="text-lg sm:text-xl font-bold text-[#003C6B] mb-4">Why Not a Regular App?</h2>
              <div className="bg-[#003C6B]/5 border border-[#003C6B]/20 rounded-lg p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-[#FEC700] rounded-full p-2 sm:p-3 flex-shrink-0">
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-[#003C6B]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#003C6B] mb-2 text-sm sm:text-base">
                      App Store & Play Store Are Expensive!
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 mb-3">
                      Publishing apps to the App Store and Google Play Store costs hundreds of dollars annually, plus
                      ongoing maintenance fees. As a student project, we chose this web app approach to keep SlugRush
                      free and accessible to all UCSC students.
                    </p>
                    <div className="bg-white rounded-lg p-3 border border-[#FEC700]/30">
                      <p className="text-xs sm:text-sm text-[#003C6B] font-medium">
                        💡 The good news: This web app works just like a native app once installed! You get the same
                        experience without the app store hassle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}

            {/* Need Help Section */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-[#003C6B] mb-4">Need Help?</h2>
              <div className="bg-[#12A5DC]/5 border border-[#12A5DC]/20 rounded-lg p-4 sm:p-6">
                <div>
                  <h3 className="font-medium text-[#003C6B] mb-2 text-sm sm:text-base">
                    Don't see the "Add to Home Screen" option?
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    Make sure you're using Safari (iOS) or Chrome (Android). Some browsers don't support this feature.
                    Try refreshing the page or restarting your browser.
                  </p>
                  {/* <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-medium text-[#003C6B]">Still need help?</span> Contact us at{" "}
                      <a href="mailto:test@slugrush.com" className="text-blue-600 hover:underline font-medium">
                        test@slugrush.com
                      </a>{" "}
                      and we'll walk you through the process!
                    </p>
                  </div> */}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

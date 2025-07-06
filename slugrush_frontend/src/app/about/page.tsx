import Header from "@/src/components/crowd_meter/Header"
import { Linkedin, Github, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/slugbackground.png')" }}>
      <Header />

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header with back button */}
          <div className="bg-[#003C6B] text-white p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold">About SlugRush</h1>
            </div>
            <p className="text-gray-200 text-sm sm:text-base">Real-time gym crowd tracking for UCSC students</p>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Mission Section */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-[#003C6B] mb-3">Our Mission</h2>
              <p className="text-gray-700">
                SlugRush was created to help UCSC students plan their gym visits more efficiently. We noticed that due to the recent capacity limits this year, 
                the gym was extremely crowded at certain times resulting in 5-15 minute wait times outside, making it difficult to have a workout or even losing interest entirely.
              </p>
            </section>

            {/* How It Works Section */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-[#003C6B] mb-3">How It Works</h2>
              <p className="text-gray-700">
                The UCSC Fitness Center currently does manual headcounts and updates their page approximately every ~20 minutes.
                SlugRush automatically web scrapes this data, processes it, and presents it in an easy-to-understand
                format with historical patterns and predictions.
              </p>
            </section>

            {/* Team Section */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-[#003C6B] mb-4">Our Team</h2>
              <div className="bg-[#FEC700]/10 border border-[#FEC700]/20 rounded-lg p-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <img
                      src="https://media.licdn.com/dms/image/v2/D5603AQFksHvcur7nVw/profile-displayphoto-shrink_400_400/B56Zb1LQfyH0A4-/0/1747870092246?e=1753315200&v=beta&t=lRy5xlJzpc_F5iFF-oJr4V1OkEZNrBuTQc9RBPuITIU"
                      alt="Linkedin Pic - Jeevithan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#003C6B] text-lg">Jeevithan Mahenthran</h3>
                    <p className="text-gray-600">Project Lead & Full Stack Engineer</p>
                    <div className="flex items-center gap-3 mt-2">
                      <a
                        href="https://linkedin.com/in/jeevithan-mahenthran"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                      <a
                        href="https://github.com/jeeevii"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <Github className="h-5 w-5" />
                        <span className="text-sm">GitHub</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#12A5DC]/10 border border-[#12A5DC]/20 rounded-lg p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src="https://media.licdn.com/dms/image/v2/D5603AQHLmLp32VepvA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1720142793510?e=1752105600&v=beta&t=632JsWyeLYibMloBdpKkggE0bHXqrIYi6npfrxDqVjU"
                        alt="Linkedin Pic - Kevin"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#003C6B]">Hanlin (Kevin) Huang</h3>
                      <p className="text-sm text-gray-600">Data Analyst</p>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href="https://www.linkedin.com/in/hanlin-huang-6aa4131ba/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                          <span className="text-xs">LinkedIn</span>
                        </a>
                        <a
                          href="https://github.com/iunsafa"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          <Github className="h-4 w-4" />
                          <span className="text-xs">GitHub</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#12A5DC]/10 border border-[#12A5DC]/20 rounded-lg p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src="https://media.licdn.com/dms/image/v2/D4E03AQFLSCl04ivYcw/profile-displayphoto-shrink_200_200/B4EZbxGZDFHMAc-/0/1747801707667?e=1757548800&v=beta&t=peOYr-fnY2TbNpN_D8sYrTV2mDODERR4kG2suZAfRJ0"
                          alt="Linkedin Pic - Shanglong"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                      <h3 className="font-bold text-[#003C6B]">Shanglong Chen</h3>
                      <p className="text-sm text-gray-600">UI/UX Designer</p>
                      <div className="flex items-center gap-2 mt-2">
                        <a
                          href="https://www.linkedin.com/in/shanglong-chen-56a98a29a/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                          <span className="text-xs">LinkedIn</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

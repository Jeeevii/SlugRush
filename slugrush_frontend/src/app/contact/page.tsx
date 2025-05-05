import Header from "@/src/components/crowd_meter/Header"
import Link from "next/link"
import {
  Mail,
  ExternalLink,
  ArrowLeft,
  Phone,
  CalendarClock,
  MapPin,
  Globe,
} from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header with back button */}
          <div className="bg-[#003C6B] text-white p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/"
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold">Contact Information</h1>
            </div>
            <p className="text-gray-200 text-sm sm:text-base">
              Get in touch with us or the UCSC gym
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* SlugRush Team Contact */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-[#003C6B] mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#003C6B]" />
                SlugRush Team
              </h2>

              <p className="text-gray-700 mb-3">
                Have questions, feedback, or suggestions? We'd love to hear from you!
              </p>

              <div className="bg-[#FEC700]/10 border border-[#FEC700]/20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="font-medium text-[#003C6B]">slugrushedu@gmail.com</span>
                <a
                  href="mailto:slugrushedu@gmail.com"
                  className="bg-[#003C6B] text-white px-4 py-2 rounded text-sm hover:bg-[#002a4d] transition-colors text-center"
                >
                  Email Us
                </a>
              </div>
            </section>

            {/* UCSC Gym Resources */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-[#003C6B] mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-[#003C6B]" />
                UCSC Gym Resources
              </h2>

              <div className="space-y-4">
                {/* Phone */}
                <div className="bg-[#12A5DC]/10 border border-[#12A5DC]/20 rounded-lg p-4">
                  <h3 className="font-medium text-[#003C6B] mb-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#003C6B]" />
                    Phone
                  </h3>
                  <p className="text-gray-700">(831) 459-2531</p>
                </div>

                {/* Email */}
                <div className="bg-[#12A5DC]/10 border border-[#12A5DC]/20 rounded-lg p-4">
                  <h3 className="font-medium text-[#003C6B] mb-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#003C6B]" />
                    Email
                  </h3>
                  <a
                    href="mailto:opers@ucsc.edu"
                    className="text-blue-600 hover:underline"
                  >
                    campusrec@ucsc.edu
                  </a>
                </div>

                {/* Hours */}
                <div className="bg-[#12A5DC]/10 border border-[#12A5DC]/20 rounded-lg p-4">
                  <h3 className="font-medium text-[#003C6B] mb-1 flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-[#003C6B]" />
                    Hours
                  </h3>
                  <p className="text-gray-700">Weekdays: 6am–11pm</p>
                  <p className="text-gray-700">Weekends: 8am–8pm</p>
                </div>

                {/* Website */}
                <div className="bg-[#12A5DC]/10 border border-[#12A5DC]/20 rounded-lg p-4">
                  <h3 className="font-medium text-[#003C6B] mb-1 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#003C6B]" />
                    Website
                  </h3>
                  <a
                    href="https://recreation.ucsc.edu/facilities/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    UCSC Recreation <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Location */}
                <div className="bg-[#12A5DC]/10 border border-[#12A5DC]/20 rounded-lg p-4">
                  <h3 className="font-medium text-[#003C6B] mb-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#003C6B]" />
                    Location
                  </h3>
                  <a
                    href="https://www.google.com/maps/place/Athletics+%26+Recreation+Fitness+Center/@36.9936176,-122.0572548,17z/data=!3m1!4b1!4m16!1m9!3m8!1s0x808e41a47cba1555:0xb83fef8de70f6995!2sAthletics+%26+Recreation+Fitness+Center!8m2!3d36.9936176!4d-122.0546745!9m1!1b1!16s%2Fg%2F11b76flyb9!3m5!1s0x808e41a47cba1555:0xb83fef8de70f6995!8m2!3d36.9936176!4d-122.0546745!16s%2Fg%2F11b76flyb9?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    East Field House <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

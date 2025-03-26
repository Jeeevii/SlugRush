// app/page.js
import CrowdMeterContainer from '../components/crowd_meter/CrowdMeterContainer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center text-[#003c6c] mb-6">UCSC Gym Crowd Meter</h1>
      <CrowdMeterContainer />
    </div>
  )
}
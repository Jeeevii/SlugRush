// app/page.js
import CrowdMeterContainer from '../components/crowd_meter/CrowdMeterContainer'
import GymHours from '../components/crowd_meter/GymHours'
import Header from '../components/crowd_meter/Header'
import StatusBar from '../components/crowd_meter/StatusView'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <StatusBar/>
        <GymHours />
        <CrowdMeterContainer />
      </div>
    </div>
  )
}
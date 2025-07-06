import React from 'react'

import CrowdMeterContainer from '../components/crowd_meter/CrowdMeterContainer'
import GymHours from '../components/crowd_meter/GymHours'
import Header from '../components/crowd_meter/Header'
import StatusBar from '../components/crowd_meter/StatusView'
import InstallGuide from '../components/pop_ups/InstallGuide'


export default function Home() {
  return (
    <div className="min-h-screen bg-cover bg-center">
      <Header />
        <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <StatusBar/>
        <CrowdMeterContainer /> 
        <GymHours />
       </div>
      <InstallGuide />
    </div>
  )
}

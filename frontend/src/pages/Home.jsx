import React from 'react'
import Header from '../components/common/Header'
import StatusCard from '../components/common/StatusCard'
import { AlertCircle, Bell, FileText, ShieldAlert } from 'lucide-react'
import VulnerabilityChart from '../components/charts/Home/VulnerabilityChart'
import ThreatCharts from '../components/charts/Home/ThreatCharts'
import AlertChart from '../components/charts/Home/AlertChart'

const statusData = [
  { title: 'Vulnerabilities', value: '23', color: 'red', icon: AlertCircle },
  { title: 'Scan Reports', value: '15', color: 'blue', icon: FileText },
  { title: 'Threats Detected', value: '5', color: 'yellow', icon: ShieldAlert },
  { title: 'Active Alerts', value: '3', color: 'green', icon: Bell },
]

const Home = () => {
  return (
   <div className='flex-1 overflow-auto relative z-10'>
    <Header title="Overview" />
    <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
      {/* Your code goes here */}
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8' > 
       {statusData.map((status,index)=>(
        <StatusCard
        key={index}
        title={status.title}
        value={status.value}
        color={status.color}
        icon={status.icon}
        />
       ))}
       </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <VulnerabilityChart/>
          <AlertChart/>
          <ThreatCharts/>

          

        </div>


      
    </main>
   </div>
  )
}

export default Home

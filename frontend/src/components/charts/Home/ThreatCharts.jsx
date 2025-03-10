
import React from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const threatData = [
  // { name: 'Open Ports', threats: 10 }, 
   { name: 'Unknown Devices', threats: 7 },
   { name: 'Brute Force Attempts', threats: 5 },
  // { name: 'Phishing Links', threats: 8 }, 
   { name: 'Suspicious Traffic', threats: 6 }, 
   { name: 'ARP Spoofing', threats: 4 }, 
   { name: 'Man-in-the-Middle Attacks', threats: 2 }, 
 ];

 const COLORS = { 
  "Unknown Devices": "#3B82F6", // Blue
  "Brute Force Attempts": "#6366F1", // Indigo
  "Phishing Links": "#8B5CF6", // Violet
  "Suspicious Traffic": "#A78BFA", // Light Purple
  "ARP Spoofing": "#4F46E5" // Dark Blue
}
const ThreatCharts = () => {
  return (
    <div
    className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
    >
      <h2 className='text-lg font-medium mb-4 text-gray-100'>Monthly Threat Analysis</h2>
      <div className='h-80'>
        <ResponsiveContainer>
          <BarChart
          data={threatData}
          >
          <CartesianGrid  strokeDasharray='3 3' stroke='#4B5563'/>
          <XAxis dataKey='name' stroke='#9ca3af'/>
          <YAxis stroke='#9ca3af'/>
          <Tooltip 
            contentStyle={
              {
                backgroundColor: '#1F2937',
                borderColor: '#4B5563'
              }
            }
            itemStyle={{ color: '#9ca3af'}}
            />
          <Legend/>
          <Bar
          dataKey={"threats"} fill='#8884d8'
          >
              {threatData.map((entry,index)=>(
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]}/>
              ))}
          </Bar>
          

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ThreatCharts





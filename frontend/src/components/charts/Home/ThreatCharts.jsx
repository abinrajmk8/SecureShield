import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = {
  "Open Port": "#3B82F6", // Blue
  "Unknown Device": "#6366F1", // Indigo
  "Suspicious": "#A78BFA", // Light Purple
  "ARP Spoof": "#4F46E5", // Dark Blue
  "Admin Flagged": "#E11D48" // Red (includes Prioritized Unknown Device and Unknown Admin Flagged)
};

const ThreatCharts = ({ reports }) => {
  const currentMonth = new Date().getMonth();
  const filteredReports = reports.filter(report => new Date(report.timestamp).getMonth() === currentMonth);

  // Count threats and map to shorter names
  const threatCounts = filteredReports.reduce((acc, report) => {
    let type = report.type;
    if (type === "Open Port Found") type = "Open Port";
    if (type === "Unknown Device Detected") type = "Unknown Device";
    if (type === "Suspicious Traffic") type = "Suspicious";
    if (type === "ARP Spoofing") type = "ARP Spoof";
    if (type === "Prioritized Unknown Device" || type === "Unknown Admin Flagged") type = "Admin Flagged";
    
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const formattedData = Object.entries(threatCounts).map(([name, threats]) => ({ name, threats }));

  return (
    <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'>
      <h2 className='text-lg font-medium mb-4 text-gray-100'>Monthly Threat Analysis</h2>
      <div className='h-80'>
        <ResponsiveContainer>
          <BarChart data={formattedData} barSize={30} margin={{ left: 30, right: 30, bottom: 70 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af" 
              interval={0} 
              tick={({ x, y, payload }) => {
                const screenWidth = window.innerWidth;

                // Handle rotation for smaller screens
                let rotation = "";
                let textAnchor = "middle";
                let dy = 16;
                
                if (screenWidth < 500) {
                  rotation = `rotate(-90 ${x} ${y})`;
                  dy = 4;
                } else if (screenWidth < 800) {
                  rotation = `rotate(-45 ${x} ${y})`;
                  textAnchor = "end";
                }

                // Multi-line text handling
                const words = payload.value.split(" ");
                const isMultiline = words.length > 1 && screenWidth < 600;

                return (
                  <text x={x} y={y} dy={dy} textAnchor={textAnchor} transform={rotation} fill="#9ca3af" fontSize={12}>
                    {isMultiline ? (
                      <>
                        <tspan x={x} dy="-5">{words[0]}</tspan>
                        <tspan x={x} dy="12">{words.slice(1).join(" ")}</tspan>
                      </>
                    ) : (
                      payload.value
                    )}
                  </text>
                );
              }}
            />
            <YAxis stroke='#9ca3af' />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }}
              itemStyle={{ color: '#9ca3af' }}
            />
            <Legend />
            <Bar dataKey='threats' fill='#8884d8'>
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThreatCharts;

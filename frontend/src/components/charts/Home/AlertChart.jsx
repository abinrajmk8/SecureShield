import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  Critical: '#FF0000', // Red
  High: '#FF4D00', // Orange
  Medium: '#FFBB28', // Yellow
  Low: '#FF8042', // Green
};

const AlertChart = ({ reports }) => {
  // Compute alert counts dynamically
  const alertData = [
    { name: 'Critical', value: reports.filter(r => r.severity === 'Critical').length },
    { name: 'High', value: reports.filter(r => r.severity === 'High').length },
    { name: 'Medium', value: reports.filter(r => r.severity === 'Medium').length },
    { name: 'Low', value: reports.filter(r => r.severity === 'Low').length },
  ].map(alert => ({
    ...alert,
    value: alert.value === 0 ? 0.02 : alert.value, // Ensure 0-value sections are visible
  }));

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-medium mb-4 text-gray-100">Active Alerts</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={alertData}
              cx="50%"
              cy="50%"
              startAngle={360}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={7}
              dataKey="value"
              label={({ name, percent }) => `${name} ${Math.max((percent * 100), 1).toFixed(0)}%`} // Ensures 0% is visible
              labelLine={{ stroke: '#fff' }} // Keeps lines visible
              isAnimationActive={true}
              animationDuration={500}
              animationEasing="ease-in-out"
            >
              {alertData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                borderColor: '#4B5563',
              }}
              itemStyle={{ color: '#9ca3af' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AlertChart;

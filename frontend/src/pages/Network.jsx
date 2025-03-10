import React from 'react';
import Header from '../components/common/Header';
import StatusCard from '../components/common/StatusCard';
import { AlertCircle } from 'lucide-react';
import DeviceTables, { useOnlineDevices } from '../components/Tables/DeviceTables';

const Network = () => {
  const { onlineDevices, updateOnlineDevices } = useOnlineDevices();
  const statusData = [
    { title: 'Devices Scanned', value: '23', color: 'blue', icon: AlertCircle },
    { title: 'Vulnerabilities Found', value: '15', color: 'red', icon: AlertCircle },
    { title: 'Threats Detected', value: '5', color: 'yellow', icon: AlertCircle },
    { title: 'Online Devices', value: onlineDevices.toString(), color: 'green', icon: AlertCircle },
  ];

  console.log('Online devices count:', onlineDevices); // Debug log

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title="Network" />
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
          {statusData.map((status, index) => (
            <StatusCard
              key={index}
              title={status.title}
              value={status.value}
              color={status.color}
              icon={status.icon}
            />
          ))}
        </div>
        <DeviceTables updateOnlineDevices={updateOnlineDevices} />
      </main>
    </div>
  );
};

export default Network;
import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import StatusCard from '../components/common/StatusCard';
import { AlertCircle, Wifi, WifiOff, Search } from 'lucide-react';
import DeviceTables, { useOnlineDevices } from '../components/Tables/DeviceTables';

const Network = () => {
  const { onlineDevices, updateOnlineDevices } = useOnlineDevices();
  const [devicesScanned, setDevicesScanned] = useState(0); // Track total devices scanned
  const [unknownDevices, setUnknownDevices] = useState(0); // Track unknown devices

  // Update status cards when devices are fetched
  useEffect(() => {
    const storedDevices = localStorage.getItem('devices');
    if (storedDevices) {
      const devices = JSON.parse(storedDevices);
      setDevicesScanned(devices.length); // Total devices scanned
      setUnknownDevices(devices.filter(device => !device.name || device.name === 'Unknown').length); // Unknown devices
    }
  }, [onlineDevices]);

  // Status card data
  const statusData = [
    { title: 'Devices Scanned', value: devicesScanned.toString(), color: 'blue', icon: Search },
    { title: 'Unknown Devices', value: unknownDevices.toString(), color: 'yellow', icon: WifiOff },
    { title: 'Threats Detected', value: '0', color: 'red', icon: AlertCircle }, // Placeholder for now
    { title: 'Online Devices', value: onlineDevices.toString(), color: 'green', icon: Wifi },
  ];

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title="Network" />
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* Status Cards */}
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

        {/* Device Table */}
        <DeviceTables updateOnlineDevices={updateOnlineDevices} />
      </main>
    </div>
  );
};

export default Network;
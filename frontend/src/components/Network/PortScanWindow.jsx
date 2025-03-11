import React, { useEffect, useState } from 'react';

const PortScanWindow = ({ device, onClose }) => {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    if (device?.scanResult) {
      setScanResult(device.scanResult); // Set scan result when it is available
    }
  }, [device]);

  // Function to handle the "Report+" button click
  const handleReport = async () => {
    if (!scanResult || !scanResult.openPorts || scanResult.openPorts.length === 0) {
      alert('No open ports to report.');
      return;
    }

    // Determine severity based on the number of open ports
    let severity;
    if (scanResult.openPorts.length >= 5) {
      severity = 'Critical';
    } else if (scanResult.openPorts.length >= 3) {
      severity = 'High';
    } else if (scanResult.openPorts.length >= 1) {
      severity = 'Medium';
    } else {
      severity = 'Low';
    }

    // Prepare the report data
    const reportData = {
      type: 'Open Port Found',
      severity,
      status: 'Unresolved',
      description: `Open ports detected on device ${device.name} (${device.ip}).`,
      sourceIP: device.ip,
      destinationIP: device.ip,
      ports: scanResult.openPorts.map(port => port.port),
      detectedBy: 'Port Scanner',
      recommendation: 'Investigate and close unnecessary open ports.',
      devicePriority: 'High',
      macAddress: device.mac,
      deviceName: device.name,
    };

    try {
      // Make the API call to create a new security report
      const response = await fetch('http://localhost:3000/api/securityreports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to create security report');
      }

      const data = await response.json();
      console.log('Report created successfully:', data);
      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-gray-900 p-8 rounded-xl shadow-xl w-4/5 max-w-5xl'>
        <h2 className='text-3xl font-bold text-gray-100 mb-6'>Port Scan Results for {device.name}</h2>
        <p className='text-gray-400 mb-2'>IP Address: {device.ip}</p>
        <p className='text-gray-400 mb-6'>MAC Address: {device.mac}</p>

        {/* Report+ Button (Visible only if there are open ports) */}
        {scanResult?.openPorts?.length > 0 && (
          <div className='flex justify-end mb-6'>
            <button
              onClick={handleReport}
              className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200'
            >
              Report+
            </button>
          </div>
        )}

        {scanResult ? (
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-gray-800 text-gray-100 rounded-lg'>
              <thead>
                <tr className='bg-gray-700'>
                  <th className='py-3 px-6 text-left rounded-tl-lg'>
                    <span className='text-lg font-semibold'>Port</span>
                  </th>
                  <th className='py-3 px-6 text-left'>
                    <span className='text-lg font-semibold'>State</span>
                  </th>
                  <th className='py-3 px-6 text-left rounded-tr-lg'>
                    <span className='text-lg font-semibold'>Service</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {scanResult.openPorts.map((port, index) => (
                  <tr key={index} className='hover:bg-gray-700'>
                    <td className='py-3 px-6 border-b border-gray-600'>{port.port}</td>
                    <td className={`py-3 px-6 border-b border-gray-600 ${port.state === 'open' ? 'text-green-400' : port.state === 'closed' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {port.state}
                    </td>
                    <td className='py-3 px-6 border-b border-gray-600'>{port.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-gray-400'>Loading scan results...</p>
        )}

        <div className='flex justify-end mt-6'>
          <button 
            onClick={onClose} 
            className='bg-red-500 hover:bg-red-700 text-white py-2 px-8 rounded-lg transition-all duration-200'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortScanWindow;
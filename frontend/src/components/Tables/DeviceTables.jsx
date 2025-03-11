import React, { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import PortScanWindow from '../Network/PortScanWindow';

export const useOnlineDevices = () => {
  const [onlineDevices, setOnlineDevices] = useState(0);

  // A function to update the online devices count based on fetched data
  const updateOnlineDevices = (devices) => {
    const onlineCount = devices.filter(device => device.ip).length;
    console.log('Updating online devices count:', onlineCount); // Debug log
    setOnlineDevices(onlineCount); // Update online devices count
  };

  return {
    onlineDevices,
    updateOnlineDevices,
  };
};

const DeviceTables = ({ updateOnlineDevices }) => {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [editingDevice, setEditingDevice] = useState(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanningDevice, setScanningDevice] = useState(null);

  useEffect(() => {
    const storedDevices = localStorage.getItem('devices');
    if (storedDevices) {
      const parsedDevices = JSON.parse(storedDevices);
      setDevices(parsedDevices);
      console.log('Loaded devices from localStorage:', parsedDevices); // Debug log
      updateOnlineDevices(parsedDevices); // Update online devices count
    }
  }, [updateOnlineDevices]);

  const handleScan = () => {
    setIsScanning(true);
    fetch('http://localhost:3000/api/devices')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setDevices(data); // Set the devices directly from the backend response
        localStorage.setItem('devices', JSON.stringify(data)); // Save the devices in localStorage
        console.log('Fetched devices from API:', data); // Debug log
        updateOnlineDevices(data); // Update online devices count
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching devices:', error);
        setError('Failed to fetch devices. Please try again later.');
      })
      .finally(() => {
        setIsScanning(false);
      });
  };

  const handleEdit = (device) => {
    setEditingDevice(device);
    setEditName(device.name);  // Initialize device name for editing
    setEditStatus(device.status);  // Initialize status for editing
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const updatedDevice = {
      ...editingDevice,   // Copy the original device's properties
      name: editName,     // Update name
      status: editStatus, // Update status
    };

    // Send the updated device information to the backend
    fetch('http://localhost:3000/api/devices', {
      method: 'POST', // You can use 'PUT' for updates, but here we're using 'POST' to handle both new insertions and updates
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDevice), // Send the device details as JSON
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update or add device');
      }
      return response.json(); // Assuming the server responds with the updated data
    })
    .then(data => {
      // After receiving a successful response, update the local state
      const updatedDevices = devices.map((device) => {
        if (device.ip === updatedDevice.ip) {
          return updatedDevice; // Only update the device with the matching IP
        }
        return device; // Keep the other devices unchanged
      });

      setDevices(updatedDevices); // Update the local state
      localStorage.setItem('devices', JSON.stringify(updatedDevices)); // Store the updated devices in localStorage
      console.log('Updated devices after edit:', updatedDevices); // Debug log
      updateOnlineDevices(updatedDevices); // Update online devices count

      // Reset editing state to close the modal
      setEditingDevice(null);
    })
    .catch(error => {
      console.error('Error updating device:', error);
      setError('Failed to update device. Please try again later.');
    });
  };

  const handleCheckPorts = (device) => {
    console.log('Checking ports for device:', device); // Debug log
    setScanningDevice(device);
  
    // Send POST request to backend with the device's IP
    fetch('http://localhost:3000/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ip: device.ip }),  // Send the IP of the selected device
    })
    .then(response => response.json())
    .then(data => {
      // Pass the scan result to PortScanWindow component
      console.log('Port scan result:', data);
      setScanningDevice({
        ...device,
        scanResult: data,  // Attach scan result to the device
      });
    })
    .catch(error => {
      console.error('Error during port scan:', error);
    });
  };

  const sortedDevices = Array.isArray(devices) ? devices.sort((a, b) => {
    if (a.status === 'High' && b.status === 'Low') return -1;
    if (a.status === 'Low' && b.status === 'High') return 1;
    return 0;
  }) : [];

  return (
    <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-100'>Devices on Network</h2>
        <div className='flex items-center'>
          <div className='relative'>
            <input 
              type="text"
              placeholder='Search Devices'
              className='bg-gray-700 text-gray-100 placeholder-gray-400 px-3 py-1.5 rounded-lg w-60 pl-10 focus:outline-none focus:ring-blue-500'
            />
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          </div>
          <button 
            onClick={handleScan} 
            className={`ml-4 font-bold py-1.5 px-3 rounded flex items-center 
              ${isScanning ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="animate-spin mr-2" />
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2" />
                Scan
              </>
            )}
          </button>
        </div>
      </div>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-gray-700 text-gray-100'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>Device Name</th>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>IP Address</th>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>MAC Address</th>
              <th className='py-2 px-4 border-b border-gray-800 border-r text-center'>Priority</th>
              <th className='py-2 px-4 border-b border-gray-800 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedDevices.map(device => (
              <tr key={device.id}>
                <td className='py-2 px-4 border-b border-gray-600 border-r text-center'>{device.name}</td>
                <td className='py-2 px-4 border-b border-gray-600 border-r text-center'>{device.ip}</td>
                <td className='py-2 px-4 border-b border-gray-600 border-r text-center'>{device.mac}</td>
                <td className='py-2 px-4 border-b border-gray-600 border-r text-center'>{device.status}</td>
                <td className='py-2 px-4 border-b border-gray-600 text-center'>
                  <button 
                    onClick={() => handleEdit(device)} 
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2'
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleCheckPorts(device)} 
                    className='bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2'
                  >
                    Check
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingDevice && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>Edit Device</h2>
            <form onSubmit={handleEditSubmit}>
              <div className='mb-4'>
                <label className='block text-gray-100 mb-2'>Device Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
                />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-100 mb-2'>Status</label>
                <select 
                  value={editStatus} 
                  onChange={(e) => setEditStatus(e.target.value)} 
                  className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
                >
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className='mb-4'>
                <label className='block text-gray-100 mb-2'>IP Address</label>
                <input 
                  type="text" 
                  value={editingDevice.ip} 
                  readOnly
                  className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
                />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-100 mb-2'>MAC Address</label>
                <input 
                  type="text" 
                  value={editingDevice.mac} 
                  readOnly
                  className='bg-gray-700 text-gray-100 px-3 py-2 rounded-lg w-full'
                />
              </div>
              <div className='flex justify-end'>
                <button 
                  type="button" 
                  onClick={() => setEditingDevice(null)} 
                  className='bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded mr-2'
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded'
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {scanningDevice && (
        <PortScanWindow 
          device={scanningDevice} 
          onClose={() => setScanningDevice(null)} 
        />
      )}
    </div>
  );
};

export default DeviceTables;
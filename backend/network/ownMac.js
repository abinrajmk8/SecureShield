import os from 'os';

// Function to get the MAC address corresponding to the own IP address
export const getMacAddressForOwnIp = (ipAddress) => {
  const networkInterfaces = os.networkInterfaces();  // Get all network interfaces
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      // Check if the interface has the same IP address as the device's own IP
      if (iface.family === 'IPv4' && iface.address === ipAddress) {
        return iface.mac;  // Return the MAC address
      }
    }
  }
  return null;  // Return null if no matching MAC address is found
};

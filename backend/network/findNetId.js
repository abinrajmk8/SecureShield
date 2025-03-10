import os from "os";

// Function to get the device's IP address
export function getDeviceIP() {
    const networkInterfaces = os.networkInterfaces();
    let deviceIP = '';

    for (const interfaceName in networkInterfaces) {
        for (const interfaceInfo of networkInterfaces[interfaceName]) {
            // Check for IPv4 addresses (ignore IPv6 or internal addresses)
            if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
                // If it's Wi-Fi or Ethernet, get the correct IP address
                if (interfaceName === 'Wi-Fi' || interfaceName === 'Ethernet') {
                    deviceIP = interfaceInfo.address;
                    return deviceIP;
                }
            }
        }
    }

    return deviceIP; // Return the first valid IP
}

// Function to calculate the Network ID (NetID) based on IP address and subnet mask
export function findNetId(ip, subnetMask) {
    const ipArray = ip.split('.').map(Number);
    const maskArray = subnetMask.split('.').map(Number);

    // Perform bitwise AND between IP address and subnet mask
    const netIdArray = ipArray.map((octet, index) => octet & maskArray[index]);

    // Join the network ID array to form the NetID
    const netId = netIdArray.join('.');

    return netId;
}

// Function to determine the server's network netId (using the imported getDeviceIP and findNetId functions)
export function getServerNetId(){
    const serverIP = getDeviceIP();  // Get the server's current IP address using the imported function
    if (serverIP) {
      const subnetMask = '255.255.255.0';  // Example subnet mask (you can modify this dynamically if needed)
      const serverNetId = findNetId(serverIP, subnetMask);  // Use the imported function to get the netId
  
      // Get the first three octets of the netId (without the last octet)
      const serverNetIdBase = serverNetId.split('.').slice(0, 3).join('.');
  
      console.log(`Server IP: ${serverIP} - netId: ${serverNetIdBase}`);  // Debugging the server's netId
      return serverNetIdBase;  // Return the netId base (first three octets)
    }
    return 'unknown_network';  // Default in case no valid IP is found
  };

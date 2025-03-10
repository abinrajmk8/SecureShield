import ping from 'ping';
import os from 'os';
import { exec } from 'child_process';
import { getServerNetId, getDeviceIP } from '../network/findNetId.js';
import { getMacAddressForOwnIp } from '../network/ownMac.js';

// Function to scan the network
export const scanNetwork = async (netId) => {
  const promises = [];
  for (let i = 1; i <= 254; i++) {
    const ip = `${netId}.${i}`;
    promises.push(ping.promise.probe(ip));
  }
  const results = await Promise.all(promises);
  return results.filter(result => result.alive).map(result => result.host);
};

// Function to get MAC address using arp for a specific IP
export const getMacAddress = (ip) => {
    return new Promise((resolve, reject) => {
      exec('arp -a', (error, stdout) => {
        if (error) return resolve(null); // In case of error, return null
        const lines = stdout.split('\n');
        let mac = null;
  
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          
          // Ensure that we're looking at valid lines
          if (parts.length >= 3 && parts[0] === ip) {
            mac = parts[1] || null;
            break;
          }
        }
  
        // If not found, try a fallback with ping and then ARP again
        if (!mac) {
          exec(`ping -n 1 ${ip}`, (pingErr) => {
            if (!pingErr) {
              exec('arp -a', (retryErr, retryStdout) => {
                if (retryErr) return resolve(null);
                const retryLines = retryStdout.split('\n');
                for (const retryLine of retryLines) {
                  const retryParts = retryLine.trim().split(/\s+/);
                  if (retryParts.length >= 3 && retryParts[0] === ip) {
                    mac = retryParts[1] || null;
                    break;
                  }
                }
                resolve(mac || null);
              });
            } else {
              resolve(null);
            }
          });
        } else {
          resolve(mac);
        }
      });
    });
  };



// Main function
export const main = async () => {
  const serverNetId = getServerNetId();
  const ownIp = getDeviceIP();
  const ownMac = getMacAddressForOwnIp(ownIp);

  if (!serverNetId) {
    console.error('Unable to determine server network ID');
    return;
  }

  const scannedIps = await scanNetwork(serverNetId);
  const devices = [];

  for (const ip of scannedIps) {
    let mac = await getMacAddress(ip);
    if (ip === ownIp) mac = ownMac; // Ensure correct MAC for own device
    devices.push({ ip, mac });
  }

  // console.log('Scanned Devices:', devices);
};

main();

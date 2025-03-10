import express from "express";
import cors from "cors";
import { getServerNetId ,getDeviceIP} from "./network/findNetId.js";  // Importing functions from findIp.js
import { getMacAddressForOwnIp } from './network/ownMac.js';  // Import the function to get MAC address
import {scanNetwork,getMacAddress} from './testings/ping.js';  // Import ping.js

import {exec} from 'child_process'

import connectDB from "./db.js";

import Device from "./models/Device.js";
import SecurityReportRouter from "./HelperRoutes/SecurityReport.js";

const app = express();
const port = 3000;
const JWT_SECRET="myverysecuresecret"
app.use(express.json());

 connectDB();

app.use(cors());

app.use(SecurityReportRouter);

// GET request to fetch devices for the current network
app.get('/api/devices', async (req, res) => {
  const serverNetId = getServerNetId();  // Get the server's current network netId
  const ownIp = getDeviceIP();  // Get the server's IP
  const ownMac = getMacAddressForOwnIp(ownIp);  // Get the MAC for the own device

  if (serverNetId) {
    try {
      const scannedIps = await scanNetwork(serverNetId);  // Call scanNetwork from ping.js
      const devices = [];

      for (const ip of scannedIps) {
        let mac = await getMacAddress(ip);  // Call getMacAddress from ping.js
        if (ip === ownIp) mac = ownMac;  // Ensure correct MAC for own device

        // Fetch device details from DB by IP
        const existingDevice = await Device.findOne({ ip });

        if (existingDevice) {
          // If the device exists in the database, fetch and update its details
          devices.push({
            ip,
            mac,
            name: existingDevice.name,   // Fetch from DB
            status: existingDevice.status,  // Fetch from DB
            netId: existingDevice.netId,  // Include netId
          });
        } else {
          // Device is not found in the DB, set to default values
          devices.push({
            ip,
            mac,
            name: 'Unknown',  // Default name
            status: 'Low',     // Default status
            netId: serverNetId  // Set the netId from the current server's network
          });
        }
      }

      res.json(devices);  // Send the updated list of devices back in the response
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Unable to fetch devices' });
    }
  } else {
    res.status(500).json({ error: 'Unable to determine server network id' });
  }
});




// Update existing device
// Update or Insert (Upsert) Device
app.put('/api/devices/:id', async (req, res) => {
  try {
    let { name, status, ip, mac } = req.body;

    // Extract netId from IP
    let netId = ip.split('.').slice(0, 3).join('.');

    if (!netId) {
      return res.status(400).json({ error: 'netId is required' });
    }

    let existingDevice = await Device.findOne({ ip });

    if (existingDevice) {
      // Update the device details
      existingDevice.name = name || existingDevice.name;
      existingDevice.status = status || existingDevice.status;
      existingDevice.netId = netId || existingDevice.netId;

      await existingDevice.save();
      return res.json(existingDevice);
    } else {
      // Create a new device if not found
      const newDevice = new Device({
        ip,
        mac,
        name,
        status,
        netId
      });
      await newDevice.save();
      return res.json(newDevice);
    }
  } catch (err) {
    console.error('Error updating/inserting device:', err);
    res.status(500).json({ error: 'Unable to update or insert device' });
  }
});



// API Route to Run Nmap Scan
app.post('/scan', (req, res) => {
  const ip = req.body.ip;

  // Validate IP input
  if (!ip) {
    return res.status(400).json({ error: 'IP address is required' });
  }

  // Execute Nmap scan
  exec(`nmap ${ip}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Exec error: ${error.message}`);
      return res.status(500).json({ error: "Nmap execution failed", details: error.message });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }

    // Initialize formatted result
    let formattedResult = "Nmap Scan Result:\n";
    let openPorts = [];

    // Split the output into lines
    const lines = stdout.split("\n");

    // Iterate over each line and try to extract port information
    lines.forEach((line, index) => {
      // Trim any leading/trailing whitespace
      const trimmedLine = line.trim();

      // Debug log to see the actual content of each line after trimming
      console.log(`Line ${index}:`, `'${trimmedLine}'`);

      // Match lines that contain the port info (e.g., "135/tcp   open  msrpc")
      const portLine = trimmedLine.match(/^(\d+)\/tcp\s+(\S+)\s+(\S+)$/);

      // Log the match result (to understand what is getting matched)
      console.log('Regex match result:', portLine);

      // If the regex matches, process and format the port line
      if (portLine) {
        formattedResult += `Port: ${portLine[1]}, State: ${portLine[2]}, Service: ${portLine[3]}\n`;

        // Add extracted values as an object to openPorts array
        openPorts.push({
          port: portLine[1],
          state: portLine[2],
          service: portLine[3]
        });
      }
    });

    // If no port data was found, send a message saying so
    if (formattedResult === "Nmap Scan Result:\n") {
      formattedResult += "No open ports found.\n";
    }

    // Print the formatted result in the console
    console.log(formattedResult);

    // Send the formatted result along with the openPorts array in the response
    res.json({
      ip,
      
      openPorts: openPorts
    });
  });
});










// Function to parse Nmap output
function parseNmapOutput(ip, stdout) {
  const result = {
    ip: ip,
    openPorts: [],
  };

  const lines = stdout.split("\n");
  lines.forEach((line) => {
    // Match lines like "135/tcp   open  msrpc" (handles variable spaces)
    const portLine = line.match(/^(\d+)\/(\w+)\s+(\w+)\s+(.+)$/);

    if (portLine) {
      result.openPorts.push({
        port: parseInt(portLine[1], 10), // Extract port number
        protocol: portLine[2],           // Extract protocol (tcp/udp)
        state: portLine[3],              // Extract state (open/closed/filtered)
        service: portLine[4].trim(),     // Extract service name
      });
    }
  });

  return result;
}










//insrt new 

// Insert new device
// Route to handle device insertion or update
app.post('/api/devices', async (req, res) => {
  const { ip, name, mac, status } = req.body;

  if (!ip) {
    return res.status(400).json({ error: "IP address is required" });
  }
  
  // Ensure netId is extracted properly from the IP
  const netId = ip.split('.').slice(0, 3).join('.');

  if (!netId) {
    return res.status(400).json({ error: 'netId is required' });
  }

  try {
    const existingDevice = await Device.findOne({ ip });
    if (existingDevice) {
      // Update device if it exists
      existingDevice.name = name || existingDevice.name;
      existingDevice.status = status || existingDevice.status;
      existingDevice.netId = netId;  // Ensure netId is set here
      await existingDevice.save();
      return res.status(200).json(existingDevice);
    } else {
      // Insert new device if it doesn't exist
      const newDevice = new Device({
        ip,
        name,
        mac,
        status,
        netId  // Ensure netId is passed here
      });
      await newDevice.save();
      return res.status(201).json(newDevice);
    }
  } catch (err) {
    console.error('Error inserting/updating device:', err);
    return res.status(500).json({ message: 'Error inserting/updating device' });
  }
});





import bcrypt from 'bcrypt'; // For hashing passwords
import jwt from 'jsonwebtoken'; // For generating tokens
import User from './models/User.js'; // Create a User model for the database

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)

    // Create new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});




//const port = 3000; // Hardcoded port number

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});


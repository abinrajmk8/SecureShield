
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {exec} from 'child_process'
import connectDB from "./db.js";
import SecurityReportRouter from "./HelperRoutes/SecurityReport.js";
import authRoutes from "./HelperRoutes/authRoutes.js";
import deviceRoutes from "./HelperRoutes/deviceRoutes.js";
import userRoutes from "./HelperRoutes/userList.js";
import currentUser from "./HelperRoutes/currentUser.js";

dotenv.config();
//console.log(process.env.MONGO_URI);
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
 connectDB();


app.use("/api",authRoutes);
app.use(SecurityReportRouter);
app.use("/api/devices", deviceRoutes);
app.use("/api", userRoutes);
app.use("/api", currentUser);



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



app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});


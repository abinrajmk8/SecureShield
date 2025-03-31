import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import SecurityReportRouter from "./HelperRoutes/SecurityReport.js";
import authRoutes from "./HelperRoutes/authRoutes.js";
import deviceRoutes from "./HelperRoutes/deviceRoutes.js";
import userRoutes from "./HelperRoutes/userList.js";
import currentUser from "./HelperRoutes/currentUser.js";
import updateUser from "./HelperRoutes/updateUser.js";
import deleteUser from "./HelperRoutes/deleteUser.js";
import portscanRouter from "./HelperRoutes/portScan.js";
import sendMail from "./HelperRoutes/sendMail.js";
import settingsRoutes from "./HelperRoutes/settings.js";
import generateAnalysis from "./HelperRoutes/generateAnalysis.js";
import UserPhoto from "./HelperRoutes/userPhoto.js";
import { spawn } from "child_process";
import Settings from "./models/SettingsModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

connectDB();

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", currentUser);
app.use("/api", updateUser);
app.use("/api", deleteUser);
app.use("/api", UserPhoto);
app.use(SecurityReportRouter);
app.use("/api/devices", deviceRoutes);
app.use(portscanRouter);
app.use("/api/settings", settingsRoutes);
app.use("/api", sendMail);
app.use("/api/generate-analysis", generateAnalysis);

let detectorProcess = null;

const startDetector = () => {
  if (!detectorProcess) {
    detectorProcess = spawn("python", ["./python_programs/arpSpoofDetector2.py"]);
    
    detectorProcess.stdout.on("data", (data) => {
      console.log(`[Detector Output]: ${data}`);
    });

    detectorProcess.stderr.on("data", (data) => {
      const message = data.toString();
      if (!message.includes("Invalid argument") && 
          !message.includes("os.write") && 
          !message.includes("stop_cb") && 
          !message.includes("sniffer.stop") && 
          !message.includes("Thread-") && 
          !message.includes("self._target") && 
          !message.includes("scapy")) {
        console.error(`[Detector Error]: ${message}`);
      }
    });

    detectorProcess.on("close", (code) => {
      const exitStatus = code === null ? "terminated" : `exited with code ${code}`;
      // console.log(`ARP Spoof Detector ${exitStatus}`);
      detectorProcess = null;
    });

    console.log("✅ ARP Spoof Detector started");
  }
};

const stopDetector = () => {
  if (detectorProcess) {
    detectorProcess.kill('SIGTERM');
    detectorProcess = null;
    console.log("❌ ARP Spoof Detector stopped");
  }
};

const initializeAndManageDetector = async () => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ arpspoofedetector: false });
    }

    if (settings.arpspoofedetector && !detectorProcess) {
      startDetector();
    } else if (!settings.arpspoofedetector && detectorProcess) {
      stopDetector();
    }
  } catch (error) {
    console.error("Error managing detector settings:", error);
  }
};

initializeAndManageDetector();

Settings.watch().on("change", (change) => {
  if (change.operationType === "update") {
    const updatedFields = change.updateDescription.updatedFields;
    if ("arpspoofedetector" in updatedFields) {
      initializeAndManageDetector();
    }
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
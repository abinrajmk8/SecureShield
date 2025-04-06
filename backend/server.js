// server.js
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
import sendMailRoute from "./HelperRoutes/sendMail.js";
import sendMail from "./utils/sendMail.js"; 
import settingsRoutes from "./HelperRoutes/settings.js";
import generateAnalysis from "./HelperRoutes/generateAnalysis.js";
import { spawn } from "child_process";
import Settings from "./models/SettingsModel.js";
import User from "./models/User.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"; 
import bcrypt from "bcryptjs"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Optional: Enable preflight for all routes
app.options("*", cors());


connectDB();

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", currentUser);
app.use("/api", updateUser);
app.use("/api", deleteUser);
app.use(SecurityReportRouter);
app.use("/api/devices", deviceRoutes);
app.use(portscanRouter);
app.use("/api/settings", settingsRoutes);
app.use("/api", sendMailRoute);
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
      console.log(`ARP Spoof Detector ${exitStatus}`);
      detectorProcess = null;
    });

    console.log(" ARP Spoof Detector started");
  }
};

const stopDetector = () => {
  if (detectorProcess) {
    detectorProcess.kill('SIGTERM');
    detectorProcess = null;
    console.log(" ARP Spoof Detector stopped");
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

// Function to send email notifications using the utility function
const sendAttackNotifications = async (report) => {
  try {
    const users = await User.find({ notificationsEnabled: true });
    if (!users.length) {
      console.log("No users with notifications enabled");
      return;
    }

    const subject = "Security Alert: ARP Spoofing Detected";
    const text = `Dear ${report.detectedBy} User,\n\nAn ARP spoofing attack was detected in your network!\n\nDetails:\n- Source IP: ${report.sourceIP}\n- Expected MAC: ${report.macAddress}\n- Spoofed MAC: ${report.description.split("Spoofed MAC: ")[1]}\n- Timestamp: ${report.timestamp}\n\nRecommendation: ${report.recommendation}\n\nPlease investigate immediately.\n\nRegards,\nSecureShield Team`;

    for (const user of users) {
      try {
        await sendMail(user.username, subject, text); // Use the utility function directly
        console.log(`Email sent to ${user.username}`);
      } catch (error) {
        console.error(`Failed to send email to ${user.username}:`, error);
      }
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

// Define SecurityReport model for change stream
const securityReportSchema = new mongoose.Schema({
  timestamp: Date,
  type: String,
  sourceIP: String,
  macAddress: String,
  description: String,
  detectedBy: String,
  recommendation: String,
  // Other fields as needed
});
const SecurityReport = mongoose.models.securityreports || mongoose.model("securityreports", securityReportSchema);

initializeAndManageDetector();

Settings.watch().on("change", (change) => {
  if (change.operationType === "update") {
    const updatedFields = change.updateDescription.updatedFields;
    if ("arpspoofedetector" in updatedFields) {
      initializeAndManageDetector();
    }
  }
});

// Watch for new security reports
SecurityReport.watch().on("change", (change) => {
  if (change.operationType === "insert") {
    const report = change.fullDocument;
    if (report.type === "ARP Spoofing") {
      sendAttackNotifications(report);
    }
  }
});
// Forgot Password Route
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("Forgot password request received:", { email }); // Add logging

  try {
    const user = await User.findOne({ username: email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    
    console.log("Sending reset link:", resetLink); // Log before sending
    await sendMail(
      email,
      "Password Reset Request",
      `Click this link to reset your password: ${resetLink}\nThis link will expire in 1 hour.`
    );
    console.log("Reset email sent successfully to:", email); // Log after sending

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error("Forgot password error:", error); // Detailed error logging
    res.status(500).json({ message: "Server error" });
  }
});
// Reset Password Route
app.post("/api/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  console.log("Reset password request received:", { token, newPassword }); // Add logging

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    console.log("Token decoded:", decoded); // Log decoded token

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log("User not found for ID:", decoded.userId);
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("Password reset successfully for user:", user.username);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error); // Detailed error logging
    res.status(400).json({ message: "Invalid or expired token" });
  }
});



app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(express.json({ limit: "10mb" }));  // Increase the payload size limit
app.use(express.urlencoded({ limit: "10mb", extended: true }));  // Allow larger URL encoded data
app.use(cors());  // Enable CORS for all origins

connectDB();

// User operation routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", currentUser);
app.use("/api", updateUser);
app.use("/api", deleteUser);
app.use("/api", UserPhoto);

// Network operations
app.use(SecurityReportRouter);
app.use("/api/devices", deviceRoutes);
app.use(portscanRouter);
app.use("/api/settings", settingsRoutes);

// Send mail
app.use("/api", sendMail);

// AI analysis
app.use("/api/generate-analysis", generateAnalysis);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

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
import UserPhoto from "./HelperRoutes/userPhoto.js";
import { spawn } from "child_process";
import Settings from "./models/SettingsModel.js";
import User from "./models/User.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"; // Add this import
import bcrypt from "bcrypt"; // Add this import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
  origin: "http://localhost:5173", // Allow only your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  credentials: true, // If you plan to use cookies/auth headers later
}));

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
app.use("/api", sendMailRoute);
app.use("/api/generate-analysis", generateAnalysis);

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

// ... rest of your existing server.js code ...

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
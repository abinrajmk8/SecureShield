import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import SecurityReportRouter from "./HelperRoutes/SecurityReport.js";
import authRoutes from "./HelperRoutes/authRoutes.js";
import deviceRoutes from "./HelperRoutes/deviceRoutes.js";
import userRoutes from "./HelperRoutes/userList.js";
import currentUser from "./HelperRoutes/currentUser.js";
import testRoute from "./HelperRoutes/testRoute.js";
import updateUser from "./HelperRoutes/updateUser.js";
import deleteUser from "./HelperRoutes/deleteUser.js";
import portscanRouter from "./HelperRoutes/portScan.js";
import sendMail from "./HelperRoutes/sendMail.js";
import settingsRoutes from "./HelperRoutes/settings.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
connectDB();

app.use("/test",testRoute);

//user operation routes
app.use("/api",authRoutes);
app.use("/api", userRoutes);
app.use("/api", currentUser);
app.use("/api",updateUser);
app.use("/api",deleteUser);

// network operations
app.use(SecurityReportRouter);
app.use("/api/devices", deviceRoutes);
app.use(portscanRouter);
app.use("/api/settings", settingsRoutes);

//send mail 
app.use("/api",sendMail);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});


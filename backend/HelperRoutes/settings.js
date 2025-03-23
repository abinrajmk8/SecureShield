import express from "express";
import Settings from "../models/settingsModel.js";

const router = express.Router();

// Get ARP Spoof Detector Value
router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      return res.json({ arpspoofedetector: false }); // Default value if not set
    }
    res.json({ arpspoofedetector: settings.arpspoofedetector });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update ARP Spoof Detector Value (true/false)
router.put("/update", async (req, res) => {
  try {
    const { arpspoofedetector } = req.body;
    if (typeof arpspoofedetector !== "boolean") {
      return res.status(400).json({ message: "Invalid value. Must be true or false." });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    settings.arpspoofedetector = arpspoofedetector;
    await settings.save();

    res.json({ message: "ARP Spoof Detector updated successfully", settings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;

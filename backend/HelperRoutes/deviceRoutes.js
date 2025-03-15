import express from "express";
import Device from "../models/Device.js";
import { getServerNetId, getDeviceIP } from "../network/findNetId.js";
import { getMacAddressForOwnIp } from "../network/ownMac.js";
import { scanNetwork, getMacAddress } from "../testings/ping.js";

const router = express.Router();

// GET request to fetch devices for the current network
router.get("/", async (req, res) => {
  const serverNetId = getServerNetId();
  const ownIp = getDeviceIP();
  const ownMac = getMacAddressForOwnIp(ownIp);

  if (serverNetId) {
    try {
      const scannedIps = await scanNetwork(serverNetId);
      const devices = [];

      for (const ip of scannedIps) {
        let mac = await getMacAddress(ip);
        if (ip === ownIp) mac = ownMac;

        const existingDevice = await Device.findOne({ ip });

        devices.push(existingDevice
          ? { ip, mac, name: existingDevice.name, status: existingDevice.status, netId: existingDevice.netId }
          : { ip, mac, name: "Unknown", status: "Low", netId: serverNetId });
      }
      res.json(devices);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Unable to fetch devices" });
    }
  } else {
    res.status(500).json({ error: "Unable to determine server network id" });
  }
});

// PUT request to update a device
router.put("/:id", async (req, res) => {
  try {
    let { name, status, ip, mac } = req.body;
    let netId = ip.split(".").slice(0, 3).join(".");
    if (!netId) return res.status(400).json({ error: "netId is required" });

    let existingDevice = await Device.findOne({ ip });
    if (existingDevice) {
      existingDevice.name = name || existingDevice.name;
      existingDevice.status = status || existingDevice.status;
      existingDevice.netId = netId;
      await existingDevice.save();
      return res.json(existingDevice);
    } else {
      const newDevice = new Device({ ip, mac, name, status, netId });
      await newDevice.save();
      return res.json(newDevice);
    }
  } catch (err) {
    console.error("Error updating/inserting device:", err);
    res.status(500).json({ error: "Unable to update or insert device" });
  }
});

// POST request to add a new device
router.post("/", async (req, res) => {
  const { ip, name, mac, status } = req.body;
  if (!ip) return res.status(400).json({ error: "IP address is required" });

  const netId = ip.split(".").slice(0, 3).join(".");
  if (!netId) return res.status(400).json({ error: "netId is required" });

  try {
    const existingDevice = await Device.findOne({ ip });
    if (existingDevice) {
      existingDevice.name = name || existingDevice.name;
      existingDevice.status = status || existingDevice.status;
      existingDevice.netId = netId;
      await existingDevice.save();
      return res.status(200).json(existingDevice);
    } else {
      const newDevice = new Device({ ip, name, mac, status, netId });
      await newDevice.save();
      return res.status(201).json(newDevice);
    }
  } catch (err) {
    console.error("Error inserting/updating device:", err);
    return res.status(500).json({ message: "Error inserting/updating device" });
  }
});



export default router;

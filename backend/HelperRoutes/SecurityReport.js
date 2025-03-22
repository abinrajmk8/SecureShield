// backend/HelperRoutes/SecurityReport.js

import express from 'express';
import SecurityReport from '../models/SecurityReports.js'; 
const router = express.Router();

// GET request to fetch a specific SecurityReport by ID
router.get('/api/securityreports/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const report = await SecurityReport.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Security report not found' });
    }
    res.json(report);
  } catch (err) {
    console.error('Error fetching security report:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST request to create a new SecurityReport
router.post('/api/securityreports', async (req, res) => {
    // Log the request body for debugging
    console.log('Received POST request data:', req.body);
  
    const {
      type,
      severity,
      status,
      description,
      sourceIP,
      destinationIP,
      ports,
      detectedBy,
      recommendation,
      devicePriority,
      macAddress,
      deviceName,
    } = req.body;
  
    // Basic validation to check if required fields are present
    if (!type || !severity || !status || !description || !sourceIP || !detectedBy) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const newReport = new SecurityReport({
        type,
        severity,
        status,
        description,
        sourceIP,
        destinationIP,
        ports,
        detectedBy,
        recommendation,
        devicePriority,
        macAddress,
        deviceName,
      });
  
      await newReport.save();
      res.status(201).json(newReport);
    } catch (err) {
      console.error('Error creating new security report:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// PUT request to update the entire SecurityReport
router.put('/api/securityreports/:id', async (req, res) => {
  const { id } = req.params;
  const {
    type,
    severity,
    status,
    description,
    sourceIP,
    destinationIP,
    ports,
    detectedBy,
    recommendation,
    devicePriority,
    macAddress,
    deviceName,
  } = req.body;

  try {
    let report = await SecurityReport.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Security report not found' });
    }

    // Update the report with the provided data
    report.type = type || report.type;
    report.severity = severity || report.severity;
    report.status = status || report.status;
    report.description = description || report.description;
    report.sourceIP = sourceIP || report.sourceIP;
    report.destinationIP = destinationIP || report.destinationIP;
    report.ports = ports || report.ports;
    report.detectedBy = detectedBy || report.detectedBy;
    report.recommendation = recommendation || report.recommendation;
    report.devicePriority = devicePriority || report.devicePriority;
    report.macAddress = macAddress || report.macAddress;
    report.deviceName = deviceName || report.deviceName;

    await report.save();
    res.json(report);
  } catch (err) {
    console.error('Error updating security report:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH request to partially update the SecurityReport
router.patch('/api/securityreports/:id', async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    let report = await SecurityReport.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Security report not found' });
    }

    // Update only the provided fields
    Object.keys(updateFields).forEach((field) => {
      if (report[field] !== undefined) {
        report[field] = updateFields[field];
      }
    });

    await report.save();
    res.json(report);
  } catch (err) {
    console.error('Error partially updating security report:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/api/securityreports', async (req, res) => {
  try {
    const reports = await SecurityReport.find();
    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk insert multiple security reports
router.post('/api/securityreports/bulk', async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: "Invalid input: Expected an array of reports." });
    }

    const newReports = await SecurityReport.insertMany(req.body);
    res.status(201).json({ message: "Reports inserted successfully", reports: newReports });
  } catch (err) {
    console.error('Error inserting multiple security reports:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;

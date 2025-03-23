import mongoose from 'mongoose';

const SecurityReportSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  type: { type: String, required: true }, // e.g., "ARP Spoofing", "Open Port Found", unknown devices , suspicious traffic, unknown admin flagged
  severity: { type: String, required: true, enum: ["Critical", "High", "Medium", "Low"] },
  status: { type: String, required: true, enum: ["Unresolved", "Pending", "Investigating", "Resolved"] },
  description: { type: String, required: true }, // Detailed explanation
  sourceIP: { type: String, required: true }, // Origin IP
  destinationIP: { type: String }, // Target IP (if applicable)
  ports: { type: [Number], default: [] }, // Array of open ports (only for Open Port Found type)
  detectedBy: { type: String, required: true }, // Detection method (e.g., "ARP Detector")
  recommendation: { type: String }, // Suggested fixes
  devicePriority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" }, // Priority level
  macAddress: { type: String, default: "" }, // Optional
  deviceName: { type: String, default: "" }, // Optional
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
  strict: true // Prevent any extra fields that are not defined
});

// Create the model
const SecurityReport = mongoose.model("SecurityReport", SecurityReportSchema);

export default SecurityReport;

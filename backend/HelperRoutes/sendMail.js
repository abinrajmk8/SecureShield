import express from "express";
import sendMail from "../utils/sendMail.js"; 

const router = express.Router();

router.post("/sendMail", async (req, res) => {
  const { email, message, report } = req.body;

  if (!email || !report) {
    return res.status(400).json({ error: "Email and report data are required." });
  }

  const reportText = `
    📌 **Security Report**
    --------------------------------
    🔹 **Type:** ${report.type}
    🔹 **Severity:** ${report.severity}
    🔹 **Status:** ${report.status}
    🔹 **Timestamp:** ${report.timestamp}
    🔹 **Description:** ${report.description}
    🔹 **Detected By:** ${report.detectedBy}
    🔹 **Recommendation:** ${report.recommendation}
    🔹 **Device Priority:** ${report.devicePriority}
    🔹 **MAC Address:** ${report.macAddress}
    🔹 **Device Name:** ${report.deviceName}
    🔹 **Ports Affected:** ${report.ports.join(", ")}
  `;

  try {
    await sendMail(email, "Security Report Alert", `${message}\n\n${reportText}`);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

export default router;

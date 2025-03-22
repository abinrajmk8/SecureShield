import React, { useState } from "react";
import { Download, Mail } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

const ReportView = ({ report, onClose }) => {
  const [showMailForm, setShowMailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Function to handle download as PDF
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Report Details", 14, 20);

    const reportData = [
      ["Type", report.type],
      ["Severity", report.severity],
      ["Status", report.status],
      ["Timestamp", new Date(report.timestamp).toLocaleString()],
      ["Description", report.description],
      ["Detected By", report.detectedBy],
      ["Recommendation", report.recommendation],
      ["Device Priority", report.devicePriority],
      ["MAC Address", report.macAddress || "N/A"],
      ["Device Name", report.deviceName || "N/A"],
      ["Open Ports", report.ports?.join(", ") || "N/A"],
    ];

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: reportData,
      styles: { fontSize: 10, cellPadding: 3 },
      theme: "grid",
    });

    doc.save("report.pdf");
  };

  // Function to handle send mail
  const handleSendMail = async () => {
    if (!email || !message) {
      alert("Please enter both email and message.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          message,
          report,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Email sent successfully!");
        setShowMailForm(false);
      } else {
        alert("Failed to send email: " + result.error);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email.");
    }
  };

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-4/5 max-w-5xl">


        <h2 className="text-3xl font-bold text-gray-100 mb-6">Report Details</h2>

        {/* Report Details */}
        <div className="space-y-4 text-gray-300">
          <p><strong>Type:</strong> {report.type}</p>
          <p>
            <strong>Severity:</strong>
            <span className={
              report.severity === "Critical" ? "text-red-500" :
              report.severity === "High" ? "text-orange-500" :
              report.severity === "Medium" ? "text-yellow-500" :
              "text-green-500"
            }>
              {report.severity}
            </span>
          </p>
          <p>
            <strong>Status:</strong>
            <span className={
              report.status === "Resolved" ? "text-green-500" :
              report.status === "Unresolved" ? "text-red-500" :
              report.status === "Pending" ? "text-yellow-500" :
              "text-blue-500"
            }>
              {report.status}
            </span>
          </p>
          <p><strong>Timestamp:</strong> {new Date(report.timestamp).toLocaleString()}</p>
          <p><strong>Description:</strong> {report.description}</p>
          <p><strong>Detected By:</strong> {report.detectedBy}</p>
          <p><strong>Recommendation:</strong> {report.recommendation}</p>
          <p><strong>Device Priority:</strong> {report.devicePriority}</p>
          <p><strong>MAC Address:</strong> {report.macAddress || "N/A"}</p>
          <p><strong>Device Name:</strong> {report.deviceName || "N/A"}</p>
          <p><strong>Open Ports:</strong> {report.ports?.join(", ") || "N/A"}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={handleDownload}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Download className="mr-2" size={16} /> Download PDF
          </button>
          <button
            onClick={() => setShowMailForm(!showMailForm)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Mail className="mr-2" size={16} /> {showMailForm ? "Cancel" : "Send Mail"}
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>

        {/* Mail Form (Visible when Send Mail is clicked) */}
        {showMailForm && (
          <div className="mt-6 p-4 border rounded-md bg-gray-800">
            <h3 className="text-xl font-bold text-gray-200 mb-4">Send Report via Email</h3>
            <label className="block text-gray-300 mb-2">
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md bg-gray-700 text-white"
                placeholder="Enter recipient's email"
              />
            </label>

            <label className="block text-gray-300 mb-2">
              Message:
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded-md bg-gray-700 text-white"
                placeholder="Enter your message"
              ></textarea>
            </label>

            <button
              onClick={handleSendMail}
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-2"
            >
              Send Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportView;
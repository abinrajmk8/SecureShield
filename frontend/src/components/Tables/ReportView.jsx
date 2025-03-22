import React,{useRef} from 'react';
import { Download, Mail } from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from 'jspdf-autotable';


const ReportView = ({ report, onClose }) => {

  
  // Function to handle download as PDF
  const handleDownload = () => {
    const doc = new jsPDF(); // Create a new PDF document
  
    // Add Report Title
    doc.setFontSize(18);
    doc.text("Report Details", 14, 20);
  
    // Prepare Report Data as an Array
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
  
    // Call autoTable correctly
    autoTable(doc, {
      startY: 30, // Position the table below the title
      head: [["Field", "Value"]], // Table header
      body: reportData, // Table content
      styles: { fontSize: 10, cellPadding: 3 }, // Adjust font size & padding
      theme: "grid", // Makes table more readable
    });
  
    // Save the PDF
    doc.save("report.pdf");
  };
  
  


  // Function to handle send mail
  const handleSendMail = () => {
    alert('Send mail functionality will be implemented here.');
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-gray-900 p-8 rounded-xl shadow-xl w-4/5 max-w-5xl'>
        <h2 className='text-3xl font-bold text-gray-100 mb-6'>Report Details</h2>

        {/* Report Details */}
        <div className='space-y-4 text-gray-300'>
          <p><strong>Type:</strong> {report.type}</p>
          <p>
            <strong>Severity:</strong>
            <span className={
              report.severity === 'Critical' ? 'text-red-500' :
              report.severity === 'High' ? 'text-orange-500' :
              report.severity === 'Medium' ? 'text-yellow-500' :
              'text-green-500'
            }>{report.severity}</span>
          </p>
          <p>
            <strong>Status:</strong>
            <span className={
              report.status === 'Resolved' ? 'text-green-500' :
              report.status === 'Unresolved' ? 'text-red-500' :
              report.status === 'Pending' ? 'text-yellow-500' :
              'text-blue-500'
            }>{report.status}</span>
          </p>
          <p><strong>Timestamp:</strong> {new Date(report.timestamp).toLocaleString()}</p>
          <p><strong>Description:</strong> {report.description}</p>
          <p><strong>Detected By:</strong> {report.detectedBy}</p>
          <p><strong>Recommendation:</strong> {report.recommendation}</p>
          <p><strong>Device Priority:</strong> {report.devicePriority}</p>
          <p><strong>MAC Address:</strong> {report.macAddress || 'N/A'}</p>
          <p><strong>Device Name:</strong> {report.deviceName || 'N/A'}</p>
          <p><strong>Open Ports:</strong> {report.ports?.join(', ') || 'N/A'}</p>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end mt-6 space-x-4'>
          <button
            onClick={handleDownload}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center'
          >
            <Download className='mr-2' size={16} /> Download PDF
          </button>
          <button
            onClick={handleSendMail}
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center'
          >
            <Mail className='mr-2' size={16} /> Send Mail
          </button>
          <button
            onClick={onClose}
            className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
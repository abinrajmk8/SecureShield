import React, { useState, useRef } from "react";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Ai = ({ isOpen, onClose, reports }) => {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const reportRef = useRef(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setAnalysis("");

    try {
      const response = await fetch("http://localhost:3000/api/generate-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reports }),
      });

      if (!response.ok) throw new Error("Failed to fetch analysis");

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      setAnalysis("Error generating report. Please try again.");
      console.error("AI Analysis Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!analysis) {
      alert("No analysis available to download.");
      return;
    }
  
    const pdf = new jsPDF("p", "mm", "a4");
    
    pdf.setFillColor(255, 255, 255); // White background
    pdf.rect(0, 0, 210, 297, "F"); // Fill the whole page
  
    pdf.setFont("helvetica");
  
    let yPosition = 20; // Starting position
    const lineHeight = 7;
    const marginLeft = 10;
    const maxWidth = 190;
  
    const lines = analysis.split("\n").filter((line) => line.trim() !== "");
  
    lines.forEach((line, index) => {
      if (index === 0) {
        // First line (real heading) in red
        pdf.setFontSize(18);
        pdf.setTextColor(255, 0, 0);
        pdf.setFont("helvetica", "bold");
        pdf.text(line.trim(), marginLeft, yPosition);
        yPosition += lineHeight + 5;
      } else if (line.startsWith("## ")) {
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "bold");
        pdf.text(line.replace("## ", ""), marginLeft, yPosition);
        yPosition += lineHeight + 2;
      } else if (line.startsWith("### ")) {
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "bold");
        pdf.text(line.replace("### ", ""), marginLeft, yPosition);
        yPosition += lineHeight + 2;
      } else if (line.startsWith("**Recommendation:**")) {
        pdf.setFontSize(12);
        pdf.setTextColor(0, 102, 204);
        pdf.setFont("helvetica", "bold");
        pdf.text("🔹 Recommendation: " + line.replace("**Recommendation:**", "").trim(), marginLeft, yPosition);
        yPosition += lineHeight;
      } else {
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
  
        let wrappedLines = pdf.splitTextToSize(line.trim(), maxWidth);
        wrappedLines.forEach((wrappedLine) => {
          pdf.text(wrappedLine, marginLeft, yPosition);
          yPosition += lineHeight;
        });
      }
  
      if (yPosition > 280) {
        pdf.addPage();
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, 210, 297, "F");
        yPosition = 10;
      }
    });
  
    // Add Current Date at Bottom
    const currentDate = new Date().toLocaleDateString();
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Generated on: ${currentDate}`, 150, 290);
  
    pdf.save("AI_Analysis_Report.pdf");
  };
  
  
  
  

  const renderAnalysisAsHTML = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    return lines.map((line, index) => {
      if (line.startsWith("## ")) {
        return <h1 key={index} style={{ color: "white", fontWeight: "bold", fontSize: "24px", marginTop: "20px" }}>{line.replace("## ", "").trim()}</h1>;
      }
      if (line.startsWith("### ")) {
        return <h2 key={index} style={{ color: "red", fontWeight: "bold", fontSize: "20px", marginTop: "15px" }}>{line.replace("### ", "").trim()}</h2>;
      }
      if (line.startsWith("**Recommendation:**")) {
        return <p key={index} style={{ color: "#32CD32", fontWeight: "bold", marginTop: "5px", fontSize: "18px" }}>{line.replace("**Recommendation:**", "🔹 Recommendation:").trim()}</p>;
      }
      if (/\*\*(.*?)\*\*/.test(line)) {
        return <p key={index} style={{ color: "#D3D3D3", fontWeight: "bold", fontSize: "17px", marginTop: "5px" }}>{line.replace(/\*\*/g, "").trim()}</p>;
      }
      return <p key={index} style={{ marginTop: "5px", color: "#CCCCCC", fontSize: "16px" }}>{line.trim()}</p>;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-4/5 max-w-5xl relative">
        <button className="absolute top-4 right-4 text-gray-300 hover:text-gray-500" onClick={onClose}>✖</button>
        <h2 className="text-4xl font-bold text-gray-100 mb-6">AI Analysis</h2>

        <div ref={reportRef} className="overflow-auto max-h-[60vh] text-gray-300 border p-4 rounded bg-gray-800">
          {loading ? <p>Generating report...</p> : analysis ? <div>{renderAnalysisAsHTML(analysis)}</div> : <p>Click 'Generate Report' to analyze data.</p>}
        </div>

        <div className="flex justify-between mt-6 space-x-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center" onClick={handleGenerateReport} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center" onClick={handleDownloadPDF} disabled={!analysis}>
            <Download className="mr-2" size={16} /> Download PDF
          </button>
          <button onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default Ai;

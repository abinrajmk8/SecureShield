import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import AnalysisReport from "../models/AnalysisReports.js";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/generate-analysis
router.post("/", async (req, res) => {
  try {
    const { reports } = req.body;
    if (!reports || reports.length === 0) {
      return res.status(400).json({ error: "No reports provided for analysis." });
    }

    // Format reports for AI input
    const inputText = reports
      .map(
        (r, i) =>
          `Report ${i + 1}: Attack Type - ${r.type}, Severity - ${r.severity}, Status - ${r.status}`
      )
      .join("\n");

    // Call Gemini AI for analysis
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Analyze the following network security reports and provide a structured summary with recommendations in Markdown format. Use headings and bullet points for clarity. Do not include tables:\n\n${inputText}`;

    const result = await model.generateContent(prompt);
    let analysisText = result.response.text(); // Get the AI-generated Markdown text

    // Ensure the response is valid
    if (!analysisText) {
      throw new Error("Gemini API returned an empty response.");
    }

    // Advanced Cleanup and Formatting
    analysisText = analysisText
      .replace(/\\n/g, "\n") // Replace escaped newlines with actual newlines
      .replace(/```markdown|```/g, "") // Remove Markdown code block markers
      .replace(/\*\*markdown\*\*/g, "") // Remove bold "markdown" text
      .replace(/\|.*\|\n/g, "") // Remove any remaining tables
      .replace(/(\n\s*){2,}/g, "\n\n") // Replace multiple newlines with a single newline
      .replace(/#+\s*/g, (match) => `\n${match}`) // Ensure headings start on a new line
      .replace(/\*\*(.*?)\*\*/g, "**$1**") // Ensure consistent bold formatting
      .replace(/-\s+/g, "- ") // Ensure consistent bullet points
      .trim(); // Remove leading/trailing whitespace

    // Store analysis in database (save raw Markdown)
    const newAnalysis = new AnalysisReport({
      reports,
      analysis: analysisText, // Save cleaned Markdown
    });

    await newAnalysis.save();
    console.log("Analysis saved to database:", newAnalysis);

    // Send cleaned Markdown to frontend
    res.status(200).json({ analysis: analysisText, message: "Analysis saved successfully!" });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate analysis." });
  }
});

export default router;
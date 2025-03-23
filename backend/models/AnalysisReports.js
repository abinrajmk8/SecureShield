import mongoose from "mongoose";

const AnalysisReportSchema = new mongoose.Schema({
  reports: [
    {
      attackType: String,
      severity: String,
      status: String,
    },
  ],
  analysis: String, // AI-generated analysis
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AnalysisReport", AnalysisReportSchema);

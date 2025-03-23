import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  arpspoofedetector: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Settings = mongoose.model("settings", settingsSchema);

export default Settings;

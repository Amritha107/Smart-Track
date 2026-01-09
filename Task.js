const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["to-do", "completed", "submitted"],
    default: "to-do"
  }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
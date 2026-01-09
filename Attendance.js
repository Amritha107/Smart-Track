const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  percentage: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  try {
    // Role check
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        message: "Only teachers can mark attendance"
      });
    }

    const { studentId, percentage } = req.body;

    if (!studentId || percentage === undefined) {
      return res.status(400).json({
        message: "studentId and percentage are required"
      });
    }

    const record = await Attendance.findOneAndUpdate(
      { student: studentId },              // 🔑 MUST match schema
      { student: studentId, percentage },  // 🔑 MUST match schema
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Attendance updated successfully",
      record
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const record = await Attendance.findOne({ student: req.user.id });

    res.status(200).json({
      record
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
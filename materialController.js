const Material = require("../models/Materials");

// ===============================
// ADD MATERIAL (ONLY TEACHER)
// ===============================
exports.addMaterial = async (req, res) => {
  try {
    const { title, description, subject } = req.body;

    // 🔐 ROLE CHECK (MOST IMPORTANT)
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        message: "Access denied. Only teachers can upload materials"
      });
    }

    // Basic validation
    if (!title) {
      return res.status(400).json({
        message: "Title is required"
      });
    }

    const newMaterial = new Material({
      title,
      description,
      subject,
      uploadedBy: req.user.id,     // from JWT middleware
      uploaderRole: req.user.role  // will be "teacher" only
    });

    await newMaterial.save();

    res.status(201).json({
      message: "Material uploaded successfully",
      material: newMaterial
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// ===============================
// GET ALL MATERIALS (STUDENT + TEACHER)
// ===============================
exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find()
      .populate("uploadedBy", "username email role");

    res.status(200).json({
      message: "Materials fetched successfully",
      materials
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
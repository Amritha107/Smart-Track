const express = require("express");
const router = express.Router();

const {
  addMaterial,
  getMaterials
} = require("../controllers/materialController");

const authMiddleware = require("../middleware/authMiddleware");

// Add material (only logged-in users)
router.post("/", authMiddleware, addMaterial);

// Get all materials (only logged-in users)
router.get("/", authMiddleware, getMaterials);

module.exports = router;
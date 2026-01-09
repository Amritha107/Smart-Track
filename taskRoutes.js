const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  submitTask
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

// Teacher creates task
router.post("/", authMiddleware, createTask);

// Get all tasks
router.get("/", authMiddleware, getTasks);

// Student submits task
router.post("/:taskId/submit", authMiddleware, submitTask);

module.exports = router;
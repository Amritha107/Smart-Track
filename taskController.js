const Task = require("../models/Task");

// CREATE TASK (Teacher)
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      createdBy: req.user.id
    });

    await task.save();

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET TASKS (Student/Teacher)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SUBMIT TASK (Student)
exports.submitTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.submissions.push({
      student: req.user.id,
      submittedAt: new Date()
    });

    task.status = "Submitted";
    await task.save();

    res.status(200).json({ message: "Task submitted successfully" });
  } catch (error) {
    console.error("Submit Task Error:", error);
    res.status(500).json({ error: error.message });
  }
};
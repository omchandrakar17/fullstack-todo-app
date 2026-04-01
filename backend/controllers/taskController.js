const Task = require("../models/Task");

const getAllTasks = async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};
    
    if (filter === "pending") {
      query.completed = false;
    } else if (filter === "completed") {
      query.completed = true;
    }
    
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error: could not retrieve tasks." });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title is required." });
    }
    const task = await Task.create({ title, description });
    res.status(201).json(task);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server error: could not create task." });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID format." });
    }
    res.status(500).json({ success: false, message: "Server error: could not update task." });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }
    res.status(200).json({ success: true, message: "Task deleted successfully.", id });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID format." });
    }
    res.status(500).json({ success: false, message: "Server error: could not delete task." });
  }
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
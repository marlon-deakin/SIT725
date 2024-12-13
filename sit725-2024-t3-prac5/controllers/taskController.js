const TaskModel = require("../models/TaskModel");

const createTask = async (req, res) => {
  try {
    const task = await TaskModel.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Error creating task" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.getAllTasks();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
};

// Similarly, define `getTaskById`, `updateTask`, `deleteTask`
module.exports = { createTask, getAllTasks };

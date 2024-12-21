const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
});

const Task = mongoose.model("Task", taskSchema);

const createTask = async (taskData) => {
  const task = new Task(taskData);
  return task.save();
};

const getAllTasks = async () => {
  return Task.find({});
};

module.exports = { createTask, getAllTasks };

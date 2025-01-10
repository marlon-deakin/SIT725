const TaskModel = require('../models/TaskModel');

// Controller to create a task
const createTask = async (req, res) => {
    try {
        const task = new TaskModel.Task(req.body);
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ error: 'Error saving task' });
    }
};

// Controller to fetch all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Database connection error' });
    }
};

module.exports = { createTask, getAllTasks };
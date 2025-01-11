const TaskModel = require('../models/TaskModel');

// Controller to create a task
const createTask = async (req, res) => {
    try {
        const { postedBy, description, hours, status } = req.body;

        // Basic validation
        if (!postedBy || !description || typeof hours !== 'number') {
            return res.status(400).json({
                errors: {
                    postedBy: postedBy ? undefined : { message: 'PostedBy is required' },
                    description: description ? undefined : { message: 'Description is required' },
                    hours: typeof hours === 'number' ? undefined : { message: 'Invalid data type for hours' },
                },
            });
        }

        const task = new TaskModel.Task(req.body);
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ errors: error.errors });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
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
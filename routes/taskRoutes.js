const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/taskController");

router.post("/tasks", TaskController.createTask);
router.get("/tasks", TaskController.getAllTasks);
// Similarly, add routes for `getTaskById`, `updateTask`, `deleteTask`

module.exports = router;

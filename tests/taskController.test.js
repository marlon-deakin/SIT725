const taskController = require("../controllers/taskController");
const TaskModel = require("../models/TaskModel");

jest.mock("../models/TaskModel");

describe("Task Controller Tests", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        title: "Test Task",
        description: "Test Description",
        status: "Pending",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("createTask should create and save a task", async () => {
    TaskModel.createTask.mockResolvedValue(req.body);

    await taskController.createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  test("createTask should handle errors", async () => {
    TaskModel.createTask.mockRejectedValue(new Error("Error creating task"));

    await taskController.createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error creating task" });
  });

  test("getAllTasks should retrieve all tasks", async () => {
    const tasks = [req.body];
    TaskModel.getAllTasks.mockResolvedValue(tasks);

    await taskController.getAllTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tasks);
  });

  test("getAllTasks should handle errors", async () => {
    TaskModel.getAllTasks.mockRejectedValue(new Error("Error fetching tasks"));

    await taskController.getAllTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error fetching tasks" });
  });
});
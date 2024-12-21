const { createTask, getAllTasks } = require("../controllers/taskController");
const mongoose = require("mongoose");

// Mocking Mongoose
jest.mock("mongoose", () => {
  const saveMock = jest.fn();
  const findMock = jest.fn();

  // Mocked Model
  const mockModel = function () {
    return { save: saveMock }; // Instance-level `save` method
  };
  mockModel.find = findMock; // Static-level `find` method

  return {
    model: jest.fn(() => mockModel),
    Schema: jest.fn(),
    __saveMock: saveMock, // Explicitly expose mocks for testing
    __findMock: findMock,
  };
});

describe("Task Controller Tests", () => {
  const mockTaskData = { title: "Test Task", description: "Test Desc", status: "Pending" };

  let saveMock, findMock;

  beforeAll(() => {
    // Access Mongoose mocks
    saveMock = mongoose.__saveMock;
    findMock = mongoose.__findMock;
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test("createTask should create and save a task", async () => {
    saveMock.mockResolvedValue(mockTaskData); // Mock save resolution

    const result = await createTask({ body: mockTaskData }); // Call controller

    // Assertions
    expect(saveMock).toHaveBeenCalled();
    expect(result).toEqual(mockTaskData);
  });

  test("getAllTasks should retrieve all tasks", async () => {
    const mockTasks = [
      { title: "Task 1", description: "Desc 1", status: "Done" },
      { title: "Task 2", description: "Desc 2", status: "Pending" },
    ];
    findMock.mockResolvedValue(mockTasks); // Mock find resolution

    const result = await getAllTasks(); // Call controller

    // Assertions
    expect(findMock).toHaveBeenCalledWith({});
    expect(result).toEqual(mockTasks);
  });
});

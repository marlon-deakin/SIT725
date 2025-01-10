const { createTask, getAllTasks } = require('../controllers/taskController');
const TaskModel = require('../models/TaskModel');

// Mock the TaskModel
jest.mock('../models/TaskModel', () => {
    const originalModule = jest.requireActual('../models/TaskModel');
    return {
        ...originalModule,
        Task: function (taskData) {
            this.save = jest.fn().mockResolvedValue(taskData);
        },
        find: jest.fn(),
    };
});

describe('Task Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a task successfully', async () => {
        const mockSave = jest.fn().mockResolvedValue({
            _id: 'mockedTaskId',
            postedBy: 'user123',
            description: 'Complete SIT725 task',
            hours: 3,
            status: 'open',
        });

        TaskModel.Task.prototype.save = mockSave;

        const req = {
            body: {
                postedBy: 'user123',
                description: 'Complete SIT725 task',
                hours: 3,
                status: 'open',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createTask(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            description: 'Complete SIT725 task',
        }));
    });

    test('should retrieve all tasks successfully', async () => {
        const mockFind = jest.fn().mockResolvedValue([
            {
                _id: 'mockedTaskId1',
                postedBy: 'user123',
                description: 'Task 1',
                hours: 5,
                status: 'open',
            },
            {
                _id: 'mockedTaskId2',
                postedBy: 'user456',
                description: 'Task 2',
                hours: 2,
                status: 'closed',
            },
        ]);

        TaskModel.find = mockFind;

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllTasks(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            expect.objectContaining({ description: 'Task 1' }),
            expect.objectContaining({ description: 'Task 2' }),
        ]);
    });

    test('should fail when required fields are missing', async () => {
        const mockSave = jest.fn().mockRejectedValue({
            name: 'ValidationError',
            errors: {
                postedBy: { message: 'PostedBy is required' },
                description: { message: 'Description is required' },
            },
        });

        TaskModel.Task.prototype.save = mockSave;

        const req = { body: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createTask(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.objectContaining({
                postedBy: expect.any(Object),
                description: expect.any(Object),
            }),
        }));
    });

    test('should handle database connection failure', async () => {
        const mockFind = jest.fn().mockRejectedValue(new Error('Database connection error'));

        TaskModel.find = mockFind;

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllTasks(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Database connection error',
        });
    });

    test('should handle invalid data type for hours', async () => {
        const mockSave = jest.fn().mockRejectedValue({
            name: 'ValidationError',
            errors: {
                hours: { message: 'Invalid data type for hours' },
            },
        });

        TaskModel.Task.prototype.save = mockSave;

        const req = {
            body: {
                postedBy: 'user123',
                description: 'Invalid hours test',
                hours: 'three', // Invalid data type
                status: 'open',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createTask(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.objectContaining({
                hours: expect.any(Object),
            }),
        }));
    });
});
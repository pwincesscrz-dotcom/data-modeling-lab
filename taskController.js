// controllers/taskController.js - Task CRUD Operations
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, tags, userId } = req.body;
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const task = new Task({
            title,
            description,
            priority,
            dueDate,
            tags,
            userId
        });
        
        await task.save();
        
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating task',
            error: error.message
        });
    }
};

// @desc    Get all tasks (with populated user data)
// @route   GET /api/tasks
// @access  Public
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tasks',
            error: error.message
        });
    }
};

// @desc    Get task by ID (with populated user)
// @route   GET /api/tasks/:id
// @access  Public
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('userId', 'name email profile');
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching task',
            error: error.message
        });
    }
};

// @desc    Get tasks by user (populated)
// @route   GET /api/tasks/user/:userId
// @access  Public
const getTasksByUser = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.params.userId })
            .populate('userId', 'name email')
            .sort({ priority: -1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user tasks',
            error: error.message
        });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
    try {
        const updates = req.body;
        const options = { new: true, runValidators: true };
        
        const task = await Task.findByIdAndUpdate(req.params.id, updates, options);
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating task',
            error: error.message
        });
    }
};

// @desc    Mark task as completed
// @route   PATCH /api/tasks/:id/complete
// @access  Public
const completeTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        
        await task.markAsCompleted();
        
        res.status(200).json({
            success: true,
            message: 'Task marked as completed',
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error completing task',
            error: error.message
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting task',
            error: error.message
        });
    }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats/:userId
// @access  Public
const getTaskStats = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments({ userId: req.params.userId });
        const completedTasks = await Task.countDocuments({ 
            userId: req.params.userId, 
            completed: true 
        });
        const pendingTasks = totalTasks - completedTasks;
        
        const priorityBreakdown = await Task.aggregate([
            { $match: { userId: req.params.userId } },
            { $group: {
                _id: '$priority',
                count: { $sum: 1 }
            } }
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                totalTasks,
                completedTasks,
                pendingTasks,
                completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0,
                priorityBreakdown
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching stats',
            error: error.message
        });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    getTasksByUser,
    updateTask,
    completeTask,
    deleteTask,
    getTaskStats
};
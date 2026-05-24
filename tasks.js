// routes/tasks.js - Task Routes
const express = require('express');
const router = express.Router();
const {
    createTask,
    getAllTasks,
    getTaskById,
    getTasksByUser,
    updateTask,
    completeTask,
    deleteTask,
    getTaskStats
} = require('../controllers/taskController');

// Task CRUD Routes
router.post('/', createTask);                   // POST /api/tasks - Create task
router.get('/', getAllTasks);                  // GET /api/tasks - Get all tasks (populated)
router.get('/:id', getTaskById);               // GET /api/tasks/:id - Get task by ID
router.put('/:id', updateTask);                // PUT /api/tasks/:id - Update task
router.delete('/:id', deleteTask);             // DELETE /api/tasks/:id - Delete task

// Task by user
router.get('/user/:userId', getTasksByUser);   // GET /api/tasks/user/:userId

// Task completion
router.patch('/:id/complete', completeTask);   // PATCH /api/tasks/:id/complete

// Task statistics
router.get('/stats/:userId', getTaskStats);    // GET /api/tasks/stats/:userId

module.exports = router;
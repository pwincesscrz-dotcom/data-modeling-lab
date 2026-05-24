// routes/users.js - User Routes
const express = require('express');
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserWithTasks
} = require('../controllers/userController');

// User CRUD Routes
router.post('/', createUser);                    // POST /api/users - Create user
router.get('/', getAllUsers);                   // GET /api/users - Get all users
router.get('/:id', getUserById);                // GET /api/users/:id - Get user by ID
router.put('/:id', updateUser);                 // PUT /api/users/:id - Update user
router.delete('/:id', deleteUser);              // DELETE /api/users/:id - Delete user

// Get user with their tasks (populated)
router.get('/:id/tasks', getUserWithTasks);     // GET /api/users/:id/tasks

module.exports = router;
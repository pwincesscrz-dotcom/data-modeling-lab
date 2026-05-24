// server.js - Main Express Server
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'MongoDB Data Modeling Lab API',
        version: '1.0.0',
        endpoints: {
            users: {
                'POST /api/users': 'Create user',
                'GET /api/users': 'Get all users',
                'GET /api/users/:id': 'Get user by ID',
                'PUT /api/users/:id': 'Update user',
                'DELETE /api/users/:id': 'Delete user',
                'GET /api/users/:id/tasks': 'Get user with their tasks'
            },
            tasks: {
                'POST /api/tasks': 'Create task',
                'GET /api/tasks': 'Get all tasks (populated)',
                'GET /api/tasks/:id': 'Get task by ID',
                'PUT /api/tasks/:id': 'Update task',
                'DELETE /api/tasks/:id': 'Delete task',
                'GET /api/tasks/user/:userId': 'Get tasks by user',
                'PATCH /api/tasks/:id/complete': 'Mark task complete',
                'GET /api/tasks/stats/:userId': 'Get task statistics'
            }
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📦 Database: MongoDB (data_modeling_db)`);
    console.log(`\n📌 Available API Endpoints:`);
    console.log(`\n   USERS:`);
    console.log(`   POST   http://localhost:${PORT}/api/users`);
    console.log(`   GET    http://localhost:${PORT}/api/users`);
    console.log(`   GET    http://localhost:${PORT}/api/users/:id`);
    console.log(`   PUT    http://localhost:${PORT}/api/users/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/users/:id`);
    console.log(`   GET    http://localhost:${PORT}/api/users/:id/tasks`);
    console.log(`\n   TASKS:`);
    console.log(`   POST   http://localhost:${PORT}/api/tasks`);
    console.log(`   GET    http://localhost:${PORT}/api/tasks`);
    console.log(`   GET    http://localhost:${PORT}/api/tasks/:id`);
    console.log(`   PUT    http://localhost:${PORT}/api/tasks/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/tasks/:id`);
    console.log(`   GET    http://localhost:${PORT}/api/tasks/user/:userId`);
    console.log(`   PATCH  http://localhost:${PORT}/api/tasks/:id/complete`);
    console.log(`   GET    http://localhost:${PORT}/api/tasks/stats/:userId`);
    console.log(`\n========================================\n`);
});
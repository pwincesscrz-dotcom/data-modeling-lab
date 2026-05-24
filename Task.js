// models/Task.js - Task Schema with Reference to User
const mongoose = require('mongoose');

// Step 3.2: Create Task Schema with reference to User
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    // Reference to User model (Relationship)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    dueDate: {
        type: Date,
        default: null
    },
    tags: [{
        type: String,
        trim: true
    }],
    attachments: [{
        filename: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for better query performance
taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ priority: 1, dueDate: 1 });

// Virtual field to check if task is overdue
taskSchema.virtual('isOverdue').get(function() {
    if (!this.dueDate) return false;
    return this.dueDate < new Date() && !this.completed;
});

// Virtual field for task summary
taskSchema.virtual('summary').get(function() {
    return `${this.title} - ${this.completed ? '✅ Completed' : '⏳ Pending'}`;
});

// Instance method
taskSchema.methods.markAsCompleted = async function() {
    this.completed = true;
    return await this.save();
};

// Static method to get tasks by user
taskSchema.statics.findByUser = function(userId) {
    return this.find({ userId: userId }).populate('userId', 'name email');
};

// Static method to get statistics
taskSchema.statics.getStats = async function(userId) {
    const stats = await this.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        { $group: {
            _id: '$completed',
            count: { $sum: 1 },
            averagePriority: { $avg: { $cond: [
                { $eq: ['$priority', 'urgent'] }, 4,
                { $cond: [{ $eq: ['$priority', 'high'] }, 3,
                { $cond: [{ $eq: ['$priority', 'medium'] }, 2, 1] }]
            } ] } }
        } }
    ]);
    return stats;
};

// Pre-save middleware
taskSchema.pre('save', function(next) {
    if (this.title) {
        this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
    }
    next();
});

module.exports = mongoose.model('Task', taskSchema);
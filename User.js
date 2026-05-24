// models/User.js - User Schema Definition
const mongoose = require('mongoose');

// Step 3.1: Create User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ]
    },
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [150, 'Age cannot exceed 150']
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    profile: {
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters']
        },
        avatar: {
            type: String,
            default: 'default-avatar.png'
        },
        phone: {
            type: String,
            match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field to get full user info
userSchema.virtual('userInfo').get(function() {
    return `${this.name} (${this.email}) - Role: ${this.role}`;
});

// Instance method
userSchema.methods.getActiveStatus = function() {
    return this.isActive ? 'Active User' : 'Inactive User';
};

// Static method
userSchema.statics.findByRole = function(role) {
    return this.find({ role: role });
};

// Pre-save middleware
userSchema.pre('save', function(next) {
    this.lastLogin = new Date();
    next();
});

// Create and export User model
module.exports = mongoose.model('User', userSchema);
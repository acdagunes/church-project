const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userMemberSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'blocked'],
        default: 'pending'
    },
    role: {
        type: String,
        enum: ['member', 'rector'],
        default: 'member'
    },
    isAtChurch: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userMemberSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('UserMember', userMemberSchema);

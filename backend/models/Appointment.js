const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserMember',
        required: true
    },
    type: {
        type: String,
        enum: ['confession', 'baptism', 'liturgy', 'wedding', 'burial', 'other'],
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);

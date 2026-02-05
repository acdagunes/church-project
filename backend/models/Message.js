const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserMember',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserMember',
        default: null // null means communal chat
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['communal', 'private'],
        default: 'communal'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);

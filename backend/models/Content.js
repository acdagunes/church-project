const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);

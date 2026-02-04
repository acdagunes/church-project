const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    titleEn: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    contentEn: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['about', 'history', 'contact', 'hero', 'other'],
        default: 'other'
    },
    metadata: {
        type: Map,
        of: String,
        default: {}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);

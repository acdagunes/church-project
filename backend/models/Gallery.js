const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    titleEn: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    descriptionEn: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['construction', 'ceremony', 'interior', 'exterior', 'other'],
        default: 'construction'
    },
    date: {
        type: Date,
        default: Date.now
    },
    order: {
        type: Number,
        default: 0
    },
    isVisible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Gallery', gallerySchema);

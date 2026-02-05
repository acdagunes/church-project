const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Content = require('../models/Content');
const { authMiddleware } = require('../middleware/auth');

// Get all content (public)
router.get('/', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json([]);
        }

        const { type, key } = req.query;
        let query = {};

        if (type) {
            query.type = type;
        }

        if (key) {
            query.key = key;
        }

        const content = await Content.find(query);
        res.json(content);
    } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single content by key (public)
router.get('/:key', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(404).json({ message: 'Content not found (DB disconnected)' });
        }
        const content = await Content.findOne({ key: req.params.key });

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        res.json(content);
    } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create or update content (protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { key, value } = req.body;

        let contentItem = await Content.findOne({ key });

        if (contentItem) {
            contentItem.value = value;
            await contentItem.save();
        } else {
            contentItem = new Content({ key, value });
            await contentItem.save();
        }

        res.json(contentItem);
    } catch (error) {
        console.error('Create/Update content error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete content (protected)
router.delete('/:key', authMiddleware, async (req, res) => {
    try {
        const content = await Content.findOneAndDelete({ key: req.params.key });

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        res.json({ message: 'Content deleted successfully' });
    } catch (error) {
        console.error('Delete content error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

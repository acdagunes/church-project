const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Gallery = require('../models/Gallery');
const { authMiddleware } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Get all gallery items (public)
router.get('/', async (req, res) => {
    try {
        const { category, limit } = req.query;
        let query = { isVisible: true };

        if (category) {
            query.category = category;
        }

        const items = await Gallery.find(query)
            .sort({ order: 1, date: -1 })
            .limit(limit ? parseInt(limit) : 0);

        res.json(items);
    } catch (error) {
        console.error('Get gallery error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single gallery item (public)
router.get('/:id', async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }

        res.json(item);
    } catch (error) {
        console.error('Get gallery item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create gallery item (protected)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { title, titleEn, description, descriptionEn, category, order } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const galleryItem = new Gallery({
            title,
            titleEn,
            description,
            descriptionEn,
            category,
            order: order || 0,
            imageUrl: `/uploads/${req.file.filename}`
        });

        await galleryItem.save();
        res.status(201).json(galleryItem);
    } catch (error) {
        console.error('Create gallery error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update gallery item (protected)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { title, titleEn, description, descriptionEn, category, order, isVisible } = req.body;

        const updateData = {
            title,
            titleEn,
            description,
            descriptionEn,
            category,
            order,
            isVisible
        };

        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const item = await Gallery.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }

        res.json(item);
    } catch (error) {
        console.error('Update gallery error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete gallery item (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const item = await Gallery.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }

        res.json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
        console.error('Delete gallery error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

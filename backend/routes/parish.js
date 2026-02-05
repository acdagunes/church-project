const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserMember = require('../models/UserMember');
const Message = require('../models/Message');
const Appointment = require('../models/Appointment');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const parish = require('../routes/parish');

// Register a new member
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, fullName, phoneNumber } = req.body;

        const existingUser = await UserMember.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const member = new UserMember({
            username,
            email,
            password,
            fullName,
            phoneNumber,
            status: 'pending' // Always pending by default
        });

        await member.save();
        res.status(201).json({ message: 'Registration successful. Waiting for admin approval.' });
    } catch (error) {
        console.error('REGISTRATION ERROR:', error);
        res.status(500).json({
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// Member Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt for:', username);

        const member = await UserMember.findOne({ username });
        if (!member) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (member.status !== 'approved' && member.role !== 'rector') {
            return res.status(403).json({ message: 'Account is pending approval or blocked' });
        }

        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: member._id, username: member.username, role: member.role, type: 'member' },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            member: {
                id: member._id,
                username: member.username,
                fullName: member.fullName,
                role: member.role,
                isAtChurch: member.isAtChurch
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ADMIN: Get pending members
router.get('/members/pending', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const pending = await UserMember.find({ status: 'pending' }).select('-password');
        res.json(pending);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching pending members' });
    }
});

// ADMIN: Approve/Block member
router.put('/members/status/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const member = await UserMember.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating member status' });
    }
});

// PRESENCE: Toggle priest status (Rector only)
router.put('/presence/toggle', authMiddleware, async (req, res) => {
    try {
        // Find if this user is a rector
        const member = await UserMember.findById(req.user.id);
        if (!member || member.role !== 'rector') {
            return res.status(403).json({ message: 'Only rector can update presence' });
        }

        member.isAtChurch = !member.isAtChurch;
        await member.save();
        res.json({ isAtChurch: member.isAtChurch });
    } catch (error) {
        res.status(500).json({ message: 'Server error toggling presence' });
    }
});

// PRESENCE: Get priest status
router.get('/presence/status', async (req, res) => {
    try {
        const rector = await UserMember.findOne({ role: 'rector' });
        res.json({ isAtChurch: rector ? rector.isAtChurch : false });
    } catch (error) {
        res.status(500).json({ message: 'Server error getting status' });
    }
});

// CHAT: Get communal messages
router.get('/chat/communal', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find({ type: 'communal' })
            .populate('sender', 'fullName role')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(messages.reverse());
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching chat' });
    }
});

// CHAT: Send message
router.post('/chat/send', authMiddleware, async (req, res) => {
    try {
        const { content, recipientId, type } = req.body;

        const message = new Message({
            sender: req.user.id,
            recipient: recipientId || null,
            content,
            type: type || 'communal'
        });

        await message.save();
        const populatedMessage = await Message.findById(message._id).populate('sender', 'fullName role');
        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: 'Server error sending message' });
    }
});

// Service durations in milliseconds
const SERVICE_DURATIONS = {
    confession: 25 * 60 * 1000,
    baptism: 50 * 60 * 1000,
    wedding: 90 * 60 * 1000,
    burial: 60 * 60 * 1000,
    liturgy: 120 * 60 * 1000,
    other: 60 * 60 * 1000
};

// ADMIN: Get all members
router.get('/members/all', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const members = await UserMember.find({}).select('-password').sort({ createdAt: -1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching members' });
    }
});

// ADMIN: Get all appointments
router.get('/appointments/all', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('member', 'fullName phoneNumber email username')
            .sort({ dateTime: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching all appointments' });
    }
});

// APPOINTMENTS: Book service
router.post('/appointments', authMiddleware, async (req, res) => {
    try {
        const { type, dateTime, notes } = req.body;
        const start = new Date(dateTime);

        if (isNaN(start.getTime())) {
            return res.status(400).json({ message: 'Invalid date/time provided' });
        }

        const duration = SERVICE_DURATIONS[type] || SERVICE_DURATIONS.other;
        const end = new Date(start.getTime() + duration);

        // Standard overlap check: Get all active appointments for that day
        const dayStart = new Date(start);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(start);
        dayEnd.setHours(23, 59, 59, 999);

        const dailyAppointments = await Appointment.find({
            dateTime: { $gte: dayStart, $lte: dayEnd },
            status: { $in: ['pending', 'confirmed'] }
        });

        // Check for overlaps in JS for precision and to avoid complex DB queries
        const hasOverlap = dailyAppointments.some(app => {
            const appStart = new Date(app.dateTime).getTime();
            const appDuration = SERVICE_DURATIONS[app.type] || SERVICE_DURATIONS.other;
            const appEnd = appStart + appDuration;

            const newStart = start.getTime();
            const newEnd = end.getTime();

            // Interval intersection logic: (StartA < EndB) and (EndA > StartB)
            return (newStart < appEnd && newEnd > appStart);
        });

        if (hasOverlap) {
            return res.status(400).json({ message: 'This time slot overlaps with an existing appointment' });
        }

        const appointment = new Appointment({
            member: req.user.id,
            type,
            dateTime,
            notes
        });

        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Server error booking appointment' });
    }
});

// APPOINTMENTS: Get busy slots for a date
router.get('/appointments/busy/:date', async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            dateTime: { $gte: dayStart, $lte: dayEnd },
            status: { $in: ['pending', 'confirmed'] }
        }).select('dateTime type');

        const busySlots = appointments.map(app => ({
            start: app.dateTime,
            end: new Date(new Date(app.dateTime).getTime() + (SERVICE_DURATIONS[app.type] || SERVICE_DURATIONS.other)),
            type: app.type
        }));

        res.json(busySlots);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching busy slots' });
    }
});

// APPOINTMENTS: Get my bookings
router.get('/appointments/me', authMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find({ member: req.user.id }).sort({ dateTime: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching appointments' });
    }
});

// ADMIN: Update appointment status (confirm/cancel)
router.put('/appointments/status/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('member', 'fullName email');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating appointment' });
    }
});

// ADMIN: Update appointment details (reschedule)
router.put('/appointments/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { dateTime, type, notes } = req.body;
        const updateData = {};
        if (dateTime) updateData.dateTime = dateTime;
        if (type) updateData.type = type;
        if (notes !== undefined) updateData.notes = notes;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('member', 'fullName email');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error rescheduling appointment' });
    }
});

// ADMIN: Update member info
router.put('/members/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { fullName, email, phoneNumber, status } = req.body;
        const updateData = { fullName, email, phoneNumber, status };

        const member = await UserMember.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.json(member);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating member' });
    }
});

// ADMIN: Reset member password
router.put('/members/:id/password', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const member = await UserMember.findByIdAndUpdate(
            req.params.id,
            { password: hashedPassword },
            { new: true }
        );

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error resetting password' });
    }
});

// ADMIN: Delete member
router.delete('/members/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const member = await UserMember.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Also delete their appointments
        await Appointment.deleteMany({ member: req.params.id });

        res.json({ message: 'Member and their appointments deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting member' });
    }
});

module.exports = router;

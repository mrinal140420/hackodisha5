// Report routes 
// routes/reports.js
const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth'); // Middleware to verify JWT

// Create Report
router.post('/', auth, async (req, res) => {
    const { description, category, imageUrl, location } = req.body;
    const report = new Report({
        description,
        category,
        imageUrl,
        location,
        citizen: req.user.id,
    });
    await report.save();
    res.status(201).json(report);
});

// Get All Reports
router.get('/', auth, async (req, res) => {
    const reports = await Report.find().populate('citizen', 'name email');
    res.json(reports);
});

// Update Status (Authority Only)
router.patch('/:id/status', auth, async (req, res) => {
    if (req.user.role !== 'authority') return res.status(403).json({ message: 'Forbidden' });
    const { status, assignedTo } = req.body;
    const report = await Report.findByIdAndUpdate(req.params.id, { status, assignedTo }, { new: true });
    res.json(report);
});

module.exports = router;

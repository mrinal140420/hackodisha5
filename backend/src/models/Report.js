// Report schema 
// models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    description: { type: String, required: true },
    category: { type: String, enum: ['Pothole', 'Garbage', 'Streetlight', 'Other'], required: true },
    imageUrl: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    status: { type: String, enum: ['New', 'In Progress', 'Resolved'], default: 'New' },
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Geospatial Index
reportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Report', reportSchema);

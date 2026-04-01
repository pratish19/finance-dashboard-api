const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0 // Prevents negative entries; expenses should just be marked as 'expense'
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This creates a relationship linking the record to the user who made it
        required: true
    },
    isDeleted: { type: Boolean, default: false }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Record', recordSchema);
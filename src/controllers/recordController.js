const Record = require('../models/Record');

// @desc    Create a new financial record
// @route   POST /api/records
exports.createRecord = async (req, res) => {
    try {
        const { amount, type, category, date, notes } = req.body;

        const record = await Record.create({
            amount,
            type,
            category,
            date,
            notes,
            createdBy: req.user._id // Attached by our auth middleware
        });

        res.status(201).json({ message: 'Record created successfully', record });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create record', details: error.message });
    }
};

// @desc    Update a financial record
// @route   PUT /api/records/:id
exports.updateRecord = async (req, res) => {
    try {
        // Find the record by ID and update it. 
        // { new: true } returns the updated document.
        // { runValidators: true } ensures they don't update an amount to a negative number.
        const record = await Record.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.status(200).json({ message: 'Record updated successfully', record });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update record', details: error.message });
    }
};  

// @desc    Get all records (with advanced filtering)
// @route   GET /api/records
exports.getRecords = async (req, res) => {
    try {
        const query = {isDeleted: false}; // Start with a base query to exclude deleted records

        // 1. Filter by Type (e.g., ?type=expense)
        if (req.query.type) query.type = req.query.type;

        // 2. Filter by Category (e.g., ?category=Salary)
        if (req.query.category) query.category = req.query.category;

        // 3. Filter by Date Range (e.g., ?startDate=2024-01-01&endDate=2024-03-31)
        if (req.query.startDate || req.query.endDate) {
            query.date = {};
            if (req.query.startDate) {
                query.date.$gte = new Date(req.query.startDate); // Greater than or equal to startDate
            }
            if (req.query.endDate) {
                query.date.$lte = new Date(req.query.endDate);   // Less than or equal to endDate
            }
        }

        // --- PAGINATION LOGIC ---
        // Default to page 1, 10 records per page if not specified
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Fetch records with skip and limit applied
        const records = await Record.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for the frontend to calculate total pages
        const total = await Record.countDocuments(query);

        res.status(200).json({ 
            count: records.length, 
            pagination: {
                totalRecords: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit)
            },
            records 
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch records', details: error.message });
    }
};

// @desc    Delete a record
// @route   DELETE /api/records/:id
exports.deleteRecord = async (req, res) => {
    try {
      const record = await Record.findByIdAndUpdate(req.params.id, { isDeleted: true });
        if (!record) return res.status(404).json({ error: 'Record not found' });

        res.status(200).json({ message: 'Record soft-deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete record', details: error.message });
    }
};
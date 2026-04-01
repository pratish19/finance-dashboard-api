const Record = require('../models/Record');

// @desc    Get dashboard summary metrics (Totals, Categories, Trends, Recent)
// @route   GET /api/dashboard/summary
exports.getSummary = async (req, res) => {
    try {
        // Run all database queries in parallel for maximum performance
        const [totals, categoryTotals, recentActivity, monthlyTrends] = await Promise.all([
            
            // 1. Calculate Total Income and Total Expenses
            Record.aggregate([
                { $match: { isDeleted: false } },
                {
                    $group: {
                        _id: "$type",
                        totalAmount: { $sum: "$amount" }
                    }
                }
            ]),

            // 2. Calculate totals per category
            Record.aggregate([
                { $match: { isDeleted: false } },
                {
                    $group: {
                        _id: { type: "$type", category: "$category" },
                        totalAmount: { $sum: "$amount" }
                    }
                },
                { $sort: { totalAmount: -1 } }
            ]),

            // 3. Get Recent Activity (Last 5 records)
            Record.find({ isDeleted: false })
                .sort({ date: -1 })
                .limit(5)
                .populate('createdBy', 'name'), // Optional: shows who made the record

            // 4. Calculate Monthly Trends (Income vs Expense per month)
            Record.aggregate([
                { $match: { isDeleted: false } },
                {
                    $group: {
                        // Group by Year, Month, and Type
                        _id: {
                            year: { $year: "$date" },
                            month: { $month: "$date" },
                            type: "$type"
                        },
                        totalAmount: { $sum: "$amount" }
                    }
                },
                // Sort chronologically
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ])
        ]);

        // Format the overall totals nicely
        let income = 0;
        let expense = 0;

        totals.forEach(item => {
            if (item._id === 'income') income = item.totalAmount;
            if (item._id === 'expense') expense = item.totalAmount;
        });

        // Send the ultimate dashboard payload
        res.status(200).json({
            summary: {
                totalIncome: income,
                totalExpense: expense,
                netBalance: income - expense
            },
            recentActivity,      // Ticks the "Recent activity" box
            categoryBreakdown: categoryTotals,
            monthlyTrends        // Ticks the "Monthly or weekly trends" box
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to generate dashboard summary', details: error.message });
    }
};
const { check, validationResult } = require('express-validator');

// Helper function to catch validation errors
const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Rules for User Registration
exports.validateRegister = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('role', 'Invalid role').optional().isIn(['viewer', 'analyst', 'admin']),
    runValidation
];

// Rules for Creating a Record
exports.validateRecord = [
    check('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
    check('type', 'Type must be either income or expense').isIn(['income', 'expense']),
    check('category', 'Category is required').not().isEmpty(),
    check('date', 'Please provide a valid date').optional().isISO8601(),
    runValidation
];
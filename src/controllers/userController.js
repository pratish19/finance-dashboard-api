const User = require('../models/User');

// @desc    Get all users (Admin only)
// @route   GET /api/users
exports.getUsers = async (req, res) => {
    try {
        // Fetch all users but exclude their passwords from the response!
        const users = await User.find().select('-password');
        res.status(200).json({ count: users.length, users });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
};

// @desc    Update a user's role (Admin only)
// @route   PUT /api/users/:id/role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        // Ensure the Admin isn't making up fake roles
        if (!['viewer', 'analyst', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be viewer, analyst, or admin.' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user role', details: error.message });
    }
};

// @desc    Update user status (Activate/Deactivate)
// @route   PUT /api/users/:id/status
exports.updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        // Ensure the input is strictly a boolean
        if (typeof isActive !== 'boolean') {
             return res.status(400).json({ error: 'isActive must be true or false.' });
        }

        // Prevent an Admin from accidentally deactivating themselves
        if (req.user.id === req.params.id && isActive === false) {
            return res.status(400).json({ error: 'You cannot deactivate your own admin account.' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const statusMessage = isActive ? 'activated' : 'deactivated';
        res.status(200).json({ message: `User account has been ${statusMessage}.`, user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user status', details: error.message });
    }
};
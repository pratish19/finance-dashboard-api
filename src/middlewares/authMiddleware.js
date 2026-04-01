const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user in the database (excluding their password) and attach to req object
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user || !req.user.isActive) {
                return res.status(401).json({ error: 'Not authorized, user deactivated or deleted.' });
            }

            next(); // Move on to the next middleware or route controller
        } catch (error) {
            return res.status(401).json({ error: 'Not authorized, token failed.' });
        }
    } else {
        return res.status(401).json({ error: 'Not authorized, no token provided.' });
    }
};

module.exports = { protect };
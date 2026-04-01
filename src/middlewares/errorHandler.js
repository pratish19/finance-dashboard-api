const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error for the developer

    // Check for Mongoose bad ObjectId
    if (err.name === 'CastError') {
        return res.status(404).json({ error: 'Resource not found' });
    }

    // Check for Mongoose duplicate key (e.g., registering the same email twice)
    if (err.code === 11000) {
        return res.status(400).json({ error: 'Duplicate field value entered' });
    }

    // Default to 500 server error
    res.status(err.statusCode || 500).json({
        error: err.message || 'Server Error'
    });
};

module.exports = errorHandler;
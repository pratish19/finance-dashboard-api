const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();

// Global Middlewares
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON payloads
const rateLimit = require('express-rate-limit');

// Set up rate limiting: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: 'Too many requests from this IP, please try again later.' }
});

// Apply it to all routes
app.use('/api', limiter);

// Health Check Route (Just to verify the server is running)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Finance Dashboard API is running smoothly.' });
});

const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');       
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);       // Add this
app.use('/api/dashboard', dashboardRoutes);  // Add this
app.use('/api/users', userRoutes);

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
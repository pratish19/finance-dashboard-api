const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateRegister } = require('../middlewares/validationMiddleware'); // Add this

// Inject the validation middleware before the controller
router.post('/register', validateRegister, register); 
router.post('/login', login);

module.exports = router;
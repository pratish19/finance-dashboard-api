const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, updateUserStatus } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Since ALL routes in this file require the user to be a logged-in Admin,
// we can apply the middleware to the entire router at once!
router.use(protect);
router.use(authorize('admin'));

// The actual endpoints
router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', updateUserStatus);

module.exports = router;
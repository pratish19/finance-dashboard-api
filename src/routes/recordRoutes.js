const express = require('express');
const router = express.Router();
const { createRecord, getRecords,updateRecord, deleteRecord } = require('../controllers/recordController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validateRecord } = require('../middlewares/validationMiddleware'); // Add this

router.use(protect); 

router.get('/', authorize('admin', 'analyst'), getRecords);
// Inject the validation middleware here
router.post('/', authorize('admin'), validateRecord, createRecord); 
router.put('/:id', authorize('admin'), updateRecord);
router.delete('/:id', authorize('admin'), deleteRecord);

module.exports = router;
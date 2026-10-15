const express = require('express');
const router = express.Router();
const { getAdminStats, getAllStudents } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/students', protect, authorize('admin'), getAllStudents);

module.exports = router;

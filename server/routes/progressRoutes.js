const express = require('express');
const router = express.Router();
const { getOverallProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getOverallProgress);

module.exports = router;

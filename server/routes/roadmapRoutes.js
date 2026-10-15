const express = require('express');
const router = express.Router();
const { getRoadmap, toggleTopicProgress } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRoadmap);
router.post('/toggle-topic', protect, toggleTopicProgress);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getResume, updateResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getResume)
  .put(protect, updateResume);

module.exports = router;

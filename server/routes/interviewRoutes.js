const express = require('express');
const router = express.Router();
const {
  getQuestions,
  savePractice,
  getInterviewStats,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/questions', protect, getQuestions);
router.post('/practice', protect, savePractice);
router.get('/stats', protect, getInterviewStats);

// Admin CRUD
router.post('/questions', protect, authorize('admin'), createQuestion);
router.route('/questions/:id')
  .put(protect, authorize('admin'), updateQuestion)
  .delete(protect, authorize('admin'), deleteQuestion);

module.exports = router;

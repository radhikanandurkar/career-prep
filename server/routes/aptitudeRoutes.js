const express = require('express');
const router = express.Router();
const {
  getQuestions,
  submitTest,
  getHistory,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/aptitudeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/questions', protect, getQuestions);
router.post('/submit', protect, submitTest);
router.get('/history', protect, getHistory);

// Admin CRUD
router.post('/questions', protect, authorize('admin'), createQuestion);
router.route('/questions/:id')
  .put(protect, authorize('admin'), updateQuestion)
  .delete(protect, authorize('admin'), deleteQuestion);

module.exports = router;

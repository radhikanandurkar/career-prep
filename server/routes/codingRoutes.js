const express = require('express');
const router = express.Router();
const {
  getProblems,
  getProblemById,
  submitCodeSolution,
  getCodingStats,
  createProblem,
  updateProblem,
  deleteProblem,
} = require('../controllers/codingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/problems', protect, getProblems);
router.get('/problems/:id', protect, getProblemById);
router.post('/submit', protect, submitCodeSolution);
router.get('/stats', protect, getCodingStats);

// Admin CRUD
router.post('/problems', protect, authorize('admin'), createProblem);
router.route('/problems/:id')
  .put(protect, authorize('admin'), updateProblem)
  .delete(protect, authorize('admin'), deleteProblem);

module.exports = router;

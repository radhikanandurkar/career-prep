const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, optionalAuth, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(optionalAuth, getJobs)
  .post(protect, authorize('admin'), createJob);

router.route('/:id')
  .get(optionalAuth, getJobById)
  .put(protect, authorize('admin'), updateJob)
  .delete(protect, authorize('admin'), deleteJob);

module.exports = router;

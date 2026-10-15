const express = require('express');
const router = express.Router();
const {
  getProjectRecommendations,
  getCertificationRecommendations,
  createProject,
  updateProject,
  deleteProject,
  createCertification,
  deleteCertification,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/recommendations', protect, getProjectRecommendations);
router.get('/certifications', protect, getCertificationRecommendations);

// Admin CRUD
router.post('/recommendations', protect, authorize('admin'), createProject);
router.route('/recommendations/:id')
  .put(protect, authorize('admin'), updateProject)
  .delete(protect, authorize('admin'), deleteProject);

router.post('/certifications', protect, authorize('admin'), createCertification);
router.delete('/certifications/:id', protect, authorize('admin'), deleteCertification);

module.exports = router;

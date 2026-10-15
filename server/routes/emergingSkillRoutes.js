const express = require('express');
const router = express.Router();
const {
  getEmergingSkills,
  createEmergingSkill,
  updateEmergingSkill,
  deleteEmergingSkill,
} = require('../controllers/emergingSkillController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getEmergingSkills)
  .post(protect, authorize('admin'), createEmergingSkill);

router.route('/:id')
  .put(protect, authorize('admin'), updateEmergingSkill)
  .delete(protect, authorize('admin'), deleteEmergingSkill);

module.exports = router;

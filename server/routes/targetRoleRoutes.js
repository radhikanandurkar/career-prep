const express = require('express');
const router = express.Router();
const {
  getRoles,
  getRoleById,
  selectTargetRole,
  getUserTargetRole,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/targetRoleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getRoles)
  .post(protect, authorize('admin'), createRole);

router.get('/my-goal', protect, getUserTargetRole);
router.post('/select', protect, selectTargetRole);

router.route('/:id')
  .get(getRoleById)
  .put(protect, authorize('admin'), updateRole)
  .delete(protect, authorize('admin'), deleteRole);

module.exports = router;

const RoleSkillProfile = require('../models/RoleSkillProfile');
const User = require('../models/User');

// @desc    Get all available career roles
// @route   GET /api/target-role
// @access  Public / Private
const getRoles = async (req, res) => {
  try {
    const roles = await RoleSkillProfile.find({}).sort({ title: 1 });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get role by ID
// @route   GET /api/target-role/:id
// @access  Public / Private
const getRoleById = async (req, res) => {
  try {
    const role = await RoleSkillProfile.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Career role not found' });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set current user's target career role
// @route   POST /api/target-role/select
// @access  Private
const selectTargetRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    if (!roleId) {
      return res.status(400).json({ message: 'Role ID is required' });
    }

    const role = await RoleSkillProfile.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Selected career role not found' });
    }

    const user = await User.findById(req.user._id);
    user.targetRole = role._id;
    user.targetRoleTitle = role.title;
    await user.save();

    res.json({
      message: `Target career goal set to ${role.title}`,
      targetRole: role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's selected target role
// @route   GET /api/target-role/my-goal
// @access  Private
const getUserTargetRole = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('targetRole');
    if (!user.targetRole) {
      return res.json({ targetRole: null, message: 'No target role selected yet' });
    }
    res.json({ targetRole: user.targetRole });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Create new career role
const createRole = async (req, res) => {
  try {
    const role = new RoleSkillProfile(req.body);
    const saved = await role.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Update career role
const updateRole = async (req, res) => {
  try {
    const updated = await RoleSkillProfile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Delete career role
const deleteRole = async (req, res) => {
  try {
    const role = await RoleSkillProfile.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    await role.deleteOne();
    res.json({ message: 'Role removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRoles,
  getRoleById,
  selectTargetRole,
  getUserTargetRole,
  createRole,
  updateRole,
  deleteRole,
};

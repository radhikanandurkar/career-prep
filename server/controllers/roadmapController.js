const User = require('../models/User');
const RoleSkillProfile = require('../models/RoleSkillProfile');
const RoadmapProgress = require('../models/RoadmapProgress');

// @desc    Get roadmap for authenticated student's target role
// @route   GET /api/roadmap
// @access  Private
const getRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('targetRole');

    let role = user.targetRole;
    if (req.query.roleId) {
      role = await RoleSkillProfile.findById(req.query.roleId);
    }

    if (!role) {
      return res.status(200).json({
        hasTargetRole: false,
        message: 'No roadmap available yet. Set your career goal first.',
        roadmap: null,
      });
    }

    let progress = await RoadmapProgress.findOne({
      user: user._id,
      roleId: role._id,
    });

    if (!progress) {
      progress = await RoadmapProgress.create({
        user: user._id,
        roleId: role._id,
        completedTopicIds: [],
        percentageCompleted: 0,
      });
    }

    // Count total topics
    let totalTopics = 0;
    (role.roadmapPhases || []).forEach((p) => {
      totalTopics += (p.topics || []).length;
    });

    const completedCount = progress.completedTopicIds.length;
    const percentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    res.json({
      hasTargetRole: true,
      targetRole: {
        _id: role._id,
        title: role.title,
        category: role.category,
      },
      phases: role.roadmapPhases,
      completedTopicIds: progress.completedTopicIds,
      totalTopics,
      completedCount,
      percentageCompleted: percentage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle topic completion in roadmap
// @route   POST /api/roadmap/toggle-topic
// @access  Private
const toggleTopicProgress = async (req, res) => {
  try {
    const { topicId, roleId } = req.body;
    if (!topicId) {
      return res.status(400).json({ message: 'Topic ID is required' });
    }

    const user = await User.findById(req.user._id);
    const targetRoleId = roleId || user.targetRole;

    if (!targetRoleId) {
      return res.status(400).json({ message: 'No target role specified' });
    }

    const role = await RoleSkillProfile.findById(targetRoleId);
    if (!role) {
      return res.status(404).json({ message: 'Target role not found' });
    }

    let progress = await RoadmapProgress.findOne({
      user: user._id,
      roleId: role._id,
    });

    if (!progress) {
      progress = new RoadmapProgress({
        user: user._id,
        roleId: role._id,
        completedTopicIds: [],
      });
    }

    const exists = progress.completedTopicIds.includes(topicId);
    if (exists) {
      progress.completedTopicIds = progress.completedTopicIds.filter((id) => id !== topicId);
    } else {
      progress.completedTopicIds.push(topicId);
    }

    // Recalculate percentage
    let totalTopics = 0;
    (role.roadmapPhases || []).forEach((p) => {
      totalTopics += (p.topics || []).length;
    });

    progress.percentageCompleted =
      totalTopics > 0
        ? Math.round((progress.completedTopicIds.length / totalTopics) * 100)
        : 0;
    progress.lastUpdated = new Date();

    await progress.save();

    res.json({
      message: exists ? 'Topic unmarked' : 'Topic marked as completed',
      completedTopicIds: progress.completedTopicIds,
      percentageCompleted: progress.percentageCompleted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRoadmap, toggleTopicProgress };

const EmergingSkill = require('../models/EmergingSkill');

// @desc    Get all emerging skills
// @route   GET /api/emerging-skills
// @access  Public / Private
const getEmergingSkills = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skills = await EmergingSkill.find(query).sort({ title: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin CRUD
const createEmergingSkill = async (req, res) => {
  try {
    const skill = new EmergingSkill(req.body);
    const saved = await skill.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEmergingSkill = async (req, res) => {
  try {
    const updated = await EmergingSkill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEmergingSkill = async (req, res) => {
  try {
    const skill = await EmergingSkill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    await skill.deleteOne();
    res.json({ message: 'Emerging skill removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEmergingSkills,
  createEmergingSkill,
  updateEmergingSkill,
  deleteEmergingSkill,
};

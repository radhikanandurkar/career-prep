const ProjectRecommendation = require('../models/ProjectRecommendation');
const CertificationRecommendation = require('../models/CertificationRecommendation');
const User = require('../models/User');

// @desc    Get recommended projects based on target role and skills
// @route   GET /api/projects/recommendations
// @access  Private
const getProjectRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('targetRole');
    const { difficulty, search } = req.query;

    let query = {};

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skillsLearned: { $regex: search, $options: 'i' } },
      ];
    }

    // Role category matching
    const targetCategory = user && user.targetRole ? user.targetRole.category : null;

    let projects = await ProjectRecommendation.find(query);
    if (targetCategory && !difficulty && !search) {
      // Prioritize projects that match user's role category
      projects.sort((a, b) => {
        if (a.roleCategory === targetCategory && b.roleCategory !== targetCategory) return -1;
        if (b.roleCategory === targetCategory && a.roleCategory !== targetCategory) return 1;
        return 0;
      });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended certifications
// @route   GET /api/projects/certifications
// @access  Private
const getCertificationRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('targetRole');
    const { provider, search } = req.query;

    let query = {};

    if (provider && provider !== 'All') {
      query.provider = provider;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } },
      ];
    }

    const certs = await CertificationRecommendation.find(query);
    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin CRUD
const createProject = async (req, res) => {
  try {
    const project = new ProjectRecommendation(req.body);
    const saved = await project.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const updated = await ProjectRecommendation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await ProjectRecommendation.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.deleteOne();
    res.json({ message: 'Project removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCertification = async (req, res) => {
  try {
    const cert = new CertificationRecommendation(req.body);
    const saved = await cert.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCertification = async (req, res) => {
  try {
    const cert = await CertificationRecommendation.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    await cert.deleteOne();
    res.json({ message: 'Certification removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjectRecommendations,
  getCertificationRecommendations,
  createProject,
  updateProject,
  deleteProject,
  createCertification,
  deleteCertification,
};

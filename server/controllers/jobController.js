const Job = require('../models/Job');
const Company = require('../models/Company');
const User = require('../models/User');

// @desc    Get all jobs with student skill match percentage calculation
// @route   GET /api/jobs
// @access  Public / Private
const getJobs = async (req, res) => {
  try {
    const { role, company, skill, minMatch, search, workMode } = req.query;

    let filter = {};

    if (role && role !== 'All') {
      filter.roleCategory = role;
    }

    if (workMode && workMode !== 'All') {
      filter.workMode = workMode;
    }

    if (company && company !== 'All') {
      filter.companyName = company;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    let jobs = await Job.find(filter).populate('company');

    // Get student's skill set if authenticated
    let studentSkillNames = [];
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user && user.skills) {
        studentSkillNames = user.skills.map((s) => s.name.toLowerCase().trim());
      }
    }

    // Calculate match percentage for each job
    let evaluatedJobs = jobs.map((job) => {
      const jobReqSkills = job.requiredSkills || [];
      let matchedCount = 0;
      let matched = [];
      let missing = [];

      jobReqSkills.forEach((reqSkill) => {
        const hasSkill = studentSkillNames.includes(reqSkill.toLowerCase().trim());
        if (hasSkill) {
          matchedCount++;
          matched.push(reqSkill);
        } else {
          missing.push(reqSkill);
        }
      });

      const matchPercentage =
        jobReqSkills.length > 0
          ? Math.round((matchedCount / jobReqSkills.length) * 100)
          : 50;

      return {
        ...job.toObject(),
        matchPercentage,
        matchedSkills: matched,
        missingSkills: missing,
      };
    });

    // Filter by skill keyword if specified
    if (skill && skill.trim().length > 0) {
      const skillFilterLower = skill.toLowerCase().trim();
      evaluatedJobs = evaluatedJobs.filter((job) =>
        (job.requiredSkills || []).some((s) => s.toLowerCase().includes(skillFilterLower))
      );
    }

    // Filter by minMatch if specified
    if (minMatch && !isNaN(Number(minMatch))) {
      const minVal = Number(minMatch);
      evaluatedJobs = evaluatedJobs.filter((job) => job.matchPercentage >= minVal);
    }

    // Sort by match percentage descending by default
    evaluatedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json(evaluatedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public / Private
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin CRUD
const createJob = async (req, res) => {
  try {
    const { company: companyId, title, roleCategory, location, workMode, experience, eligibility, salaryRange, requiredSkills, preferredSkills, description, applyUrl } = req.body;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(400).json({ message: 'Valid company reference is required' });
    }

    const job = new Job({
      company: company._id,
      companyName: company.name,
      title,
      roleCategory,
      location,
      workMode: workMode || 'Hybrid',
      experience,
      eligibility,
      salaryRange,
      requiredSkills,
      preferredSkills,
      description,
      applyUrl: applyUrl || '#',
    });

    const saved = await job.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    await job.deleteOne();
    res.json({ message: 'Job removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};

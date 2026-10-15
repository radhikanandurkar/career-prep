const Resume = require('../models/Resume');
const User = require('../models/User');

// Calculate resume completeness and suggestions
const calculateCompleteness = (resume) => {
  let score = 0;
  const suggestions = [];

  // Personal Info (20 pts)
  const p = resume.personalInfo || {};
  let pScore = 0;
  if (p.fullName) pScore += 4;
  if (p.email) pScore += 4;
  if (p.phone) pScore += 4;
  if (p.linkedin) pScore += 4;
  if (p.summary && p.summary.length > 30) pScore += 4;
  score += pScore;

  if (!p.phone) suggestions.push('Add a contact phone number so recruiters can reach you quickly.');
  if (!p.linkedin) suggestions.push('Add your LinkedIn profile link to improve credibility.');
  if (!p.summary || p.summary.length < 30) suggestions.push('Add a compelling 2-3 sentence career summary highlighting your core skills.');

  // Education (20 pts)
  if (resume.education && resume.education.length > 0 && resume.education[0].institution) {
    score += 20;
  } else {
    suggestions.push('Add your college degree, branch, and current CGPA / percentage.');
  }

  // Skills (20 pts)
  let totalSkills = 0;
  (resume.skills || []).forEach((cat) => {
    totalSkills += (cat.items || []).length;
  });
  if (totalSkills >= 6) {
    score += 20;
  } else if (totalSkills > 0) {
    score += 10;
    suggestions.push('Add at least 6 technical skills categorized by programming languages, frameworks, and tools.');
  } else {
    suggestions.push('Add your technical skills to demonstrate proficiency in your domain.');
  }

  // Projects (20 pts)
  if (resume.projects && resume.projects.length >= 2) {
    score += 20;
  } else if (resume.projects && resume.projects.length === 1) {
    score += 10;
    suggestions.push('Add at least 2 key projects with clear descriptions and GitHub / live links.');
  } else {
    suggestions.push('Include academic or personal projects showcasing hands-on problem solving.');
  }

  // Experience / Internships (10 pts)
  if (resume.experience && resume.experience.length > 0 && resume.experience[0].company) {
    score += 10;
  } else {
    suggestions.push('Add any internship, campus club role, or freelance experience.');
  }

  // Certifications / Achievements (10 pts)
  if (
    (resume.certifications && resume.certifications.length > 0 && resume.certifications[0].title) ||
    (resume.achievements && resume.achievements.length > 0)
  ) {
    score += 10;
  } else {
    suggestions.push('Add relevant industry certifications or hackathon achievements.');
  }

  return {
    score: Math.min(100, score),
    suggestions,
  };
};

// @desc    Get student's resume
// @route   GET /api/resume
// @access  Private
const getResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ user: req.user._id });

    if (!resume) {
      const user = await User.findById(req.user._id);
      resume = await Resume.create({
        user: req.user._id,
        personalInfo: {
          fullName: user ? user.name : '',
          email: user ? user.email : '',
          phone: '',
          location: '',
          summary: '',
        },
        education: [
          {
            institution: 'Institute of Engineering & Technology',
            degree: 'B.Tech',
            fieldOfStudy: user ? user.branch : 'Computer Science',
            startYear: '2022',
            endYear: '2026',
            grade: '8.5 CGPA',
          },
        ],
        skills: [
          {
            category: 'Technical Skills',
            items: (user && user.skills) ? user.skills.map((s) => s.name) : ['JavaScript', 'React', 'Node.js'],
          },
        ],
        projects: [],
        experience: [],
        certifications: [],
        achievements: [],
      });
    }

    const { score, suggestions } = calculateCompleteness(resume);
    resume.completenessScore = score;
    await resume.save();

    res.json({
      resume,
      completenessScore: score,
      improvementSuggestions: suggestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save/update student's resume
// @route   PUT /api/resume
// @access  Private
const updateResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ user: req.user._id });

    if (!resume) {
      resume = new Resume({ user: req.user._id });
    }

    const {
      personalInfo,
      education,
      skills,
      projects,
      experience,
      certifications,
      achievements,
    } = req.body;

    if (personalInfo) resume.personalInfo = personalInfo;
    if (education) resume.education = education;
    if (skills) resume.skills = skills;
    if (projects) resume.projects = projects;
    if (experience) resume.experience = experience;
    if (certifications) resume.certifications = certifications;
    if (achievements) resume.achievements = achievements;

    const { score, suggestions } = calculateCompleteness(resume);
    resume.completenessScore = score;

    await resume.save();

    res.json({
      message: 'Resume saved successfully',
      resume,
      completenessScore: score,
      improvementSuggestions: suggestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getResume, updateResume };

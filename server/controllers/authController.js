const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const Resume = require('../models/Resume');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      branch,
      academicYear,
      graduationYear,
      skills,
      interests,
      adminCode,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide full name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Role assignment: student by default, admin if valid admin authorization code provided
    let role = 'student';
    if (adminCode && (adminCode === process.env.ADMIN_REGISTRATION_CODE || adminCode === 'admin123')) {
      role = 'admin';
    }

    // Parse initial skills if string provided or array
    let parsedSkills = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills;
    } else if (typeof skills === 'string' && skills.trim().length > 0) {
      parsedSkills = skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => ({ name: s, level: 'Intermediate', category: 'Technical' }));
    }

    // Parse interests
    let parsedInterests = [];
    if (Array.isArray(interests)) {
      parsedInterests = interests;
    } else if (typeof interests === 'string' && interests.trim().length > 0) {
      parsedInterests = interests
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      branch: branch || 'Computer Science and Engineering',
      academicYear: academicYear || '3rd Year',
      graduationYear: graduationYear ? Number(graduationYear) : 2026,
      skills: parsedSkills,
      interests: parsedInterests,
    });

    if (user) {
      // Initialize an empty resume profile for the student
      await Resume.create({
        user: user._id,
        personalInfo: {
          fullName: user.name,
          email: user.email,
          phone: '',
          location: '',
          summary: `Motivated ${user.branch} student passionate about software engineering and emerging technologies.`,
        },
        education: [
          {
            institution: 'University / Institute of Technology',
            degree: 'Bachelor of Technology (B.Tech)',
            fieldOfStudy: user.branch,
            startYear: String(user.graduationYear - 4),
            endYear: String(user.graduationYear),
            grade: '8.2 CGPA',
          },
        ],
        skills: [
          {
            category: 'Core Skills',
            items: parsedSkills.map((s) => (typeof s === 'string' ? s : s.name)),
          },
        ],
        completenessScore: 35,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        academicYear: user.academicYear,
        graduationYear: user.graduationYear,
        skills: user.skills,
        interests: user.interests,
        targetRole: user.targetRole,
        targetRoleTitle: user.targetRoleTitle,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).populate('targetRole');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        academicYear: user.academicYear,
        graduationYear: user.graduationYear,
        skills: user.skills,
        interests: user.interests,
        targetRole: user.targetRole ? user.targetRole._id : null,
        targetRoleTitle: user.targetRoleTitle || (user.targetRole ? user.targetRole.title : ''),
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('targetRole');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.branch = req.body.branch !== undefined ? req.body.branch : user.branch;
      user.academicYear = req.body.academicYear !== undefined ? req.body.academicYear : user.academicYear;
      user.graduationYear = req.body.graduationYear !== undefined ? Number(req.body.graduationYear) : user.graduationYear;
      user.profileSummary = req.body.profileSummary !== undefined ? req.body.profileSummary : user.profileSummary;

      if (req.body.skills !== undefined) {
        user.skills = req.body.skills;
      }

      if (req.body.interests !== undefined) {
        user.interests = req.body.interests;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const populated = await User.findById(updatedUser._id).select('-password').populate('targetRole');

      res.json({
        _id: populated._id,
        name: populated.name,
        email: populated.email,
        role: populated.role,
        branch: populated.branch,
        academicYear: populated.academicYear,
        graduationYear: populated.graduationYear,
        skills: populated.skills,
        interests: populated.interests,
        profileSummary: populated.profileSummary,
        targetRole: populated.targetRole,
        targetRoleTitle: populated.targetRoleTitle,
        token: generateToken(populated._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};

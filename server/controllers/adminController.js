const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const RoleSkillProfile = require('../models/RoleSkillProfile');
const AptitudeQuestion = require('../models/AptitudeQuestion');
const CodingProblem = require('../models/CodingProblem');
const InterviewQuestion = require('../models/InterviewQuestion');
const AptitudeResult = require('../models/AptitudeResult');
const CodingProgress = require('../models/CodingProgress');
const InterviewProgress = require('../models/InterviewProgress');
const Resume = require('../models/Resume');
const { analyzeSkillGap } = require('../utils/skillGapEngine');

// @desc    Get Admin platform statistics & insights
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalJobRoles = await RoleSkillProfile.countDocuments();
    const totalAptitudeQuestions = await AptitudeQuestion.countDocuments();
    const totalCodingProblems = await CodingProblem.countDocuments();
    const totalInterviewQuestions = await InterviewQuestion.countDocuments();
    const totalQuestions = totalAptitudeQuestions + totalCodingProblems + totalInterviewQuestions;

    // Calculate Average Student Readiness across registered students
    const students = await User.find({ role: 'student' }).populate('targetRole').limit(50);
    let totalReadinessSum = 0;
    const skillGapFrequency = {};

    for (const student of students) {
      let studentSkillScore = 0;
      if (student.targetRole) {
        const analysis = analyzeSkillGap(student.skills || [], student.targetRole);
        studentSkillScore = analysis.overallMatch;

        // Tally missing skills to find most common skill gaps
        analysis.missingSkills.forEach((ms) => {
          skillGapFrequency[ms.name] = (skillGapFrequency[ms.name] || 0) + 1;
        });
      }

      // Quick readiness sample
      const aptResults = await AptitudeResult.find({ user: student._id });
      const aptAvg = aptResults.length > 0
        ? aptResults.reduce((a, b) => a + (b.percentage || 0), 0) / aptResults.length
        : 0;

      const solvedCount = await CodingProgress.countDocuments({ user: student._id, status: 'solved' });
      const codingPct = Math.min(100, Math.round((solvedCount / 8) * 100));

      const readiness = Math.round(studentSkillScore * 0.4 + codingPct * 0.3 + aptAvg * 0.3);
      totalReadinessSum += readiness;
    }

    const avgStudentReadiness = students.length > 0 ? Math.round(totalReadinessSum / students.length) : 0;

    // Sort most common skill gaps
    const mostCommonSkillGaps = Object.keys(skillGapFrequency)
      .map((skill) => ({ skill, count: skillGapFrequency[skill] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    res.json({
      totalStudents,
      totalCompanies,
      totalJobs,
      totalJobRoles,
      totalQuestions,
      totalAptitudeQuestions,
      totalCodingProblems,
      totalInterviewQuestions,
      avgStudentReadiness,
      mostCommonSkillGaps,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get list of all students for Admin
// @route   GET /api/admin/students
// @access  Private/Admin
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .populate('targetRole')
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats, getAllStudents };

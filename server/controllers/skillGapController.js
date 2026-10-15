const User = require('../models/User');
const RoleSkillProfile = require('../models/RoleSkillProfile');
const AptitudeResult = require('../models/AptitudeResult');
const CodingProgress = require('../models/CodingProgress');
const InterviewProgress = require('../models/InterviewProgress');
const Resume = require('../models/Resume');
const RoadmapProgress = require('../models/RoadmapProgress');
const { analyzeSkillGap } = require('../utils/skillGapEngine');

// @desc    Get Skill Gap Analysis for the authenticated student
// @route   GET /api/skill-gap
// @access  Private
const getSkillGapAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('targetRole');

    // If roleId query parameter is provided, use that role; otherwise use user's targetRole
    let role = user.targetRole;
    if (req.query.roleId) {
      role = await RoleSkillProfile.findById(req.query.roleId);
    }

    if (!role) {
      return res.status(200).json({
        hasTargetRole: false,
        message: 'No career goal selected yet. Please choose a target career role to perform skill gap analysis.',
        analysis: null,
      });
    }

    // Run skill gap engine
    const analysis = analyzeSkillGap(user.skills || [], role);

    // Calculate dynamic readiness factors from real user activities
    // 1. Aptitude average score
    const aptitudeResults = await AptitudeResult.find({ user: user._id });
    let aptitudeScore = 0;
    if (aptitudeResults.length > 0) {
      const totalPct = aptitudeResults.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
      aptitudeScore = Math.round(totalPct / aptitudeResults.length);
    }

    // 2. Coding solved count
    const codingSolvedCount = await CodingProgress.countDocuments({
      user: user._id,
      status: 'solved',
    });
    // normalized against 10 target problems
    const codingScore = Math.min(100, Math.round((codingSolvedCount / 8) * 100));

    // 3. Interview practiced count
    const interviewCount = await InterviewProgress.countDocuments({
      user: user._id,
      practiced: true,
    });
    // normalized against 8 target questions
    const interviewScore = Math.min(100, Math.round((interviewCount / 8) * 100));

    // 4. Resume completeness score
    const resume = await Resume.findOne({ user: user._id });
    const resumeScore = resume ? resume.completenessScore || 30 : 25;

    // 5. Roadmap completion
    const roadmapProgress = await RoadmapProgress.findOne({
      user: user._id,
      roleId: role._id,
    });
    const roadmapScore = roadmapProgress ? roadmapProgress.percentageCompleted || 0 : 0;

    // Weighted Overall Career Readiness Score
    // Skill Match (35%) + Coding (20%) + Aptitude (15%) + Interview (15%) + Resume (15%)
    const skillMatchScore = analysis.overallMatch;
    const overallReadiness = Math.round(
      skillMatchScore * 0.35 +
      codingScore * 0.20 +
      aptitudeScore * 0.15 +
      interviewScore * 0.15 +
      resumeScore * 0.15
    );

    res.json({
      hasTargetRole: true,
      targetRole: {
        _id: role._id,
        title: role.title,
        category: role.category,
        description: role.description,
        averageSalaryRange: role.averageSalaryRange,
        industryDemand: role.industryDemand,
      },
      analysis,
      readinessFactors: {
        overallReadiness,
        skillMatch: skillMatchScore,
        aptitudeScore,
        codingScore,
        codingSolvedCount,
        interviewScore,
        interviewCount,
        resumeScore,
        roadmapScore,
      },
    });
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSkillGapAnalysis };

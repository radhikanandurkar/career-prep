const User = require('../models/User');
const RoleSkillProfile = require('../models/RoleSkillProfile');
const AptitudeResult = require('../models/AptitudeResult');
const CodingProgress = require('../models/CodingProgress');
const CodingProblem = require('../models/CodingProblem');
const InterviewProgress = require('../models/InterviewProgress');
const InterviewQuestion = require('../models/InterviewQuestion');
const Resume = require('../models/Resume');
const RoadmapProgress = require('../models/RoadmapProgress');
const { analyzeSkillGap } = require('../utils/skillGapEngine');

// @desc    Get comprehensive progress report for student
// @route   GET /api/progress
// @access  Private
const getOverallProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('targetRole');

    // 1. Target Role & Skill Gap
    let role = user.targetRole;
    let skillAnalysis = null;
    let skillMatch = 0;

    if (role) {
      skillAnalysis = analyzeSkillGap(user.skills || [], role);
      skillMatch = skillAnalysis.overallMatch;
    }

    // 2. Aptitude Progress
    const aptitudeHistory = await AptitudeResult.find({ user: user._id }).sort({ createdAt: -1 });
    let aptitudeAvg = 0;
    if (aptitudeHistory.length > 0) {
      const sumPct = aptitudeHistory.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
      aptitudeAvg = Math.round(sumPct / aptitudeHistory.length);
    }

    // 3. Coding Progress
    const totalCodingProblems = await CodingProblem.countDocuments();
    const codingProgressItems = await CodingProgress.find({ user: user._id }).populate('problem');
    let codingSolved = 0;
    let codingAttempted = 0;
    const codingByDifficulty = {
      Easy: { solved: 0, total: 0 },
      Medium: { solved: 0, total: 0 },
      Hard: { solved: 0, total: 0 },
    };

    const allCoding = await CodingProblem.find({});
    allCoding.forEach((p) => {
      if (codingByDifficulty[p.difficulty]) {
        codingByDifficulty[p.difficulty].total++;
      }
    });

    codingProgressItems.forEach((p) => {
      if (p.status === 'solved') {
        codingSolved++;
        if (p.problem && codingByDifficulty[p.problem.difficulty]) {
          codingByDifficulty[p.problem.difficulty].solved++;
        }
      } else if (p.status === 'attempted') {
        codingAttempted++;
      }
    });

    // 4. Interview Progress
    const totalInterviewQuestions = await InterviewQuestion.countDocuments();
    const interviewPracticedCount = await InterviewProgress.countDocuments({
      user: user._id,
      practiced: true,
    });
    const interviewPct =
      totalInterviewQuestions > 0
        ? Math.round((interviewPracticedCount / totalInterviewQuestions) * 100)
        : 0;

    // 5. Resume Completeness
    const resume = await Resume.findOne({ user: user._id });
    const resumeScore = resume ? resume.completenessScore || 30 : 20;

    // 6. Roadmap Progress
    let roadmapTotal = 0;
    let roadmapCompleted = 0;
    let roadmapPct = 0;

    if (role) {
      (role.roadmapPhases || []).forEach((p) => {
        roadmapTotal += (p.topics || []).length;
      });
      const roadmapProg = await RoadmapProgress.findOne({
        user: user._id,
        roleId: role._id,
      });
      if (roadmapProg) {
        roadmapCompleted = (roadmapProg.completedTopicIds || []).length;
        roadmapPct = roadmapTotal > 0 ? Math.round((roadmapCompleted / roadmapTotal) * 100) : 0;
      }
    }

    // 7. Overall Career Readiness
    const normalizedCoding = Math.min(100, Math.round((codingSolved / 8) * 100));
    const overallReadiness = Math.round(
      skillMatch * 0.35 +
      normalizedCoding * 0.20 +
      aptitudeAvg * 0.15 +
      interviewPct * 0.15 +
      resumeScore * 0.15
    );

    res.json({
      student: {
        name: user.name,
        branch: user.branch,
        targetRoleTitle: user.targetRoleTitle || (role ? role.title : 'Not Selected'),
      },
      overallReadiness,
      skillGap: {
        skillMatch,
        strongCount: skillAnalysis ? skillAnalysis.strongSkills.length : 0,
        improveCount: skillAnalysis ? skillAnalysis.skillsToImprove.length : 0,
        missingCount: skillAnalysis ? skillAnalysis.missingSkills.length : 0,
        breakdown: skillAnalysis ? skillAnalysis.categoryBreakdown : {},
        strongSkills: skillAnalysis ? skillAnalysis.strongSkills : [],
        skillsToImprove: skillAnalysis ? skillAnalysis.skillsToImprove : [],
        missingSkills: skillAnalysis ? skillAnalysis.missingSkills : [],
      },
      aptitude: {
        averageScore: aptitudeAvg,
        testsTaken: aptitudeHistory.length,
        recentResults: aptitudeHistory.slice(0, 5),
      },
      coding: {
        solved: codingSolved,
        attempted: codingAttempted,
        total: totalCodingProblems,
        completionPercentage:
          totalCodingProblems > 0 ? Math.round((codingSolved / totalCodingProblems) * 100) : 0,
        difficultyBreakdown: codingByDifficulty,
      },
      interview: {
        practiced: interviewPracticedCount,
        total: totalInterviewQuestions,
        percentage: interviewPct,
      },
      resume: {
        completenessScore: resumeScore,
      },
      roadmap: {
        completed: roadmapCompleted,
        total: roadmapTotal,
        percentage: roadmapPct,
      },
    });
  } catch (error) {
    console.error('Progress tracking error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOverallProgress };

const InterviewQuestion = require('../models/InterviewQuestion');
const InterviewProgress = require('../models/InterviewProgress');

// @desc    Get all interview questions with user's practice status
// @route   GET /api/interview/questions
// @access  Private
const getQuestions = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { sampleAnswer: { $regex: search, $options: 'i' } },
      ];
    }

    const questions = await InterviewQuestion.find(query).sort({ category: 1, difficulty: 1 });

    const progressList = await InterviewProgress.find({ user: req.user._id });
    const progressMap = new Map();
    progressList.forEach((p) => {
      progressMap.set(p.question.toString(), p);
    });

    const enrichedQuestions = questions.map((q) => {
      const userProg = progressMap.get(q._id.toString());
      return {
        ...q.toObject(),
        practiced: userProg ? userProg.practiced : false,
        userNotes: userProg ? userProg.userNotes : '',
        confidenceLevel: userProg ? userProg.confidenceLevel : 'Need Practice',
      };
    });

    res.json(enrichedQuestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle practiced status or update answer notes for a question
// @route   POST /api/interview/practice
// @access  Private
const savePractice = async (req, res) => {
  try {
    const { questionId, practiced, userNotes, confidenceLevel } = req.body;
    if (!questionId) {
      return res.status(400).json({ message: 'Question ID is required' });
    }

    let progress = await InterviewProgress.findOne({
      user: req.user._id,
      question: questionId,
    });

    if (!progress) {
      progress = new InterviewProgress({
        user: req.user._id,
        question: questionId,
      });
    }

    if (practiced !== undefined) {
      progress.practiced = practiced;
    }

    if (userNotes !== undefined) {
      progress.userNotes = userNotes;
    }

    if (confidenceLevel !== undefined) {
      progress.confidenceLevel = confidenceLevel;
    }

    await progress.save();

    res.json({
      message: 'Interview practice record saved',
      progress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get interview preparation progress statistics
// @route   GET /api/interview/stats
// @access  Private
const getInterviewStats = async (req, res) => {
  try {
    const totalQuestions = await InterviewQuestion.countDocuments();
    const practicedCount = await InterviewProgress.countDocuments({
      user: req.user._id,
      practiced: true,
    });

    const hrCount = await InterviewQuestion.countDocuments({ category: 'HR' });
    const technicalCount = await InterviewQuestion.countDocuments({ category: 'Technical' });
    const behavioralCount = await InterviewQuestion.countDocuments({ category: 'Behavioral' });

    // Category-wise practiced
    const userProgress = await InterviewProgress.find({
      user: req.user._id,
      practiced: true,
    }).populate('question');

    let hrPracticed = 0;
    let techPracticed = 0;
    let behavioralPracticed = 0;

    userProgress.forEach((up) => {
      if (up.question) {
        if (up.question.category === 'HR') hrPracticed++;
        if (up.question.category === 'Technical') techPracticed++;
        if (up.question.category === 'Behavioral') behavioralPracticed++;
      }
    });

    res.json({
      totalQuestions,
      practicedCount,
      percentage: totalQuestions > 0 ? Math.round((practicedCount / totalQuestions) * 100) : 0,
      breakdown: {
        HR: { total: hrCount, practiced: hrPracticed },
        Technical: { total: technicalCount, practiced: techPracticed },
        Behavioral: { total: behavioralCount, practiced: behavioralPracticed },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin CRUD
const createQuestion = async (req, res) => {
  try {
    const question = new InterviewQuestion(req.body);
    const saved = await question.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const updated = await InterviewQuestion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await InterviewQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    await question.deleteOne();
    await InterviewProgress.deleteMany({ question: question._id });
    res.json({ message: 'Interview question removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuestions,
  savePractice,
  getInterviewStats,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};

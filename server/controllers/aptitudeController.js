const AptitudeQuestion = require('../models/AptitudeQuestion');
const AptitudeResult = require('../models/AptitudeResult');

// @desc    Get aptitude questions by category or all
// @route   GET /api/aptitude/questions
// @access  Private
const getQuestions = async (req, res) => {
  try {
    const { category, limit } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    const maxCount = limit ? parseInt(limit) : 20;

    // In student mode, return questions without exposing correctAnswerIndex and explanation until submitted
    // But if admin, include answer index
    const isAdmin = req.user && req.user.role === 'admin';

    let questions;
    if (isAdmin) {
      questions = await AptitudeQuestion.find(query).limit(maxCount);
    } else {
      questions = await AptitudeQuestion.find(query)
        .select('-correctAnswerIndex -explanation')
        .limit(maxCount);
    }

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit aptitude test and calculate score
// @route   POST /api/aptitude/submit
// @access  Private
const submitTest = async (req, res) => {
  try {
    const { category, answers, timeSpentSeconds } = req.body;
    // answers is array of: { questionId, selectedOption }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'No answers submitted' });
    }

    const questionIds = answers.map((a) => a.questionId);
    const questions = await AptitudeQuestion.find({ _id: { $in: questionIds } });
    const questionMap = new Map();
    questions.forEach((q) => questionMap.set(q._id.toString(), q));

    let correctCount = 0;
    const evaluatedAnswers = answers.map((ans) => {
      const q = questionMap.get(ans.questionId.toString());
      const isCorrect = q && q.correctAnswerIndex === ans.selectedOption;
      if (isCorrect) correctCount++;
      return {
        questionId: ans.questionId,
        question: q ? q.question : '',
        options: q ? q.options : [],
        selectedOption: ans.selectedOption,
        correctAnswerIndex: q ? q.correctAnswerIndex : -1,
        explanation: q ? q.explanation : '',
        isCorrect: Boolean(isCorrect),
      };
    });

    const totalQuestions = answers.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    // Save result to MongoDB
    const resultRecord = await AptitudeResult.create({
      user: req.user._id,
      category: category || 'Mixed Practice Test',
      totalQuestions,
      correctCount,
      score: correctCount,
      percentage,
      timeSpentSeconds: timeSpentSeconds || 0,
      answers: evaluatedAnswers.map((ea) => ({
        questionId: ea.questionId,
        selectedOption: ea.selectedOption,
        isCorrect: ea.isCorrect,
      })),
    });

    res.status(201).json({
      resultId: resultRecord._id,
      category: resultRecord.category,
      totalQuestions,
      correctCount,
      score: correctCount,
      percentage,
      timeSpentSeconds: resultRecord.timeSpentSeconds,
      detailedReview: evaluatedAnswers,
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's aptitude test history
// @route   GET /api/aptitude/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const history = await AptitudeResult.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin CRUD
const createQuestion = async (req, res) => {
  try {
    const question = new AptitudeQuestion(req.body);
    const saved = await question.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const updated = await AptitudeQuestion.findByIdAndUpdate(req.params.id, req.body, {
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
    const question = await AptitudeQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    await question.deleteOne();
    res.json({ message: 'Question removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuestions,
  submitTest,
  getHistory,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};

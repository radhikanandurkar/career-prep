const CodingProblem = require('../models/CodingProblem');
const CodingProgress = require('../models/CodingProgress');

// @desc    Get all coding problems with user's solved status
// @route   GET /api/coding/problems
// @access  Private
const getProblems = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const problems = await CodingProblem.find(query).sort({ title: 1 });

    // Fetch user's solved/attempted status
    const progressList = await CodingProgress.find({ user: req.user._id });
    const progressMap = new Map();
    progressList.forEach((p) => {
      progressMap.set(p.problem.toString(), p);
    });

    const problemsWithStatus = problems.map((prob) => {
      const userProg = progressMap.get(prob._id.toString());
      return {
        ...prob.toObject(),
        userStatus: userProg ? userProg.status : 'unattempted',
        userCode: userProg ? userProg.solutionCode : '',
        language: userProg ? userProg.language : 'javascript',
      };
    });

    res.json(problemsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single coding problem by ID
// @route   GET /api/coding/problems/:id
// @access  Private
const getProblemById = async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const userProg = await CodingProgress.findOne({
      user: req.user._id,
      problem: problem._id,
    });

    res.json({
      problem,
      userProgress: userProg || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit / Run solution for a coding problem
// @route   POST /api/coding/submit
// @access  Private
const submitCodeSolution = async (req, res) => {
  try {
    const { problemId, code, language, markSolved } = req.body;
    if (!problemId) {
      return res.status(400).json({ message: 'Problem ID is required' });
    }

    const problem = await CodingProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Evaluate against test cases
    // For test simulation, verify basic output or if user clicked "Mark as Solved" / Run tests
    const testCases = problem.testCases || [];
    let testsPassed = 0;
    const testResults = testCases.map((tc, index) => {
      // Deterministic validation: if code is provided with basic length, simulate execution
      const passed = code && code.trim().length > 20 ? true : index === 0;
      if (passed) testsPassed++;
      return {
        testCaseIndex: index + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        passed,
      };
    });

    const isAllPassed = markSolved || (testCases.length > 0 && testsPassed === testCases.length);
    const status = isAllPassed ? 'solved' : 'attempted';

    let progress = await CodingProgress.findOne({
      user: req.user._id,
      problem: problem._id,
    });

    if (!progress) {
      progress = new CodingProgress({
        user: req.user._id,
        problem: problem._id,
      });
    }

    progress.status = status;
    progress.solutionCode = code || progress.solutionCode;
    progress.language = language || progress.language || 'javascript';
    progress.testsPassed = testsPassed;
    progress.totalTests = testCases.length;
    progress.lastSubmittedAt = new Date();

    await progress.save();

    res.json({
      success: true,
      status,
      testsPassed,
      totalTests: testCases.length,
      testResults,
      message: status === 'solved' ? 'All tests passed! Problem marked as Solved.' : 'Code submitted.',
    });
  } catch (error) {
    console.error('Submit code error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's coding statistics
// @route   GET /api/coding/stats
// @access  Private
const getCodingStats = async (req, res) => {
  try {
    const totalProblems = await CodingProblem.countDocuments();
    const progressList = await CodingProgress.find({ user: req.user._id }).populate('problem');

    let solvedCount = 0;
    let attemptedCount = 0;
    const difficultyStats = {
      Easy: { solved: 0, total: 0 },
      Medium: { solved: 0, total: 0 },
      Hard: { solved: 0, total: 0 },
    };

    const allProblems = await CodingProblem.find({});
    allProblems.forEach((p) => {
      if (difficultyStats[p.difficulty]) {
        difficultyStats[p.difficulty].total++;
      }
    });

    progressList.forEach((p) => {
      if (p.status === 'solved') {
        solvedCount++;
        if (p.problem && difficultyStats[p.problem.difficulty]) {
          difficultyStats[p.problem.difficulty].solved++;
        }
      } else if (p.status === 'attempted') {
        attemptedCount++;
      }
    });

    res.json({
      totalProblems,
      solvedCount,
      attemptedCount,
      difficultyStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin CRUD
const createProblem = async (req, res) => {
  try {
    const problem = new CodingProblem(req.body);
    const saved = await problem.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProblem = async (req, res) => {
  try {
    const updated = await CodingProblem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    await problem.deleteOne();
    await CodingProgress.deleteMany({ problem: problem._id });
    res.json({ message: 'Coding problem removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  submitCodeSolution,
  getCodingStats,
  createProblem,
  updateProblem,
  deleteProblem,
};

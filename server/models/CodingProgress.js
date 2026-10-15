const mongoose = require('mongoose');

const codingProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingProblem',
      required: true,
    },
    status: {
      type: String,
      enum: ['attempted', 'solved'],
      default: 'attempted',
    },
    solutionCode: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'javascript',
    },
    testsPassed: {
      type: Number,
      default: 0,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
    lastSubmittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One progress record per user per problem
codingProgressSchema.index({ user: 1, problem: 1 }, { unique: true });

module.exports = mongoose.model('CodingProgress', codingProgressSchema);

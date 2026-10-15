const mongoose = require('mongoose');

const codingProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Arrays', 'Strings', 'Searching', 'Sorting', 'Linked Lists', 'Basic Algorithms'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    description: {
      type: String,
      required: true,
    },
    inputFormat: {
      type: String,
      required: true,
    },
    outputFormat: {
      type: String,
      required: true,
    },
    constraints: {
      type: String,
      default: '1 <= N <= 10^5',
    },
    examples: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String },
      },
    ],
    tags: [{ type: String, trim: true }],
    starterTemplates: {
      javascript: {
        type: String,
        default: 'function solution(input) {\n  // Write your code here\n  return input;\n}',
      },
      python: {
        type: String,
        default: 'def solution(input):\n    # Write your code here\n    return input',
      },
    },
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        isHidden: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CodingProblem', codingProblemSchema);

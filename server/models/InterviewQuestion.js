const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['HR', 'Technical', 'Behavioral'],
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    roleCategory: {
      type: String,
      default: 'General Software Engineering',
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    frequency: {
      type: String,
      enum: ['Frequently Asked', 'Must Prepare', 'Common'],
      default: 'Frequently Asked',
    },
    keyPoints: [{ type: String, trim: true }],
    sampleAnswer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);

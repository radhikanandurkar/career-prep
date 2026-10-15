const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'],
    },
    topic: {
      type: String,
      default: 'General',
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      validate: [val => val.length === 4, 'Must provide exactly 4 options'],
      required: true,
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    explanation: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);

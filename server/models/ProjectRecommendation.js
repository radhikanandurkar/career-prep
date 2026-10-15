const mongoose = require('mongoose');

const projectRecommendationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    roleCategory: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    skillsLearned: [{ type: String, trim: true }],
    description: {
      type: String,
      required: true,
    },
    expectedOutcome: {
      type: String,
      required: true,
    },
    githubTemplateUrl: {
      type: String,
      default: 'https://github.com',
    },
    estimatedHours: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ProjectRecommendation', projectRecommendationSchema);

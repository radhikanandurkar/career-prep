const mongoose = require('mongoose');

const emergingSkillSchema = new mongoose.Schema(
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
      trim: true,
    },
    demandIndicator: {
      type: String,
      enum: ['Critical Demand', 'Very High', 'Trending', 'High Demand'],
      default: 'Very High',
    },
    growthRate: {
      type: String,
      default: '+35% YoY',
    },
    description: {
      type: String,
      required: true,
    },
    whyItMatters: {
      type: String,
      required: true,
    },
    relatedRoles: [{ type: String, trim: true }],
    recommendedLearningActions: [{ type: String, trim: true }],
    keyTools: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('EmergingSkill', emergingSkillSchema);

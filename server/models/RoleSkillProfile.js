const mongoose = require('mongoose');

const roleSkillProfileSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true,
    },
    averageSalaryRange: {
      type: String,
      default: '₹7 LPA - ₹16 LPA',
    },
    industryDemand: {
      type: String,
      enum: ['Moderate', 'High', 'Very High', 'Critical'],
      default: 'High',
    },
    requiredSkills: [
      {
        name: { type: String, required: true },
        requiredLevel: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced'],
          default: 'Intermediate',
        },
        weight: { type: Number, default: 5 },
        category: { type: String, default: 'Core Technical' },
        importance: {
          type: String,
          enum: ['Must-have', 'Important', 'Nice-to-have'],
          default: 'Must-have',
        },
      },
    ],
    preferredSkills: [{ type: String, trim: true }],
    recommendedLearningPath: [{ type: String, trim: true }],
    recommendedProjects: [
      {
        title: { type: String, required: true },
        difficulty: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced'],
          default: 'Intermediate',
        },
        description: { type: String },
        skills: [{ type: String }],
      },
    ],
    roadmapPhases: [
      {
        phaseNumber: { type: Number, required: true },
        phaseName: { type: String, required: true },
        description: { type: String },
        topics: [
          {
            id: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String },
            skills: [{ type: String }],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RoleSkillProfile', roleSkillProfileSchema);

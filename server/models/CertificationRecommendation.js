const mongoose = require('mongoose');

const certificationRecommendationSchema = new mongoose.Schema(
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
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    skillsCovered: [{ type: String, trim: true }],
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Foundational', 'Associate', 'Professional', 'Specialty'],
      default: 'Associate',
    },
    estimatedCost: {
      type: String,
      default: 'Free / Financial Aid Available',
    },
    officialUrl: {
      type: String,
      default: '#',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CertificationRecommendation', certificationRecommendationSchema);

const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    tier: {
      type: String,
      enum: ['Tier 1 Product', 'Service / Enterprise', 'High-Growth Startup', 'Global Tech Leader'],
      default: 'Tier 1 Product',
    },
    description: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    hiringStatus: {
      type: String,
      enum: ['Actively Hiring', 'Upcoming Campus Drive', 'Open Applications'],
      default: 'Actively Hiring',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema);

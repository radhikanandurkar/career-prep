const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
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
    location: {
      type: String,
      required: true,
      trim: true,
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Hybrid', 'Remote'],
      default: 'Hybrid',
    },
    experience: {
      type: String,
      default: 'Fresher / 0-1 Years',
    },
    eligibility: {
      type: String,
      default: 'B.Tech / B.E. / MCA (Min. 60% or 6.5 CGPA)',
    },
    salaryRange: {
      type: String,
      default: '₹8 LPA - ₹15 LPA',
    },
    requiredSkills: [{ type: String, trim: true }],
    preferredSkills: [{ type: String, trim: true }],
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: String,
      default: 'Open till vacancies fill',
    },
    applyUrl: {
      type: String,
      default: '#',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);

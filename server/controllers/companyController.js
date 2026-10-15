const Company = require('../models/Company');
const Job = require('../models/Job');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public / Private
const getCompanies = async (req, res) => {
  try {
    const { search, tier } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (tier && tier !== 'All') {
      query.tier = tier;
    }

    const companies = await Company.find(query).sort({ name: 1 });

    // Attach active job count for each company
    const enhancedCompanies = await Promise.all(
      companies.map(async (comp) => {
        const jobCount = await Job.countDocuments({ company: comp._id });
        return {
          ...comp.toObject(),
          jobCount,
        };
      })
    );

    res.json(enhancedCompanies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public / Private
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const jobs = await Job.find({ company: company._id });
    res.json({ company, jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin CRUD
const createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    const saved = await company.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    // Also remove associated jobs
    await Job.deleteMany({ company: company._id });
    await company.deleteOne();
    res.json({ message: 'Company and associated jobs removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
};

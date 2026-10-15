import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building2,
  MapPin,
  Sparkles,
  Filter,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  IndianRupee,
  Layers,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedMinMatch, setSelectedMinMatch] = useState('0');
  const [skillFilter, setSkillFilter] = useState('');

  // View Details Modal
  const [activeJob, setActiveJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedRole !== 'All') params.append('role', selectedRole);
      if (selectedCompany !== 'All') params.append('company', selectedCompany);
      if (selectedMinMatch !== '0') params.append('minMatch', selectedMinMatch);
      if (skillFilter) params.append('skill', skillFilter);

      const [jobsRes, compRes] = await Promise.all([
        api.get(`/jobs?${params.toString()}`),
        api.get('/companies'),
      ]);

      setJobs(jobsRes.data);
      setCompanies(compRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading job postings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedRole, selectedCompany, selectedMinMatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const getMatchColor = (pct) => {
    if (pct >= 75) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (pct >= 50) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (pct >= 30) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Campus Recruitment Alignment
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Job & Company Matching
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Real industry opportunities matched against your profile skills. Review your dynamically calculated match percentage, required skills, and campus eligibility.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-5">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            {/* Search */}
            <div className="lg:col-span-4">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Search Roles / Companies
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. SDE, Microsoft, React..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filter by Role */}
            <div className="lg:col-span-3">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Role Category
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Roles</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Cloud Engineer">Cloud Engineer</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
            </div>

            {/* Filter by Company */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Company
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Companies</option>
                {companies.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Match */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Min Match %
              </label>
              <select
                value={selectedMinMatch}
                onChange={(e) => setSelectedMinMatch(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">All Matches (0%+)</option>
                <option value="40">Moderate (40%+)</option>
                <option value="60">Good Fit (60%+)</option>
                <option value="75">Top Match (75%+)</option>
              </select>
            </div>

            <div className="lg:col-span-1">
              <Button type="submit" variant="primary" size="sm" className="w-full">
                Apply
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Jobs Results */}
      {loading ? (
        <Loader message="Evaluating student skill matches against jobs..." />
      ) : error ? (
        <ErrorState title="Error Loading Jobs" message={error} onRetry={fetchJobs} />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Matching Jobs Found"
          description="Try broadening your filter criteria or adjusting minimum match percentage."
          actionText="Reset Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedRole('All');
            setSelectedCompany('All');
            setSelectedMinMatch('0');
            fetchJobs();
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-500 px-1">
            <span>Showing <strong>{jobs.length}</strong> matching campus recruitment postings</span>
            <span>Sorted by Skill Match %</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <Card
                key={job._id}
                className="p-5 hover:border-blue-300 transition duration-200 border-slate-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{job.title}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-semibold text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">
                        {job.companyName}
                      </span>
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {job.workMode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                        {job.salaryRange}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {job.experience}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skill Match Breakdown */}
                    <div className="pt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-700 mr-1">Required:</span>
                      {job.requiredSkills?.map((sk, i) => {
                        const isMatched = (job.matchedSkills || []).includes(sk);
                        return (
                          <span
                            key={i}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              isMatched
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {isMatched ? '✓ ' : ''}{sk}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Score & Actions */}
                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-center sm:text-right">
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getMatchColor(
                          job.matchPercentage
                        )}`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{job.matchPercentage}% Skill Match</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Eligibility: {job.eligibility}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setActiveJob(job)}>
                        View Details
                      </Button>
                      <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" size="sm" icon={ExternalLink}>
                          Apply
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      <Modal
        isOpen={!!activeJob}
        onClose={() => setActiveJob(null)}
        title={activeJob?.title}
        subtitle={`${activeJob?.companyName} • ${activeJob?.location}`}
      >
        {activeJob && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Match Score</span>
                <p className="text-base font-extrabold text-blue-600">{activeJob.matchPercentage}% Alignment</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">CTC Package</span>
                <p className="text-sm font-bold text-slate-900">{activeJob.salaryRange}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                Role Description
              </h4>
              <p className="leading-relaxed text-slate-600">{activeJob.description}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                Eligibility Criteria
              </h4>
              <p className="leading-relaxed text-slate-600">{activeJob.eligibility}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                Required Technical Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeJob.requiredSkills?.map((s, i) => {
                  const isMatched = (activeJob.matchedSkills || []).includes(s);
                  return (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-md font-semibold text-xs border ${
                        isMatched
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      {isMatched ? '✓ Possessed: ' : '✗ Missing: '}{s}
                    </span>
                  );
                })}
              </div>
            </div>

            {activeJob.preferredSkills?.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Preferred Skills
                </h4>
                <div className="flex flex-wrap gap-1">
                  {activeJob.preferredSkills.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-slate-500 text-[11px]">Deadline: {activeJob.deadline}</span>
              <a href={activeJob.applyUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" icon={ExternalLink}>
                  Visit Official Application Portal
                </Button>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobsPage;

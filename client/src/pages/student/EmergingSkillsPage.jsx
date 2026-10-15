import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const EmergingSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEmergingSkills = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      if (searchQuery) params.append('search', searchQuery);

      const res = await api.get(`/emerging-skills?${params.toString()}`);
      setSkills(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading emerging skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergingSkills();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEmergingSkills();
  };

  const getDemandBadgeColor = (indicator) => {
    if (indicator === 'Critical Demand') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (indicator === 'Very High') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Industry Trend Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Emerging Skills & Market Demands
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Continuous tracking of fast-changing technological demands in modern tech hiring. Learn why each emerging skill matters, where it applies, and how to acquire it.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {['All', 'Artificial Intelligence', 'Cloud & Infrastructure', 'Security', 'DevOps', 'Software Engineering'].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search trending skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </Card>

      {/* Skills Content */}
      {loading ? (
        <Loader message="Loading emerging skills catalog..." />
      ) : error ? (
        <ErrorState title="Error" message={error} onRetry={fetchEmergingSkills} />
      ) : skills.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No Emerging Skills Found"
          description="Try selecting a different domain category or clearing your search query."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <Card key={skill._id} className="p-6 border-slate-200 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {skill.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{skill.title}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${getDemandBadgeColor(
                        skill.demandIndicator
                      )}`}
                    >
                      <Flame className="w-3 h-3 text-rose-500" />
                      <span>{skill.demandIndicator}</span>
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-emerald-600">
                      {skill.growthRate}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{skill.description}</p>

                {/* Why It Matters */}
                <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <h4 className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Why It Matters to Recruiters</span>
                  </h4>
                  <p className="text-xs text-blue-900 leading-relaxed">{skill.whyItMatters}</p>
                </div>

                {/* Related Roles */}
                <div>
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Applicable Job Roles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.relatedRoles?.map((r, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Learning Action */}
                <div>
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Recommended Learning Actions:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {skill.recommendedLearningActions?.map((act, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tools / Ecosystem */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {skill.keyTools?.map((tool, i) => (
                    <span key={i} className="text-[10px] font-mono bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergingSkillsPage;

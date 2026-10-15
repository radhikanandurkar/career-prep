import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Target,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Map,
  BookOpen,
  Code2,
  Filter,
  Check,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ReadinessGauge from '../../components/common/ReadinessGauge';
import ProgressBar from '../../components/common/ProgressBar';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';

const SkillGapPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, strong, improve, missing, actions
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');

  const fetchSkillGap = async (roleId = '') => {
    setLoading(true);
    setError('');
    try {
      const url = roleId ? `/skill-gap?roleId=${roleId}` : '/skill-gap';
      const res = await api.get(url);
      setData(res.data);
      if (res.data.targetRole) {
        setSelectedRoleId(res.data.targetRole._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error running skill gap analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load all roles for quick role comparison switcher
    const loadRoles = async () => {
      try {
        const rolesRes = await api.get('/target-role');
        setAvailableRoles(rolesRes.data);
      } catch (e) {
        console.error('Error fetching role catalog:', e);
      }
    };
    loadRoles();
    fetchSkillGap();
  }, []);

  const handleRoleChange = (e) => {
    const rId = e.target.value;
    setSelectedRoleId(rId);
    fetchSkillGap(rId);
  };

  if (loading) {
    return <Loader message="Analyzing student skills against industry benchmarks..." />;
  }

  if (error) {
    return <ErrorState title="Analysis Failed" message={error} onRetry={() => fetchSkillGap(selectedRoleId)} />;
  }

  if (!data?.hasTargetRole && !data?.analysis) {
    return (
      <EmptyState
        icon={Target}
        title="No Target Role Selected"
        description="To perform an AI Skill Gap Analysis, you must first choose a target career role from our industry catalog."
        actionText="Select Target Career Goal"
        onAction={() => window.location.href = '/career-goal'}
      />
    );
  }

  const { targetRole, analysis, readinessFactors } = data;
  const {
    overallMatch,
    strongSkills,
    skillsToImprove,
    missingSkills,
    recommendedActions,
    categoryBreakdown,
    strongCount,
    improveCount,
    missingCount,
    totalRequiredSkills,
  } = analysis || {};

  return (
    <div className="space-y-6">
      {/* Top Banner with Role Switcher */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Core Diagnostic Engine
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Deterministic Industry Benchmark</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Skill Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Evaluating your current technical skills and proficiency levels against real-world job requirements for{' '}
            <strong className="text-slate-900 font-semibold">{targetRole?.title}</strong>.
          </p>
        </div>

        {/* Quick Role Switcher */}
        <div className="shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Switch Target Role:
          </label>
          <select
            value={selectedRoleId}
            onChange={handleRoleChange}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {availableRoles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Analysis Gauge & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Match Percentage Meter */}
        <Card className="md:col-span-4 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-full flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800">Role Alignment</span>
            <span className="text-[11px] font-mono text-blue-600 font-semibold">Live Score</span>
          </div>

          <ReadinessGauge
            score={overallMatch}
            size={160}
            strokeWidth={14}
            label={`${targetRole?.title}`}
            subtitle="Industry Skill Match"
          />

          <div className="mt-4 pt-3 border-t border-slate-100 w-full text-xs text-slate-500 space-y-1 text-center">
            <p>
              Based on <span className="font-semibold text-slate-800">{totalRequiredSkills}</span> core skills demanded by top recruiters.
            </p>
            <p className="text-[11px] text-blue-600 font-medium">
              Target CTC: {targetRole?.averageSalaryRange}
            </p>
          </div>
        </Card>

        {/* 3 Status Summary Cards */}
        <div className="md:col-span-8 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Strong Skills */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Strong Skills</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-3xl font-extrabold text-emerald-950">{strongCount}</span>
                <p className="text-xs text-emerald-700 mt-1">
                  Skills you already possess at or above target industry proficiency.
                </p>
              </div>
            </div>

            {/* To Improve */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">To Improve</span>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-3xl font-extrabold text-amber-950">{improveCount}</span>
                <p className="text-xs text-amber-700 mt-1">
                  Skills you know but require higher proficiency levels.
                </p>
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Missing Skills</span>
                <XCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <span className="text-3xl font-extrabold text-rose-950">{missingCount}</span>
                <p className="text-xs text-rose-700 mt-1">
                  Core competencies required for this role not found on your profile.
                </p>
              </div>
            </div>
          </div>

          {/* Domain Category Breakdown */}
          {categoryBreakdown && Object.keys(categoryBreakdown).length > 0 && (
            <Card className="p-5" title="Category Competency Breakdown" subtitle="Proficiency distribution by domain">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(categoryBreakdown).map(([cat, score]) => (
                  <ProgressBar
                    key={cat}
                    label={cat}
                    value={score}
                    max={100}
                    color={score >= 70 ? 'emerald' : score >= 40 ? 'blue' : 'amber'}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Skills Comparison ({totalRequiredSkills})
        </button>
        <button
          onClick={() => setActiveTab('missing')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'missing'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Missing Skills ({missingCount})
        </button>
        <button
          onClick={() => setActiveTab('improve')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'improve'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Skills to Improve ({improveCount})
        </button>
        <button
          onClick={() => setActiveTab('strong')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'strong'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Strong Skills ({strongCount})
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'actions'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Recommended Actions ({recommendedActions?.length || 0})
        </button>
      </div>

      {/* Tab 1: Full Comparison Table */}
      {activeTab === 'all' && (
        <Card title="Skill-by-Skill Comparison Table" subtitle="Detailed audit of your capabilities vs benchmark specifications">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Skill</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Current Level</th>
                  <th className="px-4 py-3">Industry Level</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Strong Skills */}
                {strongSkills?.map((s, i) => (
                  <tr key={`strong-${i}`} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{s.name}</td>
                    <td className="px-4 py-3 text-slate-600">{s.category}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-700">{s.currentLevel}</td>
                    <td className="px-4 py-3 text-slate-700">{s.requiredLevel}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Strong Match
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">100%</td>
                  </tr>
                ))}

                {/* Skills to Improve */}
                {skillsToImprove?.map((s, i) => (
                  <tr key={`imp-${i}`} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{s.name}</td>
                    <td className="px-4 py-3 text-slate-600">{s.category}</td>
                    <td className="px-4 py-3 font-semibold text-amber-700">{s.currentLevel}</td>
                    <td className="px-4 py-3 text-slate-700">{s.requiredLevel}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Needs Improvement
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-amber-600">{s.matchPercentage}%</td>
                  </tr>
                ))}

                {/* Missing Skills */}
                {missingSkills?.map((s, i) => (
                  <tr key={`miss-${i}`} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{s.name}</td>
                    <td className="px-4 py-3 text-slate-600">{s.category}</td>
                    <td className="px-4 py-3 font-semibold text-rose-600">Not Acquired</td>
                    <td className="px-4 py-3 text-slate-700">{s.requiredLevel}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Missing Skill
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-rose-600">0%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 2: Missing Skills */}
      {activeTab === 'missing' && (
        <div className="space-y-4">
          {missingSkills?.length === 0 ? (
            <Card className="p-8 text-center text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">No missing skills!</p>
              <p className="text-xs">You have at least foundational familiarity with every required competency.</p>
            </Card>
          ) : (
            missingSkills?.map((s, i) => (
              <Card key={i} className="p-5 border-l-4 border-l-rose-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {s.category}
                      </span>
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {s.importance}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Required benchmark: <strong>{s.requiredLevel}</strong>. Currently absent from your student profile.
                    </p>
                  </div>
                  <Link to="/roadmap">
                    <Button variant="outline" size="sm" icon={Map}>
                      View in Roadmap
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Skills to Improve */}
      {activeTab === 'improve' && (
        <div className="space-y-4">
          {skillsToImprove?.length === 0 ? (
            <Card className="p-8 text-center text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">No intermediate level gaps!</p>
              <p className="text-xs">All acquired skills meet the benchmark level requirements.</p>
            </Card>
          ) : (
            skillsToImprove?.map((s, i) => (
              <Card key={i} className="p-5 border-l-4 border-l-amber-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {s.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Level Progression: <span className="font-semibold text-amber-700">{s.currentLevel}</span> &rarr; Target:{' '}
                      <span className="font-semibold text-slate-900">{s.requiredLevel}</span> ({s.matchPercentage}% partial match).
                    </p>
                  </div>
                  <Link to="/coding">
                    <Button variant="outline" size="sm" icon={Code2}>
                      Practice Coding
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Strong Skills */}
      {activeTab === 'strong' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {strongSkills?.map((s, i) => (
            <Card key={i} className="p-4 border-emerald-200 bg-emerald-50/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">{s.name}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[11px] text-slate-600 space-y-1">
                <p>Category: {s.category}</p>
                <p>
                  Verified Level: <strong className="text-emerald-700">{s.currentLevel}</strong>
                </p>
                <p className="text-emerald-800 font-semibold pt-1">Meets Campus Benchmark</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 5: Recommended Action Plan */}
      {(activeTab === 'all' || activeTab === 'actions') && (
        <Card
          title="Recommended Learning Action Items"
          subtitle="Specific steps generated to close your identified skill gaps"
          action={
            <Link to="/roadmap">
              <Button variant="primary" size="sm" icon={ArrowRight}>
                Go to Phased Roadmap
              </Button>
            </Link>
          }
        >
          {recommendedActions?.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              Outstanding! You have no critical skill gaps for this target role.
            </p>
          ) : (
            <div className="space-y-3">
              {recommendedActions?.map((action, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{action.skill}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          action.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {action.priority} Priority
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">({action.gap})</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{action.action}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <Link to="/roadmap">
                      <Button variant="outline" size="sm">
                        View Phase
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SkillGapPage;

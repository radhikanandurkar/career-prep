import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Target,
  CheckCircle2,
  Sparkles,
  Map,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import Badge from '../../components/common/Badge';

const CareerGoalPage = () => {
  const { user, refreshProfile } = useAuth();
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const fetchRoles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/target-role');
      setRoles(res.data);

      // Default select currently active role or first role
      const currentGoalId = typeof user?.targetRole === 'string' ? user.targetRole : user?.targetRole?._id;
      const matched = res.data.find((r) => r._id === currentGoalId);
      if (matched) {
        setSelectedRole(matched);
      } else if (res.data.length > 0) {
        setSelectedRole(res.data[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load career roles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSelectGoal = async (role) => {
    setSelecting(true);
    setSuccessMsg('');
    try {
      await api.post('/target-role/select', { roleId: role._id });
      setSelectedRole(role);
      await refreshProfile();
      setSuccessMsg(`Target career goal successfully set to ${role.title}!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating career goal.');
    } finally {
      setSelecting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading career roles and skill benchmarks..." />;
  }

  if (error && roles.length === 0) {
    return <ErrorState title="Error Loading Roles" message={error} onRetry={fetchRoles} />;
  }

  const currentGoalId = typeof user?.targetRole === 'string' ? user.targetRole : user?.targetRole?._id;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Target Career Objective
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Choose Your Target Career Role
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Selecting a target role configures your benchmark industry requirements, AI Skill Gap Analysis, personalized career roadmap, and placement job recommendations.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
          <div className="flex gap-2">
            <Link to="/skill-gap">
              <Button variant="primary" size="sm" icon={Sparkles}>
                Run Skill Gap Analysis
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Roles Selector Carousel / Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Available Career Roles ({roles.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {roles.map((r) => {
            const isCurrent = r._id === currentGoalId;
            const isSelected = selectedRole?._id === r._id;

            return (
              <button
                key={r._id}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase truncate">
                      {r.category}
                    </span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{r.title}</h4>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between">
                  <span>{r.requiredSkills?.length || 0} Skills</span>
                  <span className="font-semibold text-blue-600">{r.industryDemand}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Role Deep-Dive Specifications */}
      {selectedRole && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    {selectedRole.category}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Demand: {selectedRole.industryDemand}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {selectedRole.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  {selectedRole.description}
                </p>
                <div className="mt-2 text-xs text-slate-500">
                  Typical Campus Recruitment CTC:{' '}
                  <span className="font-semibold text-slate-800">{selectedRole.averageSalaryRange}</span>
                </div>
              </div>

              <div className="shrink-0 flex flex-wrap gap-2">
                {selectedRole._id === currentGoalId ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Current Target Goal
                    </span>
                    <Link to="/skill-gap">
                      <Button variant="primary" icon={Sparkles}>
                        Analyze My Skills
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    icon={Target}
                    isLoading={selecting}
                    onClick={() => handleSelectGoal(selectedRole)}
                  >
                    Set as My Target Career Goal
                  </Button>
                )}
              </div>
            </div>

            {/* Role Breakdown: Required Skills, Preferred Skills, Learning Path, Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
              {/* Required Skills */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Required Technical Skills ({selectedRole.requiredSkills?.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedRole.requiredSkills?.map((skill, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{skill.name}</span>
                        <span className="text-[11px] text-slate-500 ml-2">({skill.category})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold text-[11px]">
                          Target: {skill.requiredLevel}
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-200/70 text-slate-700 rounded text-[10px]">
                          {skill.importance}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preferred Skills */}
                {selectedRole.preferredSkills?.length > 0 && (
                  <div className="mt-5">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Preferred / Advantageous Skills
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRole.preferredSkills.map((pref, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200"
                        >
                          + {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Learning Path & Projects */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Recommended Learning Path
                  </h4>
                  <ol className="space-y-2 text-xs">
                    {selectedRole.recommendedLearningPath?.map((path, idx) => (
                      <li
                        key={idx}
                        className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg flex items-start gap-2.5 text-slate-700"
                      >
                        <span className="font-mono font-bold text-blue-600 shrink-0">{idx + 1}.</span>
                        <span>{path}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Recommended Capstone Projects
                  </h4>
                  <div className="space-y-3">
                    {selectedRole.recommendedProjects?.map((proj, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-900">{proj.title}</h5>
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                            {proj.difficulty}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.skills?.map((sk, sIdx) => (
                            <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CareerGoalPage;

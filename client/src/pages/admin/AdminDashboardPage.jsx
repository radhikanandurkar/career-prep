import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Building2,
  Briefcase,
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Award,
  ArrowRight,
  Plus,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import ReadinessGauge from '../../components/common/ReadinessGauge';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading administrator metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  if (loading) {
    return <Loader message="Loading administrator metrics and platform data..." />;
  }

  if (error) {
    return <ErrorState title="Error" message={error} onRetry={fetchAdminStats} />;
  }

  return (
    <div className="space-y-6">
      {/* Admin Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Platform Control & Institutional Oversight
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Administrator Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Manage benchmark career role competencies, recruitment partner companies, questions banks, and monitor student readiness metrics.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap gap-2">
            <Link to="/admin/companies">
              <Button variant="secondary" size="sm" icon={Plus}>
                Add Company
              </Button>
            </Link>
            <Link to="/admin/roles">
              <Button variant="secondary" size="sm" icon={Plus}>
                Add Career Role
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Registered Students</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{stats?.totalStudents || 0}</p>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Partner Companies</span>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">{stats?.totalCompanies || 0}</p>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Active Jobs</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats?.totalJobs || 0}</p>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Career Roles</span>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats?.totalJobRoles || 0}</p>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Questions</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats?.totalQuestions || 0}</p>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Avg Readiness</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{stats?.avgStudentReadiness || 0}%</p>
        </Card>
      </div>

      {/* Average Student Readiness & Most Common Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 p-6 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Average Student Readiness
          </span>
          <ReadinessGauge
            score={stats?.avgStudentReadiness || 0}
            size={150}
            strokeWidth={12}
            label="Campus Aggregate"
            subtitle="Student Cohort Index"
          />
          <p className="text-xs text-slate-500 mt-4 max-w-xs leading-relaxed text-center">
            Computed across enrolled student profiles against industry skill benchmarks.
          </p>
        </Card>

        {/* Most Common Skill Gaps Across Platform */}
        <Card className="lg:col-span-8 p-6 flex flex-col justify-between" title="Most Prevalent Skill Gaps in Campus Cohort" subtitle="Recruiter required skills most frequently missing among registered students">
          <div className="space-y-3">
            {stats?.mostCommonSkillGaps?.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Insufficient student profile records to calculate aggregated gap frequencies.
              </p>
            ) : (
              stats?.mostCommonSkillGaps?.map((gap, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    <span className="font-bold text-slate-900">{gap.skill}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 font-semibold">{gap.count} student gaps</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      High Priority Gap
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">Helps college placement cells organize targeted training workshops</span>
            <Link to="/admin/students" className="font-semibold text-blue-600 hover:underline">
              Inspect Student Records &rarr;
            </Link>
          </div>
        </Card>
      </div>

      {/* Fast Navigation to Admin Management Portals */}
      <Card title="Quick Management Portals" subtitle="Direct CRUD management over platform database collections">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link to="/admin/companies" className="p-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-center transition">
            <Building2 className="w-5 h-5 mx-auto text-blue-600 mb-1" />
            <span className="text-xs font-bold text-slate-800 block">Companies</span>
            <span className="text-[10px] text-slate-500">Manage directory</span>
          </Link>
          <Link to="/admin/roles" className="p-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-center transition">
            <Briefcase className="w-5 h-5 mx-auto text-purple-600 mb-1" />
            <span className="text-xs font-bold text-slate-800 block">Job Roles</span>
            <span className="text-[10px] text-slate-500">Skills & roadmaps</span>
          </Link>
          <Link to="/admin/aptitude" className="p-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-center transition">
            <BrainCircuit className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
            <span className="text-xs font-bold text-slate-800 block">Aptitude Bank</span>
            <span className="text-[10px] text-slate-500">MCQ questions</span>
          </Link>
          <Link to="/admin/coding" className="p-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-center transition">
            <BrainCircuit className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
            <span className="text-xs font-bold text-slate-800 block">Coding Tasks</span>
            <span className="text-[10px] text-slate-500">DSA challenges</span>
          </Link>
          <Link to="/admin/interview" className="p-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-center transition">
            <BrainCircuit className="w-5 h-5 mx-auto text-amber-600 mb-1" />
            <span className="text-xs font-bold text-slate-800 block">Interview Qs</span>
            <span className="text-[10px] text-slate-500">STAR answers</span>
          </Link>
          <Link to="/admin/students" className="p-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-center transition">
            <Users className="w-5 h-5 mx-auto text-blue-600 mb-1" />
            <span className="text-xs font-bold text-slate-800 block">Students</span>
            <span className="text-[10px] text-slate-500">Enrolled directory</span>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;

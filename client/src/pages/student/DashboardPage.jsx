import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Target,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Code2,
  MessagesSquare,
  FileText,
  Map,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Briefcase,
  ChevronRight,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ReadinessGauge from '../../components/common/ReadinessGauge';
import ProgressBar from '../../components/common/ProgressBar';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/progress');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard progress:', err);
      setError(err.response?.data?.message || 'Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader message="Loading your personalized dashboard and readiness data..." />;
  }

  if (error) {
    return <ErrorState title="Dashboard Error" message={error} onRetry={fetchDashboardData} />;
  }

  const { student, overallReadiness, skillGap, aptitude, coding, interview, resume, roadmap } = data || {};
  const hasTargetRole = student?.targetRoleTitle && student.targetRoleTitle !== 'Not Selected';

  return (
    <div className="space-y-6">
      {/* 1. Welcome Section & Career Goal Status */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Student Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || student?.name}!
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
              Branch: {user?.branch || student?.branch}
            </span>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Target Role: {hasTargetRole ? student.targetRoleTitle : 'No Role Selected Yet'}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-wrap items-center gap-3">
          {!hasTargetRole ? (
            <Link to="/career-goal">
              <Button variant="primary" icon={Target}>
                Select Target Career Goal
              </Button>
            </Link>
          ) : (
            <Link to="/skill-gap">
              <Button variant="primary" icon={Sparkles}>
                View Detailed Skill Gap
              </Button>
            </Link>
          )}
          <Link to="/career-goal">
            <Button variant="outline">
              Switch Goal
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Row: Overall Readiness & Skill Match */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Overall Career Readiness Gauge */}
        <Card className="md:col-span-5 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Overall Career Readiness</h3>
            <span className="text-[11px] text-slate-400 font-mono">Weighted Algorithm</span>
          </div>

          <div className="my-2">
            <ReadinessGauge
              score={overallReadiness || 0}
              size={150}
              strokeWidth={12}
              label="Campus Placement Index"
              subtitle="Combined Skill, Coding, Aptitude & Resume"
            />
          </div>

          <p className="text-xs text-slate-500 mt-4 max-w-xs leading-relaxed">
            Calculated from verified skill match ({skillGap?.skillMatch || 0}%), coding tasks, mock aptitude, and resume score.
          </p>
        </Card>

        {/* Skill Gap Summary */}
        <Card className="md:col-span-7 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Skill Gap Summary</h3>
                <p className="text-xs text-slate-500">Benchmark comparison for {student?.targetRoleTitle}</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                {skillGap?.skillMatch || 0}% Industry Match
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="block text-lg font-bold text-emerald-900">{skillGap?.strongCount || 0}</span>
                <span className="text-[11px] text-emerald-700 font-medium">Strong Skills</span>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-center">
                <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <span className="block text-lg font-bold text-amber-900">{skillGap?.improveCount || 0}</span>
                <span className="text-[11px] text-amber-700 font-medium">To Improve</span>
              </div>
              <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl text-center">
                <XCircle className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                <span className="block text-lg font-bold text-rose-900">{skillGap?.missingCount || 0}</span>
                <span className="text-[11px] text-rose-700 font-medium">Missing Skills</span>
              </div>
            </div>

            {/* Quick Skills list preview */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold text-slate-700">Top Skills to Master:</span>
                <Link to="/skill-gap" className="text-blue-600 hover:underline">
                  View Full Breakdown &rarr;
                </Link>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(skillGap?.missingSkills || []).slice(0, 4).map((ms) => (
                  <span key={ms.name} className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px]">
                    {ms.name} ({ms.requiredLevel})
                  </span>
                ))}
                {(skillGap?.skillsToImprove || []).slice(0, 3).map((is) => (
                  <span key={is.name} className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px]">
                    {is.name} ({is.gap})
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">Based on industry-calibrated recruitment rubrics</span>
            <Link to="/roadmap" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              <span>Open Roadmap</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      </div>

      {/* 3. Recommended Actions Section */}
      <Card
        title="Recommended Action Items"
        subtitle="Prioritized tasks to accelerate your campus placement readiness"
        action={
          <Link to="/progress" className="text-xs text-blue-600 hover:underline">
            All Analytics &rarr;
          </Link>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/coding"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
                <Code2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                Solve DSA Problems
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Practice Array, String, and Search patterns frequently asked in technical coding rounds.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 mt-3 block">
              {coding?.solved || 0} / {coding?.total || 8} Solved &rarr;
            </span>
          </Link>

          <Link
            to="/aptitude"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">
                Timed Aptitude Test
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Complete Quantitative, Reasoning, and Verbal drills to clear screening round cutoffs.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-3 block">
              Avg Score: {aptitude?.averageScore || 0}% &rarr;
            </span>
          </Link>

          <Link
            to="/interview"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5">
                <MessagesSquare className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition">
                Mock Interview Questions
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Prepare STAR-format answers for HR, behavioral, and core technical questions.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-purple-600 mt-3 block">
              {interview?.practiced || 0} / {interview?.total || 9} Practiced &rarr;
            </span>
          </Link>

          <Link
            to="/resume"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition">
                Optimize Resume
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Fill in missing project outcomes, tech stacks, and verify completeness score.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-amber-600 mt-3 block">
              Completeness: {resume?.completenessScore || 30}% &rarr;
            </span>
          </Link>
        </div>
      </Card>

      {/* 4. Progress Overview Section */}
      <Card
        title="Placement Preparation Progress Overview"
        subtitle="Tracking multi-module performance recorded in your database"
      >
        <div className="space-y-4">
          <ProgressBar
            label="Roadmap Completion"
            value={roadmap?.completed || 0}
            max={roadmap?.total || 10}
            color="blue"
          />
          <ProgressBar
            label="Coding Problems Solved"
            value={coding?.solved || 0}
            max={coding?.total || 8}
            color="indigo"
          />
          <ProgressBar
            label="Aptitude Average Score"
            value={aptitude?.averageScore || 0}
            max={100}
            color="emerald"
          />
          <ProgressBar
            label="Interview Preparation"
            value={interview?.practiced || 0}
            max={interview?.total || 9}
            color="amber"
          />
          <ProgressBar
            label="Resume Completeness"
            value={resume?.completenessScore || 30}
            max={100}
            color="blue"
          />
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;

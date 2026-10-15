import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Target,
  BrainCircuit,
  Code2,
  MessagesSquare,
  FileText,
  Map,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ReadinessGauge from '../../components/common/ReadinessGauge';
import ProgressBar from '../../components/common/ProgressBar';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const ProgressPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProgress = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/progress');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading progress analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  if (loading) {
    return <Loader message="Generating comprehensive student progress analytics..." />;
  }

  if (error) {
    return <ErrorState title="Error" message={error} onRetry={fetchProgress} />;
  }

  const {
    student,
    overallReadiness,
    skillGap,
    aptitude,
    coding,
    interview,
    resume,
    roadmap,
  } = data || {};

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Continuous Evaluation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Career Readiness & Progress Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Consolidated real-time analytics tracking your preparation milestones across technical skill match, coding problem counts, aptitude exams, and mock interviews.
            </p>
          </div>

          <div className="shrink-0">
            <Link to="/skill-gap">
              <Button variant="primary" icon={Sparkles}>
                Run New Analysis
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Gauge & Pillar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Readiness Meter */}
        <Card className="lg:col-span-4 p-6 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Placement Readiness Index
          </span>
          <ReadinessGauge
            score={overallReadiness || 0}
            size={160}
            strokeWidth={14}
            label="Overall Career Readiness"
            subtitle={`Target: ${student?.targetRoleTitle || 'Not Selected'}`}
          />
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 w-full text-center">
            Weighted across skills (35%), coding (20%), aptitude (15%), interview (15%), resume (15%).
          </div>
        </Card>

        {/* Multi-Pillar Scorecards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Skill Development Card */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Skill Development
                </span>
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-extrabold text-slate-900">{skillGap?.skillMatch || 0}%</span>
                  <span className="text-xs text-emerald-600 font-semibold">{skillGap?.strongCount || 0} Strong Skills</span>
                </div>
                <ProgressBar value={skillGap?.skillMatch || 0} max={100} showPercentage={false} color="blue" />
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>{skillGap?.improveCount || 0} Needs Improvement</span>
                  <span>{skillGap?.missingCount || 0} Missing</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3 text-right">
              <Link to="/skill-gap" className="text-xs font-semibold text-blue-600 hover:underline">
                View Gaps &rarr;
              </Link>
            </div>
          </Card>

          {/* Roadmap Card */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Roadmap Milestone
                </span>
                <Map className="w-4 h-4 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-extrabold text-slate-900">{roadmap?.percentage || 0}%</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {roadmap?.completed || 0} of {roadmap?.total || 0} Topics
                  </span>
                </div>
                <ProgressBar value={roadmap?.completed || 0} max={roadmap?.total || 10} showPercentage={false} color="blue" />
                <span className="text-[11px] text-slate-500 block pt-1">
                  Phased curriculum progression
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3 text-right">
              <Link to="/roadmap" className="text-xs font-semibold text-blue-600 hover:underline">
                Open Roadmap &rarr;
              </Link>
            </div>
          </Card>

          {/* Coding Card */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Coding DSA Practice
                </span>
                <Code2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-extrabold text-slate-900">{coding?.solved || 0} Solved</span>
                  <span className="text-xs text-slate-500 font-medium">of {coding?.total || 8} challenges</span>
                </div>
                <ProgressBar value={coding?.solved || 0} max={coding?.total || 8} showPercentage={false} color="indigo" />
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Easy: {coding?.difficultyBreakdown?.Easy?.solved || 0}</span>
                  <span>Medium: {coding?.difficultyBreakdown?.Medium?.solved || 0}</span>
                  <span>Hard: {coding?.difficultyBreakdown?.Hard?.solved || 0}</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3 text-right">
              <Link to="/coding" className="text-xs font-semibold text-blue-600 hover:underline">
                Practice Coding &rarr;
              </Link>
            </div>
          </Card>

          {/* Aptitude Card */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Aptitude Preparation
                </span>
                <BrainCircuit className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-extrabold text-slate-900">{aptitude?.averageScore || 0}%</span>
                  <span className="text-xs text-slate-500 font-medium">{aptitude?.testsTaken || 0} Tests Taken</span>
                </div>
                <ProgressBar value={aptitude?.averageScore || 0} max={100} showPercentage={false} color="emerald" />
                <span className="text-[11px] text-slate-500 block pt-1">
                  Quantitative, Reasoning & Verbal average
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3 text-right">
              <Link to="/aptitude" className="text-xs font-semibold text-emerald-600 hover:underline">
                Take Mock Test &rarr;
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Detailed Domain & Sub-module Progress Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interview Prep Progress */}
        <Card title="Interview Readiness" subtitle="HR, Technical & STAR behavioral practice">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Practiced Questions</span>
              <span className="text-xs font-bold text-purple-700">
                {interview?.practiced || 0} / {interview?.total || 9} ({interview?.percentage || 0}%)
              </span>
            </div>
            <ProgressBar value={interview?.percentage || 0} max={100} showPercentage={false} color="indigo" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Recruiters evaluate problem communication, technical depth, and conflict resolution stories.
            </p>
            <div className="pt-2">
              <Link to="/interview">
                <Button variant="outline" size="sm" icon={MessagesSquare}>
                  Practice Interview Questions
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Resume Completeness */}
        <Card title="Resume Optimization Score" subtitle="Completeness of industry-standard resume sections">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Resume Completeness</span>
              <span className="text-xs font-bold text-blue-700">{resume?.completenessScore || 30}%</span>
            </div>
            <ProgressBar value={resume?.completenessScore || 30} max={100} showPercentage={false} color="blue" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Ensures that all mandatory fields (projects, education, certifications, and contact links) are recruiter-ready.
            </p>
            <div className="pt-2">
              <Link to="/resume">
                <Button variant="outline" size="sm" icon={FileText}>
                  Update Resume Sections
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;

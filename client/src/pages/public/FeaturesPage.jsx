import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Map,
  Briefcase,
  TrendingUp,
  Award,
  Code2,
  BrainCircuit,
  MessagesSquare,
  FileText,
  LineChart,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const FeaturesPage = () => {
  const modules = [
    {
      icon: Sparkles,
      title: 'AI Skill Gap Analysis',
      desc: 'Evaluates your current skill proficiencies against target role benchmarks. Identifies strong skills, skills needing improvement, and critical missing skills with prioritized action plans.',
      points: ['Quantitative match score', 'Current level vs required level comparison', 'Severity categorization (Critical / Moderate / Minor)'],
    },
    {
      icon: Map,
      title: 'Personalized Career Roadmap',
      desc: 'Dynamic 5-phase career paths tailored to your target role. Interactive tracking allows marking topics completed and saving progress persistently.',
      points: ['Phased progression: Foundation → Development → Advanced → Projects → Placement', 'Topic-by-topic checkboxes', 'Visual phase completion metrics'],
    },
    {
      icon: Briefcase,
      title: 'Job & Company Matching',
      desc: 'Live listings with dynamic match scores calculated based on your profile skills. Filters allow drilling down by role, company name, skill keyword, and min match threshold.',
      points: ['Dynamic match % per job', 'Direct visibility into matched and missing requirements', 'Company hiring status & eligibility details'],
    },
    {
      icon: TrendingUp,
      title: 'Emerging Skills Tracker',
      desc: 'Deep dive into industry shifts like Generative AI, Cloud Native architectures, Application Security, and MLOps, with growth indicators and actionable study recommendations.',
      points: ['YoY market demand stats', 'Key tooling ecosystems', 'Role crossover mapping'],
    },
    {
      icon: BrainCircuit,
      title: 'Aptitude Practice System',
      desc: 'Real timed aptitude tests covering Quantitative, Logical Reasoning, and Verbal Ability with question palettes, instant grading, and detailed explanations.',
      points: ['Countdown timer with auto-submit protection', 'Immediate score & detailed question review', 'Historical test attempt tracking in MongoDB'],
    },
    {
      icon: Code2,
      title: 'Coding Practice Module',
      desc: 'Practice core DSA patterns across Arrays, Strings, Searching, Sorting, and Linked Lists. Test code submissions and track difficulty-wise progress.',
      points: ['Curated campus recruitment problems', 'Starter code templates in JS and Python', 'Solved vs attempted status tracking'],
    },
    {
      icon: MessagesSquare,
      title: 'Interview Preparation',
      desc: 'Structured HR, Technical, and Behavioral interview questions with key points and STAR method sample answers. Save personal preparation notes per question.',
      points: ['HR, Technical, and Behavioral categories', 'Frequently asked placement questions', 'Personal answer notes & practiced tracking'],
    },
    {
      icon: FileText,
      title: 'Resume Builder & Scorer',
      desc: 'Interactive resume editor with live formatting, automated completeness percentage, and concrete gap improvement suggestions.',
      points: ['Standardized clean professional layout', 'Section-by-section completeness calculation', 'Browser print-ready formatting'],
    },
    {
      icon: LineChart,
      title: 'Comprehensive Progress Tracking',
      desc: 'A unified single-view dashboard synthesizing career readiness across skill matching, coding problem counts, aptitude scores, and interview preparedness.',
      points: ['Weighted Overall Career Readiness gauge', 'Module-by-module breakdown', 'Real-time database sync'],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1">
        <section className="py-16 bg-slate-50 border-b border-slate-200 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Platform Features
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              An Integrated Suite Built for Engineering Students
            </h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Every module is designed to eliminate ambiguity, provide actionable learning targets, and track measurable placement progress.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Card key={m.title} className="p-6 flex flex-col justify-between hover:border-blue-300 transition duration-200">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{m.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{m.desc}</p>
                    <ul className="space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-700">
                      {m.points.map((pt, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 text-center bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-3xl mx-auto space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Experience the Full Flow</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Create your account to unlock personalized recommendations and persistent progress tracking.
            </p>
            <Link to="/register">
              <Button variant="primary" icon={ArrowRight}>
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default FeaturesPage;

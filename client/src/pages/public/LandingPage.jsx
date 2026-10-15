import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Map,
  Briefcase,
  TrendingUp,
  Award,
  CheckCircle2,
  Code2,
  BrainCircuit,
  MessagesSquare,
  FileText,
  LineChart,
  ShieldAlert,
  GraduationCap,
  ChevronRight,
  Layers,
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const LandingPage = () => {
  const steps = [
    { num: '01', title: 'Create Profile', desc: 'Add your branch, academic year, and existing technical skills.' },
    { num: '02', title: 'Set Career Goal', desc: 'Choose your desired industry role (e.g. Full Stack, AI/ML, Cloud).' },
    { num: '03', title: 'Analyze Skill Gap', desc: 'Evaluate your proficiency against actual industry benchmarks.' },
    { num: '04', title: 'Follow Roadmap', desc: 'Execute phased learning milestones and track your progress.' },
    { num: '05', title: 'Track Readiness', desc: 'Practice aptitude, coding, interview questions, and measure placement readiness.' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI Skill Gap Analysis',
      desc: 'Compares your actual technical skills and proficiency levels against real industry job requirements to highlight strong, developing, and missing skills.',
      badge: 'Core Feature',
    },
    {
      icon: Map,
      title: 'Personalized Career Roadmap',
      desc: 'Structured 5-phase career progression paths spanning Foundations, Development, Advanced Topics, Capstone Projects, and Placement Preparation.',
      badge: 'Phased Learning',
    },
    {
      icon: Briefcase,
      title: 'Industry & Job Matching',
      desc: 'Real job openings from leading tech companies with dynamically calculated match percentages based on your specific profile skills.',
      badge: 'Dynamic Match %',
    },
    {
      icon: TrendingUp,
      title: 'Emerging Skill Tracking',
      desc: 'Continuous monitoring of fast-evolving market requirements including Generative AI, Cloud Native, Cybersecurity, and Modern DevOps.',
      badge: 'Market Demands',
    },
    {
      icon: Award,
      title: 'Career Readiness Support',
      desc: 'Holistic career-readiness scoring combining skill match, coding problem progress, timed aptitude tests, mock interview drills, and resume completeness.',
      badge: 'Placement Ready',
    },
  ];

  const readinessPillars = [
    { title: 'Coding Practice', desc: 'Curated DSA challenges in Arrays, Strings, Searching, Sorting, and Linked Lists with instant validation.', icon: Code2 },
    { title: 'Aptitude Preparation', desc: 'Timed mock practice tests covering Quantitative Aptitude, Logical Reasoning, and Verbal Ability.', icon: BrainCircuit },
    { title: 'Interview Preparation', desc: 'Comprehensive HR, Technical, and Behavioral interview questions with structured STAR answers.', icon: MessagesSquare },
    { title: 'Resume Improvement', desc: 'Section-by-section completeness scoring and concrete guidance to optimize placement resumes.', icon: FileText },
    { title: 'Recommended Projects', desc: 'Hands-on capstone project ideas mapped directly to target career roles and identified skill gaps.', icon: Layers },
    { title: 'Industry Certifications', desc: 'Verified cloud, development, and cybersecurity credentials recommended for campus recruitment.', icon: Award },
    { title: 'Company & Job Matching', desc: 'Discover eligibility and custom skill alignment for campus recruitment drives and off-campus roles.', icon: Briefcase },
    { title: 'Continuous Progress Tracking', desc: 'Transparent, data-backed metrics measuring development across every phase of your preparation.', icon: LineChart },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-100 bg-linear-to-b from-slate-50/70 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>CareerPrep – Bridging Skills & Industry Needs</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Bridge the Gap Between <span className="text-blue-600">Your Skills</span> and Industry Needs
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                CareerPrep helps students identify skill gaps, build personalized career roadmaps, practice placement skills, and prepare for industry-demanded roles.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/register">
                  <Button variant="primary" size="lg" icon={ArrowRight}>
                    Get Started
                  </Button>
                </Link>
                <Link to="/features">
                  <Button variant="outline" size="lg">
                    Explore Features
                  </Button>
                </Link>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Real Authentication & MongoDB Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>College Hackathon Solution</span>
                </div>
              </div>
            </div>

            {/* Right Illustration: Systematic Clean Dashboard Mockup Visual */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 space-y-5">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-slate-700 ml-2">Student Analysis Preview</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                    Role Match
                  </span>
                </div>

                {/* Simulated Readiness Card */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500">Target Role</span>
                    <h4 className="text-sm font-bold text-slate-900">Full Stack Developer</h4>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">72% Industry Match</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-blue-600 border-t-emerald-500 flex items-center justify-center font-bold text-sm text-slate-800 bg-white shadow-xs">
                    72%
                  </div>
                </div>

                {/* Skill Gap Breakdown Preview */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-700">JavaScript / React</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Strong Skill</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-2 rounded-full w-4/5" />
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="font-medium text-slate-700">REST APIs / Node.js</span>
                    <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">Needs Improvement</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-2 rounded-full w-3/5" />
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="font-medium text-slate-700">Docker & DevOps Basics</span>
                    <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded">Missing Skill</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-2 rounded-full w-1/5" />
                  </div>
                </div>

                {/* Readiness Pills */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="block text-xs font-bold text-slate-800">8/10</span>
                    <span className="text-[10px] text-slate-500">Aptitude Avg</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="block text-xs font-bold text-slate-800">6 Solved</span>
                    <span className="text-[10px] text-slate-500">Coding Tests</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="block text-xs font-bold text-slate-800">85%</span>
                    <span className="text-[10px] text-slate-500">Resume Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why CareerPrep? Section (5 Feature Cards directly based on project presentation) */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Why CareerPrep?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Directly Solving the Campus-to-Corporate Skill Divide
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Curriculum alone often leaves gaps when facing modern placement rounds. CareerPrep introduces systematic, structured alignment with industry demands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="p-6 hover:border-blue-300 transition duration-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50/80 px-2.5 py-0.5 rounded-full border border-blue-100">
                        {f.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{f.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
                    <span>Explore module</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How CareerPrep Works (5-Step Visual) */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Systematic Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How CareerPrep Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              A clear 5-step journey transforming theoretical classroom skills into verified campus placement readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((st, i) => (
              <div
                key={st.num}
                className="relative bg-slate-50 border border-slate-200/80 rounded-xl p-5 text-left flex flex-col justify-between hover:bg-white hover:border-blue-300 transition shadow-2xs"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600 block mb-2">{st.num}</span>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{st.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shadow-xs">
                    &rarr;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Industry Readiness Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Complete Placement Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Built for Industry Readiness
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Everything required to clear technical rounds, aptitude shortlists, and HR discussions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {readinessPillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-blue-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to Bridge Your Skill Gap and Prepare for Placement?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Register your student profile today, select your target industry career role, and access tailored gap analysis and roadmaps.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button variant="secondary" size="lg" icon={ArrowRight}>
                Create Student Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default LandingPage;

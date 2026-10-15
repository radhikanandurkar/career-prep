import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  Target,
  Sparkles,
  Map,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const HowItWorksPage = () => {
  const steps = [
    {
      step: 'Step 1',
      title: 'Create Your Student Profile',
      desc: 'Register with your college branch, academic graduation year, current technical skills, and domain interests. Your profile serves as the baseline data point for all comparative matching.',
      details: [
        'Input known programming languages and libraries',
        'Set your self-assessed proficiency (Beginner, Intermediate, Advanced)',
        'Add engineering branch and expected placement cycle',
      ],
      icon: UserCheck,
    },
    {
      step: 'Step 2',
      title: 'Select Your Target Career Goal',
      desc: 'Browse standardized industry roles such as Full Stack Developer, Backend Developer, Data Analyst, Cloud Engineer, or AI/ML Engineer. Select the role you want to prepare for.',
      details: [
        'Review mandatory vs preferred skills for each role',
        'Examine expected compensation ranges and industry demand',
        'Persist your selected goal to activate tailored recommendations',
      ],
      icon: Target,
    },
    {
      step: 'Step 3',
      title: 'Run AI Skill Gap Analysis',
      desc: 'The platform calculates an objective match percentage and categorizes your skills into Strong Skills, Skills Needing Improvement, and Missing Skills, with clear action items.',
      details: [
        'Mathematical gap scoring based on industry benchmarks',
        'Specific level comparisons (e.g. Beginner → Intermediate)',
        'Recommended concrete actions to close high-priority gaps',
      ],
      icon: Sparkles,
    },
    {
      step: 'Step 4',
      title: 'Follow the 5-Phase Roadmap',
      desc: 'Work through an actionable step-by-step roadmap spanning Foundations, Development, Advanced Topics, Capstone Projects, and Placement Preparation. Check off topics as you finish them.',
      details: [
        'Sequential phased milestones preventing tutorial hell',
        'Interactive checklist stored in your MongoDB account',
        'Real-time phase completion percentage updates',
      ],
      icon: Map,
    },
    {
      step: 'Step 5',
      title: 'Practice & Measure Career Readiness',
      desc: 'Reinforce preparation with timed aptitude quizzes, coding problems, interview flashcards, and resume optimization. Watch your Overall Career Readiness meter climb towards 100%.',
      details: [
        'Timed Quantitative, Logical, and Verbal practice',
        'DSA coding problems with instant test validation',
        'Integrated career readiness scoring for placement drives',
      ],
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1">
        <section className="py-16 bg-slate-50 border-b border-slate-200 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              User Journey
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How CareerPrep Guides You to Placement Success
            </h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A systematic 5-step framework designed to take you from uncertain student to verified industry-ready candidate.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={st.step} className="flex flex-col md:flex-row gap-6 items-start relative">
                {/* Step badge */}
                <div className="flex md:flex-col items-center gap-3 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">{st.step}</span>
                </div>

                {/* Content Card */}
                <Card className="flex-1 p-6 bg-white border-slate-200 shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{st.desc}</p>
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Key Highlights:</h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {st.details.map((d, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </div>
            );
          })}

          <div className="text-center pt-8">
            <Link to="/register">
              <Button variant="primary" size="lg" icon={ArrowRight}>
                Start Step 1: Create Profile
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default HowItWorksPage;

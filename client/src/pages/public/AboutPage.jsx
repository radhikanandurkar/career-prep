import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  GraduationCap,
  Target,
  Users,
  Building,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              About CareerPrep
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Bridging the Divide Between Engineering Education and Industry Demands
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              A comprehensive project addressing the core problem: “Challenges in aligning skill development programs with industry requirements and emerging job market demands.”
            </p>
          </div>
        </section>

        {/* The Core Challenge */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">The Problem</span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                The Campus-to-Industry Disconnect
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                While engineering colleges provide fundamental theoretical foundations, recruiters look for applied skills: modern frameworks, scalable API architecture, cloud fluency, real-world project outcomes, and disciplined coding practice.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Students often lack objective benchmarks to know where they stand until campus placement season arrives—leading to missed opportunities and anxiety.
              </p>
            </div>

            <Card className="p-6 bg-slate-50 border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                Industry Realities
              </h3>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span><strong>Static Syllabi:</strong> Curriculum updates occur every few years, while tech stacks evolve every few months.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span><strong>Ambiguity in Preparation:</strong> Students are uncertain which specific DSA or development topics are prioritized by recruiters.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span><strong>Disjointed Tools:</strong> Students jump between disparate sites for aptitude, coding, resumes, and job listings.</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* The Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-8 border-t border-slate-200">
            <Card className="p-6 bg-blue-50/50 border-blue-200 space-y-4 order-2 md:order-1">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider border-b border-blue-200 pb-2">
                The CareerPrep Framework
              </h3>
              <ul className="space-y-3 text-xs text-blue-900">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Calibrated Role Benchmarks:</strong> Standardized skill profiles for roles like Full Stack, Backend, Data Science, AI/ML, and Cloud.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Deterministic Gap Engine:</strong> Pinpoints exact missing skills and level deficiencies without hallucinated claims.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>End-to-End Placement Workflow:</strong> From gap diagnosis to phased roadmaps, coding exercises, aptitude quizzes, and resume scoring.</span>
                </li>
              </ul>
            </Card>

            <div className="space-y-4 order-1 md:order-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">The Solution</span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Systematic, Measurable Readiness
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                CareerPrep delivers a unified platform that directly aligns student efforts with what tech companies actually evaluate.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                By maintaining structured databases of job criteria, questions, and roadmaps, students always know their current readiness percentage and their exact next learning action.
              </p>
              <div>
                <Link to="/register">
                  <Button variant="primary" icon={ArrowRight}>
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default AboutPage;

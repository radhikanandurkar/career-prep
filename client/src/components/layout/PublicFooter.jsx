import { Compass, GraduationCap, Globe, ShieldCheck } from 'lucide-react';

const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CareerPrep</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Bridging the gap between engineering curriculum and emerging industry job demands through systematic gap analysis, practice, and placement tracking.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>College & Placement Cell Project</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Readiness Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/features" className="hover:text-white transition">AI Skill Gap Analysis</Link></li>
              <li><Link to="/features" className="hover:text-white transition">Personalized Career Roadmap</Link></li>
              <li><Link to="/features" className="hover:text-white transition">Company & Job Matching</Link></li>
              <li><Link to="/features" className="hover:text-white transition">Emerging Skills Tracker</Link></li>
              <li><Link to="/features" className="hover:text-white transition">Aptitude & Coding Practice</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-white transition">About the Project</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Student Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Create Account</Link></li>
            </ul>
          </div>

          {/* Project Presentation Info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Academic Presentation
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built with React, Express, MongoDB, and industry-calibrated role skill benchmarks.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 text-[11px] text-slate-300">
              <span className="font-semibold text-white">Status: </span>
              Production Ready Full-Stack Web Application
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerPrep – Bridging Skills & Industry Needs. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400">Strict Auth & Verification</span>
            <span className="hover:text-slate-400">Industry-Aligned Schema</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;

import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Target,
  Sparkles,
  Map,
  Briefcase,
  TrendingUp,
  BrainCircuit,
  Code2,
  MessagesSquare,
  FileText,
  FolderGit2,
  LineChart,
  LogOut,
  Menu,
  X,
  Compass,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Career Goal', path: '/career-goal', icon: Target },
    { name: 'Skill Gap', path: '/skill-gap', icon: Sparkles },
    { name: 'Career Roadmap', path: '/roadmap', icon: Map },
    { name: 'Jobs & Companies', path: '/jobs', icon: Briefcase },
    { name: 'Emerging Skills', path: '/emerging-skills', icon: TrendingUp },
    { name: 'Aptitude', path: '/aptitude', icon: BrainCircuit },
    { name: 'Coding', path: '/coding', icon: Code2 },
    { name: 'Interview', path: '/interview', icon: MessagesSquare },
    { name: 'Resume', path: '/resume', icon: FileText },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Progress', path: '/progress', icon: LineChart },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static shrink-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">CareerPrep</span>
              <span className="block text-[10px] text-blue-400 font-medium">Industry Readiness</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Role Ribbon in Sidebar */}
        <div className="px-4 py-3 mx-3 my-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>Target Goal</span>
          </div>
          <p className="text-xs font-medium text-white truncate mt-0.5">
            {user?.targetRoleTitle || (typeof user?.targetRole === 'string' ? user?.targetRole : user?.targetRole?.title) || 'Role Not Selected'}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.name}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-200" />}
              </Link>
            );
          })}

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-amber-300 hover:bg-slate-800 hover:text-amber-200 transition-colors mt-2 border border-amber-500/30"
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Admin Portal</span>
            </Link>
          )}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          <div className="flex items-center justify-between px-2 py-1.5">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Student'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.branch || user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600 hidden sm:block" />
              <h1 className="text-sm sm:text-base font-semibold text-slate-800">
                CareerPrep Student Platform
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">{user?.graduationYear ? `Batch of ${user?.graduationYear}` : 'Student Account'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-slate-600 hover:text-red-600 flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-slate-100 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;

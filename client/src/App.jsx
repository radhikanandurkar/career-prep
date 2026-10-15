import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import FeaturesPage from './pages/public/FeaturesPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Layouts
import StudentLayout from './components/layout/StudentLayout';
import AdminLayout from './components/layout/AdminLayout';

// Student Pages
import DashboardPage from './pages/student/DashboardPage';
import ProfilePage from './pages/student/ProfilePage';
import CareerGoalPage from './pages/student/CareerGoalPage';
import SkillGapPage from './pages/student/SkillGapPage';
import RoadmapPage from './pages/student/RoadmapPage';
import JobsPage from './pages/student/JobsPage';
import EmergingSkillsPage from './pages/student/EmergingSkillsPage';
import AptitudePage from './pages/student/AptitudePage';
import CodingPage from './pages/student/CodingPage';
import InterviewPage from './pages/student/InterviewPage';
import ResumePage from './pages/student/ResumePage';
import ProjectsPage from './pages/student/ProjectsPage';
import ProgressPage from './pages/student/ProgressPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageCompaniesPage from './pages/admin/ManageCompaniesPage';
import ManageRolesPage from './pages/admin/ManageRolesPage';
import ManageAptitudePage from './pages/admin/ManageAptitudePage';
import ManageCodingPage from './pages/admin/ManageCodingPage';
import ManageInterviewPage from './pages/admin/ManageInterviewPage';
import ManageEmergingPage from './pages/admin/ManageEmergingPage';
import StudentListPage from './pages/admin/StudentListPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Student Routes */}
          <Route
            element={
              <ProtectedRoute>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/career-goal" element={<CareerGoalPage />} />
            <Route path="/skill-gap" element={<SkillGapPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/emerging-skills" element={<EmergingSkillsPage />} />
            <Route path="/aptitude" element={<AptitudePage />} />
            <Route path="/coding" element={<CodingPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="companies" element={<ManageCompaniesPage />} />
            <Route path="roles" element={<ManageRolesPage />} />
            <Route path="aptitude" element={<ManageAptitudePage />} />
            <Route path="coding" element={<ManageCodingPage />} />
            <Route path="interview" element={<ManageInterviewPage />} />
            <Route path="emerging-skills" element={<ManageEmergingPage />} />
            <Route path="students" element={<StudentListPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import {
  User,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  Target,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch: '',
    academicYear: '',
    graduationYear: 2026,
    profileSummary: '',
    skills: [],
    interests: [],
  });

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState('Technical');
  const [newInterest, setNewInterest] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/auth/profile');
        const p = res.data;
        setFormData({
          name: p.name || '',
          email: p.email || '',
          branch: p.branch || 'Computer Science and Engineering',
          academicYear: p.academicYear || '3rd Year',
          graduationYear: p.graduationYear || 2026,
          profileSummary: p.profileSummary || '',
          skills: p.skills || [],
          interests: p.interests || [],
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const exists = formData.skills.some(
      (s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
    );
    if (exists) {
      setFeedback({ type: 'error', message: 'Skill already exists in your profile.' });
      return;
    }

    const updatedSkills = [
      ...formData.skills,
      {
        name: newSkillName.trim(),
        level: newSkillLevel,
        category: newSkillCategory,
      },
    ];

    setFormData((prev) => ({ ...prev, skills: updatedSkills }));
    setNewSkillName('');
    setFeedback({ type: 'success', message: 'Skill added. Click "Save Profile" to persist changes.' });
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleSkillLevelChange = (index, newLevel) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index].level = newLevel;
    setFormData((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    if (formData.interests.includes(newInterest.trim())) return;
    setFormData((prev) => ({
      ...prev,
      interests: [...prev.interests, newInterest.trim()],
    }));
    setNewInterest('');
  };

  const handleRemoveInterest = (idx) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      const res = await api.put('/auth/profile', formData);
      updateUser(res.data);
      setFeedback({ type: 'success', message: 'Profile updated successfully in MongoDB!' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader message="Loading profile..." />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal academic background and technical skill set
          </p>
        </div>
        <Button
          variant="primary"
          icon={Save}
          isLoading={isSaving}
          onClick={handleSaveProfile}
        >
          Save Profile Changes
        </Button>
      </div>

      {feedback.message && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Basic Academic Info */}
      <Card title="Academic & Personal Details" subtitle="Information utilized in job eligibility matching">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Registered)</label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Branch / Major</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g. Computer Science and Engineering"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
            <select
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year (Pre-final)</option>
              <option value="4th Year">4th Year (Final)</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Career Goal Status</label>
            <div className="flex items-center gap-2 pt-1 text-sm font-semibold text-slate-800">
              <Target className="w-4 h-4 text-blue-600" />
              <span>{user?.targetRoleTitle || 'None Selected'}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Profile Summary</label>
          <textarea
            name="profileSummary"
            rows="3"
            value={formData.profileSummary}
            onChange={handleChange}
            placeholder="Write a brief 2-3 sentence summary about your engineering focus and career ambitions..."
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Technical Skills Inventory */}
      <Card
        title="Technical Skills Inventory"
        subtitle="These skills directly drive your AI Skill Gap Analysis and Job Match score"
      >
        {/* Add Skill Form */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl mb-6">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Add New Skill</h4>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Skill Name</label>
              <input
                type="text"
                placeholder="e.g. React, MongoDB, Python, Docker"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Proficiency Level</label>
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Technical">Technical</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Data & AI">Data & AI</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <Button variant="primary" size="sm" icon={Plus} onClick={handleAddSkill} className="w-full">
                Add Skill
              </Button>
            </div>
          </div>
        </div>

        {/* Existing Skills Table */}
        {formData.skills.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            No skills added yet. Use the form above to add your technical skills.
          </p>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Skill Name</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Proficiency Level</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.skills.map((skill, index) => (
                  <tr key={index} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-2.5 font-semibold text-slate-900">{skill.name}</td>
                    <td className="px-4 py-2.5 text-slate-600">{skill.category || 'Technical'}</td>
                    <td className="px-4 py-2.5">
                      <select
                        value={skill.level || 'Intermediate'}
                        onChange={(e) => handleSkillLevelChange(index, e.target.value)}
                        className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Domain Interests */}
      <Card title="Areas of Interest" subtitle="Domains you are eager to explore and build projects in">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add an interest (e.g. Distributed Systems, FinTech, WebSockets)"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Button variant="outline" size="sm" icon={Plus} onClick={handleAddInterest}>
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.interests.map((interest, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium border border-slate-200"
            >
              <span>{interest}</span>
              <button
                type="button"
                onClick={() => handleRemoveInterest(i)}
                className="text-slate-400 hover:text-red-500"
              >
                &times;
              </button>
            </span>
          ))}
          {formData.interests.length === 0 && (
            <p className="text-xs text-slate-400">No interests specified.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;

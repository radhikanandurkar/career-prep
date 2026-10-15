import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const ManageRolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    category: 'Software Engineering',
    description: '',
    averageSalaryRange: '₹8 LPA - ₹16 LPA',
    industryDemand: 'High',
    requiredSkillsText: 'JavaScript (Advanced), React (Intermediate), Node.js (Intermediate), MongoDB (Intermediate)',
    preferredSkillsText: 'TypeScript, Docker, AWS',
  });

  const fetchRoles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/target-role');
      setRoles(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching career roles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openAddModal = () => {
    setEditingRole(null);
    setForm({
      title: '',
      category: 'Software Engineering',
      description: '',
      averageSalaryRange: '₹8 LPA - ₹18 LPA',
      industryDemand: 'High',
      requiredSkillsText: 'JavaScript (Advanced), React (Intermediate), Node.js (Intermediate)',
      preferredSkillsText: 'TypeScript, Docker, AWS',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    const skillsText = (role.requiredSkills || [])
      .map((s) => `${s.name} (${s.requiredLevel})`)
      .join(', ');
    const prefText = (role.preferredSkills || []).join(', ');

    setForm({
      title: role.title,
      category: role.category,
      description: role.description,
      averageSalaryRange: role.averageSalaryRange || '₹8 LPA - ₹16 LPA',
      industryDemand: role.industryDemand || 'High',
      requiredSkillsText: skillsText,
      preferredSkillsText: prefText,
    });
    setIsModalOpen(true);
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm('Are you sure you want to delete this career role benchmark?')) return;
    try {
      await api.delete(`/target-role/${id}`);
      setRoles(roles.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting role.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Parse required skills text into objects
    const parsedSkills = form.requiredSkillsText
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((item) => {
        const match = item.match(/^(.*?)\s*\((.*?)\)$/);
        if (match) {
          return {
            name: match[1].trim(),
            requiredLevel: match[2].trim(),
            weight: 8,
            category: 'Core Technical',
          };
        }
        return {
          name: item,
          requiredLevel: 'Intermediate',
          weight: 7,
          category: 'Core Technical',
        };
      });

    // Parse preferred skills
    const parsedPreferred = form.preferredSkillsText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      averageSalaryRange: form.averageSalaryRange,
      industryDemand: form.industryDemand,
      requiredSkills: parsedSkills,
      preferredSkills: parsedPreferred,
    };

    try {
      if (editingRole) {
        const res = await api.put(`/target-role/${editingRole._id}`, payload);
        setRoles(roles.map((r) => (r._id === editingRole._id ? res.data : r)));
      } else {
        const res = await api.post('/target-role', payload);
        setRoles([...roles, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving career role.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Job Roles & Skills</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain benchmark required skills, proficiency levels, and demand ratings
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAddModal}>
          Add Career Role
        </Button>
      </div>

      {loading ? (
        <Loader message="Loading career roles..." />
      ) : error ? (
        <ErrorState title="Error" message={error} onRetry={fetchRoles} />
      ) : (
        <Card className="overflow-hidden border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Role Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Required Skills Count</th>
                  <th className="px-4 py-3">Average CTC</th>
                  <th className="px-4 py-3">Industry Demand</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roles.map((role) => (
                  <tr key={role._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{role.title}</td>
                    <td className="px-4 py-3 text-slate-600">{role.category}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">
                      {role.requiredSkills?.length || 0} Skills
                    </td>
                    <td className="px-4 py-3 text-slate-600">{role.averageSalaryRange}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {role.industryDemand}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(role)}
                        className="text-slate-400 hover:text-blue-600 p-1"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role._id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRole ? 'Edit Career Role Benchmark' : 'Add New Career Role'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Role Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              placeholder="e.g. Full Stack Developer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Cloud & Security">Cloud & Security</option>
                <option value="Product & Design">Product & Design</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Industry Demand</label>
              <select
                value={form.industryDemand}
                onChange={(e) => setForm({ ...form, industryDemand: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              >
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Typical Salary Range (CTC)</label>
            <input
              type="text"
              value={form.averageSalaryRange}
              onChange={(e) => setForm({ ...form, averageSalaryRange: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              placeholder="e.g. ₹8 LPA - ₹18 LPA"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Description</label>
            <textarea
              rows="2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Required Skills (Format: SkillName (Level), comma-separated)
            </label>
            <textarea
              rows="3"
              value={form.requiredSkillsText}
              onChange={(e) => setForm({ ...form, requiredSkillsText: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
              placeholder="JavaScript (Advanced), React (Intermediate), Node.js (Intermediate)"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Preferred Skills (Comma-separated)</label>
            <input
              type="text"
              value={form.preferredSkillsText}
              onChange={(e) => setForm({ ...form, preferredSkillsText: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              placeholder="TypeScript, Next.js, Docker"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={saving}>
              {editingRole ? 'Save Changes' : 'Create Role'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageRolesPage;

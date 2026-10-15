import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const ManageEmergingPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    category: 'Artificial Intelligence',
    demandIndicator: 'Critical Demand',
    growthRate: '+45% YoY',
    description: '',
    whyItMatters: '',
    relatedRolesText: 'AI/ML Engineer, Full Stack Developer',
    actionsText: 'Study prompt design, Build RAG pipelines',
    toolsText: 'LangChain, OpenAI, Hugging Face',
  });

  const fetchSkills = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/emerging-skills');
      setSkills(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading emerging skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = () => {
    setEditingSkill(null);
    setForm({
      title: '',
      category: 'Artificial Intelligence',
      demandIndicator: 'Critical Demand',
      growthRate: '+45% YoY',
      description: '',
      whyItMatters: '',
      relatedRolesText: 'Software Engineer, Data Analyst',
      actionsText: 'Practice core concepts, Build microservice',
      toolsText: 'Docker, Python, Git',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setForm({
      title: skill.title,
      category: skill.category,
      demandIndicator: skill.demandIndicator || 'Very High',
      growthRate: skill.growthRate || '+35% YoY',
      description: skill.description,
      whyItMatters: skill.whyItMatters,
      relatedRolesText: (skill.relatedRoles || []).join(', '),
      actionsText: (skill.recommendedLearningActions || []).join(', '),
      toolsText: (skill.keyTools || []).join(', '),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this emerging skill record?')) return;
    try {
      await api.delete(`/emerging-skills/${id}`);
      setSkills(skills.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting emerging skill.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      category: form.category,
      demandIndicator: form.demandIndicator,
      growthRate: form.growthRate,
      description: form.description,
      whyItMatters: form.whyItMatters,
      relatedRoles: form.relatedRolesText.split(',').map((r) => r.trim()).filter((r) => r.length > 0),
      recommendedLearningActions: form.actionsText.split(',').map((a) => a.trim()).filter((a) => a.length > 0),
      keyTools: form.toolsText.split(',').map((t) => t.trim()).filter((t) => t.length > 0),
    };

    try {
      if (editingSkill) {
        const res = await api.put(`/emerging-skills/${editingSkill._id}`, payload);
        setSkills(skills.map((s) => (s._id === editingSkill._id ? res.data : s)));
      } else {
        const res = await api.post('/emerging-skills', payload);
        setSkills([...skills, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving emerging skill.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Emerging Skills</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain industry trends, growth metrics, and market demands
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAddModal}>
          Add Emerging Skill
        </Button>
      </div>

      {loading ? (
        <Loader message="Loading emerging skills..." />
      ) : error ? (
        <ErrorState title="Error" message={error} onRetry={fetchSkills} />
      ) : (
        <Card className="overflow-hidden border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Skill Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Demand Level</th>
                  <th className="px-4 py-3">Growth Rate</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {skills.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{s.title}</td>
                    <td className="px-4 py-3 text-slate-600">{s.category}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {s.demandIndicator}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-emerald-600 font-mono font-semibold">{s.growthRate}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="text-slate-400 hover:text-blue-600 p-1"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
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
        title={editingSkill ? 'Edit Emerging Skill' : 'Add Emerging Skill'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Skill Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              >
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                <option value="Security">Security</option>
                <option value="DevOps">DevOps</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Demand Level</label>
              <select
                value={form.demandIndicator}
                onChange={(e) => setForm({ ...form, demandIndicator: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              >
                <option value="Critical Demand">Critical Demand</option>
                <option value="Very High">Very High</option>
                <option value="Trending">Trending</option>
                <option value="High Demand">High Demand</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Growth Metric</label>
              <input
                type="text"
                value={form.growthRate}
                onChange={(e) => setForm({ ...form, growthRate: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                placeholder="+45% YoY"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Description *</label>
            <textarea
              rows="2"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Why It Matters to Recruiters *</label>
            <textarea
              rows="2"
              required
              value={form.whyItMatters}
              onChange={(e) => setForm({ ...form, whyItMatters: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Related Roles (Comma-separated)</label>
            <input
              type="text"
              value={form.relatedRolesText}
              onChange={(e) => setForm({ ...form, relatedRolesText: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Recommended Learning Actions (Comma-separated)</label>
            <textarea
              rows="2"
              value={form.actionsText}
              onChange={(e) => setForm({ ...form, actionsText: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Key Tools (Comma-separated)</label>
            <input
              type="text"
              value={form.toolsText}
              onChange={(e) => setForm({ ...form, toolsText: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={saving}>
              {editingSkill ? 'Save Changes' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageEmergingPage;

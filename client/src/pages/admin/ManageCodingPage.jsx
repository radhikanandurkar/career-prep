import React, { useState, useEffect } from 'react';
import {
  Code2,
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

const ManageCodingPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    category: 'Arrays',
    difficulty: 'Easy',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '1 <= N <= 10^5',
    exampleInput: '',
    exampleOutput: '',
    exampleExplanation: '',
    tags: 'Array, Algorithms',
  });

  const fetchProblems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/coding/problems');
      setProblems(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading coding problems.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const openAddModal = () => {
    setEditingProblem(null);
    setForm({
      title: '',
      category: 'Arrays',
      difficulty: 'Easy',
      description: '',
      inputFormat: 'Array of integers',
      outputFormat: 'Target value',
      constraints: '1 <= N <= 10^5',
      exampleInput: '[1, 2, 3]',
      exampleOutput: '6',
      exampleExplanation: 'Sum is 6.',
      tags: 'Array, Practice',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prob) => {
    setEditingProblem(prob);
    const ex = prob.examples?.[0] || {};
    setForm({
      title: prob.title,
      category: prob.category,
      difficulty: prob.difficulty,
      description: prob.description,
      inputFormat: prob.inputFormat,
      outputFormat: prob.outputFormat,
      constraints: prob.constraints || '1 <= N <= 10^5',
      exampleInput: ex.input || '',
      exampleOutput: ex.output || '',
      exampleExplanation: ex.explanation || '',
      tags: (prob.tags || []).join(', '),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coding problem?')) return;
    try {
      await api.delete(`/coding/problems/${id}`);
      setProblems(problems.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting problem.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      category: form.category,
      difficulty: form.difficulty,
      description: form.description,
      inputFormat: form.inputFormat,
      outputFormat: form.outputFormat,
      constraints: form.constraints,
      examples: [
        {
          input: form.exampleInput,
          output: form.exampleOutput,
          explanation: form.exampleExplanation,
        },
      ],
      tags: form.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0),
    };

    try {
      if (editingProblem) {
        const res = await api.put(`/coding/problems/${editingProblem._id}`, payload);
        setProblems(problems.map((p) => (p._id === editingProblem._id ? res.data : p)));
      } else {
        const res = await api.post('/coding/problems', payload);
        setProblems([...problems, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving coding problem.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Coding Challenges</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain campus recruitment coding problems and starter code templates
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAddModal}>
          Add Coding Problem
        </Button>
      </div>

      {loading ? (
        <Loader message="Loading coding problems..." />
      ) : error ? (
        <ErrorState title="Error" message={error} onRetry={fetchProblems} />
      ) : (
        <Card className="overflow-hidden border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Tags</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {problems.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{p.title}</td>
                    <td className="px-4 py-3 text-slate-600">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{(p.tags || []).join(', ')}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="text-slate-400 hover:text-blue-600 p-1"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
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
        title={editingProblem ? 'Edit Coding Problem' : 'Add New Coding Problem'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Problem Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
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
                <option value="Arrays">Arrays</option>
                <option value="Strings">Strings</option>
                <option value="Searching">Searching</option>
                <option value="Sorting">Sorting</option>
                <option value="Linked Lists">Linked Lists</option>
                <option value="Basic Algorithms">Basic Algorithms</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Description *</label>
            <textarea
              rows="3"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Input Format</label>
              <input
                type="text"
                value={form.inputFormat}
                onChange={(e) => setForm({ ...form, inputFormat: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Output Format</label>
              <input
                type="text"
                value={form.outputFormat}
                onChange={(e) => setForm({ ...form, outputFormat: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Example Input</label>
              <input
                type="text"
                value={form.exampleInput}
                onChange={(e) => setForm({ ...form, exampleInput: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Example Output</label>
              <input
                type="text"
                value={form.exampleOutput}
                onChange={(e) => setForm({ ...form, exampleOutput: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={saving}>
              {editingProblem ? 'Save Changes' : 'Create Problem'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCodingPage;

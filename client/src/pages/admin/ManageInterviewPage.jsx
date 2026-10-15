import React, { useState, useEffect } from 'react';
import {
  MessagesSquare,
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

const ManageInterviewPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    category: 'HR',
    roleCategory: 'Campus HR',
    difficulty: 'Medium',
    frequency: 'Frequently Asked',
    question: '',
    keyPointsText: '',
    sampleAnswer: '',
  });

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/interview/questions');
      setQuestions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading interview questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const openAddModal = () => {
    setEditingQuestion(null);
    setForm({
      category: 'Technical',
      roleCategory: 'Core Software Engineering',
      difficulty: 'Medium',
      frequency: 'Frequently Asked',
      question: '',
      keyPointsText: 'Definition, Real-world example, Trade-offs',
      sampleAnswer: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setForm({
      category: q.category,
      roleCategory: q.roleCategory || 'General',
      difficulty: q.difficulty || 'Medium',
      frequency: q.frequency || 'Frequently Asked',
      question: q.question,
      keyPointsText: (q.keyPoints || []).join(', '),
      sampleAnswer: q.sampleAnswer || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this interview question?')) return;
    try {
      await api.delete(`/interview/questions/${id}`);
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting question.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      category: form.category,
      roleCategory: form.roleCategory,
      difficulty: form.difficulty,
      frequency: form.frequency,
      question: form.question,
      keyPoints: form.keyPointsText.split(',').map((p) => p.trim()).filter((p) => p.length > 0),
      sampleAnswer: form.sampleAnswer,
    };

    try {
      if (editingQuestion) {
        const res = await api.put(`/interview/questions/${editingQuestion._id}`, payload);
        setQuestions(questions.map((q) => (q._id === editingQuestion._id ? res.data : q)));
      } else {
        const res = await api.post('/interview/questions', payload);
        setQuestions([...questions, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving interview question.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Interview Questions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain HR, Technical, and Behavioral interview banks with STAR answers
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAddModal}>
          Add Interview Question
        </Button>
      </div>

      {loading ? (
        <Loader message="Loading questions..." />
      ) : error ? (
        <ErrorState title="Error" message={error} onRetry={fetchQuestions} />
      ) : (
        <Card className="overflow-hidden border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Role Target</th>
                  <th className="px-4 py-3">Question</th>
                  <th className="px-4 py-3">Frequency</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{q.category}</td>
                    <td className="px-4 py-3 text-slate-600">{q.roleCategory}</td>
                    <td className="px-4 py-3 text-slate-800 max-w-md truncate">{q.question}</td>
                    <td className="px-4 py-3 font-semibold text-amber-700">{q.frequency}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(q)}
                        className="text-slate-400 hover:text-blue-600 p-1"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
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
        title={editingQuestion ? 'Edit Interview Question' : 'Add Interview Question'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              >
                <option value="HR">HR</option>
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Role Category</label>
              <input
                type="text"
                value={form.roleCategory}
                onChange={(e) => setForm({ ...form, roleCategory: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Frequency</label>
              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              >
                <option value="Frequently Asked">Frequently Asked</option>
                <option value="Must Prepare">Must Prepare</option>
                <option value="Common">Common</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Question Text *</label>
            <input
              type="text"
              required
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Key Points to Mention (Comma-separated)</label>
            <textarea
              rows="2"
              value={form.keyPointsText}
              onChange={(e) => setForm({ ...form, keyPointsText: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Sample Model Answer *</label>
            <textarea
              rows="4"
              required
              value={form.sampleAnswer}
              onChange={(e) => setForm({ ...form, sampleAnswer: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={saving}>
              {editingQuestion ? 'Save Changes' : 'Create Question'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageInterviewPage;

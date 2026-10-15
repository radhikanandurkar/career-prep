import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const ManageAptitudePage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    category: 'Quantitative Aptitude',
    topic: 'Time and Work',
    difficulty: 'Medium',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswerIndex: 0,
    explanation: '',
  });

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/aptitude/questions?limit=100');
      setQuestions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading aptitude questions.');
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
      category: 'Quantitative Aptitude',
      topic: 'General Aptitude',
      difficulty: 'Medium',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswerIndex: 0,
      explanation: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setForm({
      category: q.category,
      topic: q.topic || 'General Aptitude',
      difficulty: q.difficulty || 'Medium',
      question: q.question,
      optionA: q.options?.[0] || '',
      optionB: q.options?.[1] || '',
      optionC: q.options?.[2] || '',
      optionD: q.options?.[3] || '',
      correctAnswerIndex: q.correctAnswerIndex || 0,
      explanation: q.explanation || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/aptitude/questions/${id}`);
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
      topic: form.topic,
      difficulty: form.difficulty,
      question: form.question,
      options: [form.optionA, form.optionB, form.optionC, form.optionD],
      correctAnswerIndex: Number(form.correctAnswerIndex),
      explanation: form.explanation,
    };

    try {
      if (editingQuestion) {
        const res = await api.put(`/aptitude/questions/${editingQuestion._id}`, payload);
        setQuestions(questions.map((q) => (q._id === editingQuestion._id ? res.data : q)));
      } else {
        const res = await api.post('/aptitude/questions', payload);
        setQuestions([...questions, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving question.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Aptitude Questions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Question bank management for Quantitative, Logical Reasoning, and Verbal Ability
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAddModal}>
          Add Question
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
                  <th className="px-4 py-3">Topic</th>
                  <th className="px-4 py-3">Question</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{q.category}</td>
                    <td className="px-4 py-3 text-slate-600">{q.topic}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-md truncate">{q.question}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">{q.difficulty}</td>
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuestion ? 'Edit Aptitude Question' : 'Add Aptitude Question'}
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
                <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                <option value="Logical Reasoning">Logical Reasoning</option>
                <option value="Verbal Ability">Verbal Ability</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Topic</label>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              />
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
            <label className="font-semibold text-slate-700 block mb-1">Question Statement *</label>
            <textarea
              rows="3"
              required
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Option A</label>
              <input
                type="text"
                required
                value={form.optionA}
                onChange={(e) => setForm({ ...form, optionA: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Option B</label>
              <input
                type="text"
                required
                value={form.optionB}
                onChange={(e) => setForm({ ...form, optionB: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Option C</label>
              <input
                type="text"
                required
                value={form.optionC}
                onChange={(e) => setForm({ ...form, optionC: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Option D</label>
              <input
                type="text"
                required
                value={form.optionD}
                onChange={(e) => setForm({ ...form, optionD: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Correct Answer</label>
              <select
                value={form.correctAnswerIndex}
                onChange={(e) => setForm({ ...form, correctAnswerIndex: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              >
                <option value={0}>Option A</option>
                <option value={1}>Option B</option>
                <option value={2}>Option C</option>
                <option value={3}>Option D</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Step-by-Step Explanation *</label>
            <textarea
              rows="3"
              required
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
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

export default ManageAptitudePage;

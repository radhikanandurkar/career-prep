import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const ManageCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [form, setForm] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    tier: 'Tier 1 Product',
    hiringStatus: 'Actively Hiring',
    description: '',
  });

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/companies');
      setCompanies(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching companies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const openAddModal = () => {
    setEditingCompany(null);
    setForm({
      name: '',
      industry: 'Software & Cloud Services',
      location: 'Bangalore, India',
      website: 'https://',
      tier: 'Tier 1 Product',
      hiringStatus: 'Actively Hiring',
      description: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (comp) => {
    setEditingCompany(comp);
    setForm({
      name: comp.name,
      industry: comp.industry,
      location: comp.location,
      website: comp.website,
      tier: comp.tier || 'Tier 1 Product',
      hiringStatus: comp.hiringStatus || 'Actively Hiring',
      description: comp.description,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company and its associated jobs?')) return;
    try {
      await api.delete(`/companies/${id}`);
      setCompanies(companies.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting company.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCompany) {
        const res = await api.put(`/companies/${editingCompany._id}`, form);
        setCompanies(companies.map((c) => (c._id === editingCompany._id ? res.data : c)));
      } else {
        const res = await api.post('/companies', form);
        setCompanies([...companies, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving company.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Partner Companies</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain campus recruiter profiles, tiers, hiring status, and associated jobs
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAddModal}>
          Add New Company
        </Button>
      </div>

      {loading ? (
        <Loader message="Loading companies..." />
      ) : error ? (
        <ErrorState title="Error" message={error} onRetry={fetchCompanies} />
      ) : (
        <Card className="overflow-hidden border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Industry</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Hiring Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.map((comp) => (
                  <tr key={comp._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{comp.name}</div>
                      {comp.website && (
                        <a
                          href={comp.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span>{comp.website.replace('https://', '')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{comp.industry}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {comp.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{comp.location}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          comp.hiringStatus === 'Actively Hiring'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-blue-50 text-blue-800'
                        }`}
                      >
                        {comp.hiringStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(comp)}
                        className="text-slate-400 hover:text-blue-600 p-1"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteCompany(comp._id)}
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
        title={editingCompany ? 'Edit Company Profile' : 'Add New Partner Company'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Industry Domain</label>
              <input
                type="text"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Location / HQ</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Company Tier</label>
              <select
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              >
                <option value="Global Tech Leader">Global Tech Leader</option>
                <option value="Tier 1 Product">Tier 1 Product</option>
                <option value="High-Growth Startup">High-Growth Startup</option>
                <option value="Service / Enterprise">Service / Enterprise</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Hiring Status</label>
              <select
                value={form.hiringStatus}
                onChange={(e) => setForm({ ...form, hiringStatus: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              >
                <option value="Actively Hiring">Actively Hiring</option>
                <option value="Upcoming Campus Drive">Upcoming Campus Drive</option>
                <option value="Open Applications">Open Applications</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Website URL</label>
            <input
              type="text"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Description</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={saving}>
              {editingCompany ? 'Save Changes' : 'Create Company'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCompaniesPage;

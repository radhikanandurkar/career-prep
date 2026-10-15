import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  GraduationCap,
  Target,
  Mail,
  Calendar,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading student directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.branch?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Overview of enrolled college students, target career goals, and registered technical skill sets
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <Loader message="Loading student records..." />
      ) : error ? (
        <ErrorState title="Error" message={error} onRetry={fetchStudents} />
      ) : (
        <Card className="overflow-hidden border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Branch & Year</th>
                  <th className="px-4 py-3">Target Career Goal</th>
                  <th className="px-4 py-3">Technical Skills</th>
                  <th className="px-4 py-3 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{st.name}</td>
                    <td className="px-4 py-3 text-slate-600">{st.email}</td>
                    <td className="px-4 py-3">
                      <div className="text-slate-800 font-medium">{st.branch}</div>
                      <div className="text-slate-500 text-[11px]">
                        {st.academicYear} • Batch {st.graduationYear}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                        {st.targetRoleTitle || st.targetRole?.title || 'Not Set'}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {(st.skills || []).slice(0, 4).map((sk, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                          >
                            {sk.name}
                          </span>
                        ))}
                        {(st.skills || []).length > 4 && (
                          <span className="text-[10px] text-slate-400">
                            +{(st.skills || []).length - 4} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 text-[11px]">
                      {new Date(st.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentListPage;

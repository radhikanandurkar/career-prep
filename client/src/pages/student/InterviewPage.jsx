import React, { useState, useEffect } from 'react';
import {
  MessagesSquare,
  CheckCircle2,
  Circle,
  Search,
  Sparkles,
  Save,
  BookOpen,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import ProgressBar from '../../components/common/ProgressBar';

const InterviewPage = () => {
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [savingNotesId, setSavingNotesId] = useState(null);
  const [userNotesMap, setUserNotesMap] = useState({});

  const fetchInterviewData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      if (searchQuery) params.append('search', searchQuery);

      const [qRes, sRes] = await Promise.all([
        api.get(`/interview/questions?${params.toString()}`),
        api.get('/interview/stats'),
      ]);

      setQuestions(qRes.data);
      setStats(sRes.data);

      const initialNotes = {};
      qRes.data.forEach((q) => {
        initialNotes[q._id] = q.userNotes || '';
      });
      setUserNotesMap(initialNotes);

      if (qRes.data.length > 0 && !expandedId) {
        setExpandedId(qRes.data[0]._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading interview questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewData();
  }, [categoryFilter]);

  const handleTogglePracticed = async (questionId, currentPracticed) => {
    try {
      await api.post('/interview/practice', {
        questionId,
        practiced: !currentPracticed,
      });

      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? { ...q, practiced: !currentPracticed } : q))
      );

      // Refresh stats
      const sRes = await api.get('/interview/stats');
      setStats(sRes.data);
    } catch (err) {
      console.error('Error updating practiced status:', err);
    }
  };

  const handleSaveNotes = async (questionId) => {
    setSavingNotesId(questionId);
    try {
      await api.post('/interview/practice', {
        questionId,
        userNotes: userNotesMap[questionId] || '',
      });
    } catch (err) {
      console.error('Error saving personal answer notes:', err);
    } finally {
      setSavingNotesId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Campus Placement Rounds
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interview Preparation Module
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Prepare for HR, Technical, and Behavioral interviews with key pointers, sample answers using the STAR method, and personal preparation notes.
          </p>
        </div>
      </div>

      {/* Progress Stats Summary */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Total Practiced</span>
            <p className="text-2xl font-extrabold text-blue-600 mt-0.5">
              {stats.practicedCount} <span className="text-xs text-slate-400">/ {stats.totalQuestions}</span>
            </p>
          </Card>
          <Card className="p-4 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase">HR Questions</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">
              {stats.breakdown?.HR?.practiced || 0} <span className="text-xs text-slate-400">/ {stats.breakdown?.HR?.total || 0}</span>
            </p>
          </Card>
          <Card className="p-4 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Technical Rounds</span>
            <p className="text-2xl font-extrabold text-purple-600 mt-0.5">
              {stats.breakdown?.Technical?.practiced || 0} <span className="text-xs text-slate-400">/ {stats.breakdown?.Technical?.total || 0}</span>
            </p>
          </Card>
          <Card className="p-4 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Behavioral (STAR)</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-0.5">
              {stats.breakdown?.Behavioral?.practiced || 0} <span className="text-xs text-slate-400">/ {stats.breakdown?.Behavioral?.total || 0}</span>
            </p>
          </Card>
        </div>
      )}

      {/* Filters Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'HR', 'Technical', 'Behavioral'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search interview questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchInterviewData()}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Questions List */}
      {loading ? (
        <Loader message="Loading interview questions and answer notes..." />
      ) : error ? (
        <ErrorState title="Error" message={error} onRetry={fetchInterviewData} />
      ) : questions.length === 0 ? (
        <div className="p-8 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
          <p>No interview questions matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => {
            const isExpanded = expandedId === q._id;

            return (
              <Card key={q._id} className="overflow-hidden border-slate-200">
                {/* Header */}
                <div
                  className={`p-5 flex items-start justify-between gap-4 cursor-pointer select-none transition ${
                    q.practiced ? 'bg-emerald-50/20' : 'hover:bg-slate-50/60'
                  }`}
                  onClick={() => setExpandedId(isExpanded ? null : q._id)}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePracticed(q._id, q.practiced);
                      }}
                      className="mt-0.5 text-blue-600 hover:text-blue-700 cursor-pointer shrink-0"
                    >
                      {q.practiced ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-blue-500" />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {q.category}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {q.roleCategory}
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {q.frequency}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  <button className="text-slate-400 p-1 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 space-y-5 bg-white">
                    {/* Key Points to Mention */}
                    <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Key Points to Highlight in Your Response:</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700 pl-1">
                        {q.keyPoints?.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sample Answer */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Model Answer (STAR Framework):
                      </h4>
                      <p className="p-4 bg-blue-50/40 border border-blue-100 rounded-xl text-xs text-slate-800 leading-relaxed italic">
                        "{q.sampleAnswer}"
                      </p>
                    </div>

                    {/* Personal Answer Notes */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Your Personal Answer Notes / Story:
                        </label>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Save}
                          isLoading={savingNotesId === q._id}
                          onClick={() => handleSaveNotes(q._id)}
                        >
                          Save Notes
                        </Button>
                      </div>
                      <textarea
                        rows="3"
                        placeholder="Draft your personalized answer or relevant college project scenario here..."
                        value={userNotesMap[q._id] || ''}
                        onChange={(e) =>
                          setUserNotesMap({ ...userNotesMap, [q._id]: e.target.value })
                        }
                        className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InterviewPage;

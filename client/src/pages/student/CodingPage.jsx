import React, { useState, useEffect } from 'react';
import {
  Code2,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Tag,
  AlertCircle,
  Filter,
  Check,
  Terminal,
  Layers,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import ProgressBar from '../../components/common/ProgressBar';

const CodingPage = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Code editor states
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState(null);

  const fetchCodingData = async () => {
    setLoading(true);
    setError('');
    try {
      const url = selectedCategory !== 'All' ? `/coding/problems?category=${selectedCategory}` : '/coding/problems';
      const [probsRes, statsRes] = await Promise.all([
        api.get(url),
        api.get('/coding/stats'),
      ]);

      setProblems(probsRes.data);
      setStats(statsRes.data);

      if (probsRes.data.length > 0) {
        const first = probsRes.data[0];
        setSelectedProblem(first);
        setCode(first.userCode || first.starterTemplates?.[language] || '// Write code here');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading coding problems.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodingData();
  }, [selectedCategory]);

  const handleSelectProblem = (prob) => {
    setSelectedProblem(prob);
    setConsoleOutput(null);
    setCode(prob.userCode || prob.starterTemplates?.[language] || '// Write code here');
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (selectedProblem?.starterTemplates?.[lang]) {
      setCode(selectedProblem.starterTemplates[lang]);
    }
  };

  const handleRunCode = async (markSolved = false) => {
    if (!selectedProblem) return;
    setSubmitting(true);
    setConsoleOutput(null);
    try {
      const res = await api.post('/coding/submit', {
        problemId: selectedProblem._id,
        code,
        language,
        markSolved,
      });

      setConsoleOutput(res.data);

      // Refresh problem list status and stats
      const updatedProblems = problems.map((p) => {
        if (p._id === selectedProblem._id) {
          return {
            ...p,
            userStatus: res.data.status,
            userCode: code,
          };
        }
        return p;
      });
      setProblems(updatedProblems);

      // Update active stats
      const statsRes = await api.get('/coding/stats');
      setStats(statsRes.data);
    } catch (err) {
      setConsoleOutput({
        success: false,
        message: err.response?.data?.message || 'Execution error.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyBadge = (diff) => {
    if (diff === 'Easy') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (diff === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  if (loading && problems.length === 0) {
    return <Loader message="Loading coding challenges..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Hands-on Technical Assessment
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Coding Practice Module
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Sharpen data structure and algorithmic skills commonly tested in technical recruitment rounds. Test your solutions and track solved counts.
          </p>
        </div>
      </div>

      {/* Stats Summary Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Solved Problems</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">
              {stats.solvedCount} <span className="text-xs text-slate-400">/ {stats.totalProblems}</span>
            </p>
          </Card>
          <Card className="p-4 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Easy Solved</span>
            <p className="text-2xl font-extrabold text-blue-600 mt-0.5">
              {stats.difficultyStats?.Easy?.solved || 0} <span className="text-xs text-slate-400">/ {stats.difficultyStats?.Easy?.total || 0}</span>
            </p>
          </Card>
          <Card className="p-4 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Medium Solved</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-0.5">
              {stats.difficultyStats?.Medium?.solved || 0} <span className="text-xs text-slate-400">/ {stats.difficultyStats?.Medium?.total || 0}</span>
            </p>
          </Card>
          <Card className="p-4 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Attempted / In-Progress</span>
            <p className="text-2xl font-extrabold text-slate-700 mt-0.5">{stats.attemptedCount}</p>
          </Card>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
        {['All', 'Arrays', 'Strings', 'Searching', 'Sorting', 'Linked Lists', 'Basic Algorithms'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Split: Left Problem List & Right Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Problem Selection List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Problems ({problems.length})
          </h3>
          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {problems.map((prob) => {
              const isSelected = selectedProblem?._id === prob._id;
              const isSolved = prob.userStatus === 'solved';

              return (
                <div
                  key={prob._id}
                  onClick={() => handleSelectProblem(prob)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {isSolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{prob.title}</h4>
                      <span className="text-[10px] text-slate-500">{prob.category}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${getDifficultyBadge(
                      prob.difficulty
                    )}`}
                  >
                    {prob.difficulty}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Problem Workspace */}
        <div className="lg:col-span-7 space-y-4">
          {selectedProblem ? (
            <Card className="p-6 border-slate-200 space-y-6">
              {/* Problem Title & Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-blue-600">{selectedProblem.category}</span>
                    <span className="text-slate-300">•</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getDifficultyBadge(
                        selectedProblem.difficulty
                      )}`}
                    >
                      {selectedProblem.difficulty}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedProblem.title}</h2>
                </div>

                <div className="flex items-center gap-2">
                  {selectedProblem.userStatus === 'solved' ? (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Solved
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Check}
                      onClick={() => handleRunCode(true)}
                    >
                      Mark as Solved
                    </Button>
                  )}
                </div>
              </div>

              {/* Problem Description */}
              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">Description</h4>
                  <p>{selectedProblem.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-800 block text-[11px] mb-0.5">Input Format:</span>
                    <p className="text-slate-600 text-[11px]">{selectedProblem.inputFormat}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-800 block text-[11px] mb-0.5">Output Format:</span>
                    <p className="text-slate-600 text-[11px]">{selectedProblem.outputFormat}</p>
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-2">Examples</h4>
                  <div className="space-y-2">
                    {selectedProblem.examples?.map((ex, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg font-mono text-[11px]">
                        <div><strong className="text-slate-800 font-sans">Input:</strong> {ex.input}</div>
                        <div><strong className="text-slate-800 font-sans">Output:</strong> {ex.output}</div>
                        {ex.explanation && (
                          <div className="text-slate-500 font-sans text-[11px] mt-1">
                            <em>Explanation:</em> {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Editor Area */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-800">Code Solution</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-medium focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="javascript">JavaScript (Node.js)</option>
                      <option value="python">Python 3</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows="9"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-3 font-mono text-xs bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="// Write your code solution here..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Press Run to test against standard problem test cases
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Play}
                      isLoading={submitting}
                      onClick={() => handleRunCode(false)}
                    >
                      Run & Test Solution
                    </Button>
                  </div>
                </div>
              </div>

              {/* Test Output Console */}
              {consoleOutput && (
                <div
                  className={`p-4 rounded-xl border font-mono text-xs ${
                    consoleOutput.status === 'solved'
                      ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
                      : 'bg-slate-900 text-slate-200 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/10 font-sans">
                    <span className="font-bold">Output Console:</span>
                    <span className="font-semibold text-[11px]">{consoleOutput.message}</span>
                  </div>
                  <div className="space-y-1">
                    <p>Passed: {consoleOutput.testsPassed} / {consoleOutput.totalTests} tests</p>
                    {consoleOutput.testResults?.map((tr, i) => (
                      <div key={i} className="text-[11px] text-slate-300 flex items-center gap-2">
                        <span>Test Case {tr.testCaseIndex}:</span>
                        <span className={tr.passed ? 'text-emerald-400' : 'text-rose-400'}>
                          {tr.passed ? '✓ PASSED' : '✗ FAILED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400">
              <Code2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>Select a problem on the left to start coding.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingPage;

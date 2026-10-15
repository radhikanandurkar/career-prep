import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertCircle,
  Play,
  Award,
  ChevronLeft,
  ChevronRight,
  Send,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import ProgressBar from '../../components/common/ProgressBar';

const AptitudePage = () => {
  const [mode, setMode] = useState('menu'); // 'menu' | 'testing' | 'review'
  const [selectedCategory, setSelectedCategory] = useState('Quantitative Aptitude');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // questionId -> selectedOptionIndex (0-3)
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await api.get('/aptitude/history');
      setHistory(res.data);
    } catch (e) {
      console.error('Error fetching test history:', e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Timer countdown hook
  useEffect(() => {
    let timer = null;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      // Auto-submit when time runs out
      handleSubmitTest();
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const handleStartTest = async (category) => {
    setLoading(true);
    setError('');
    setSelectedCategory(category);
    try {
      const res = await api.get(`/aptitude/questions?category=${encodeURIComponent(category)}&limit=10`);
      if (!res.data || res.data.length === 0) {
        setError('No questions available in this category yet.');
        setLoading(false);
        return;
      }

      setQuestions(res.data);
      setCurrentIndex(0);
      setAnswers({});
      setTimeLeft(res.data.length * 60); // 1 minute per question
      setTimerActive(true);
      setMode('testing');
    } catch (err) {
      setError(err.response?.data?.message || 'Error initializing practice test.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optIndex) => {
    const q = questions[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [q._id]: optIndex,
    }));
  };

  const handleSubmitTest = async () => {
    setTimerActive(false);
    setSubmitting(true);
    try {
      const submissionPayload = questions.map((q) => ({
        questionId: q._id,
        selectedOption: answers[q._id] !== undefined ? answers[q._id] : -1,
      }));

      const res = await api.post('/aptitude/submit', {
        category: selectedCategory,
        answers: submissionPayload,
        timeSpentSeconds: questions.length * 60 - timeLeft,
      });

      setSubmissionResult(res.data);
      setMode('review');
      fetchHistory(); // Refresh history
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting test.');
      setTimerActive(true);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Render Test Selection & History Menu
  if (mode === 'menu') {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Screening Exam Preparation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Aptitude Practice Module
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Practice placement aptitude tests with real timed countdowns, objective multiple-choice scoring, and question review.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Quantitative Aptitude',
              desc: 'Time & work, profit/loss, speed & distance, ratios, and probability.',
              category: 'Quantitative Aptitude',
              questionsCount: 5,
            },
            {
              title: 'Logical Reasoning',
              desc: 'Series patterns, blood relations, direction sense, and syllogisms.',
              category: 'Logical Reasoning',
              questionsCount: 5,
            },
            {
              title: 'Verbal Ability',
              desc: 'Grammar correction, synonyms, antonyms, and reading comprehension.',
              category: 'Verbal Ability',
              questionsCount: 5,
            },
          ].map((cat) => (
            <Card key={cat.title} className="p-6 flex flex-col justify-between hover:border-blue-300 transition duration-200">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{cat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{cat.desc}</p>
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-4">
                <span className="text-[11px] text-slate-500 font-medium">10 mins • Timed</span>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Play}
                  isLoading={loading && selectedCategory === cat.category}
                  onClick={() => handleStartTest(cat.category)}
                >
                  Start Test
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* History Table */}
        <Card title="Past Test Performance History" subtitle="Recent aptitude assessments recorded in database">
          {history.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No test attempts recorded yet. Start a test above to evaluate your aptitude.
            </p>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                  <tr>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5">Score</th>
                    <th className="px-4 py-2.5">Accuracy</th>
                    <th className="px-4 py-2.5 text-right">Time Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-2.5 font-bold text-slate-900">{item.category}</td>
                      <td className="px-4 py-2.5 text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="font-semibold text-slate-900">
                          {item.correctCount} / {item.totalQuestions}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.percentage >= 70
                              ? 'bg-emerald-50 text-emerald-800'
                              : item.percentage >= 40
                              ? 'bg-blue-50 text-blue-800'
                              : 'bg-rose-50 text-rose-800'
                          }`}
                        >
                          {item.percentage}%
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-500 font-mono">
                        {Math.floor((item.timeSpentSeconds || 0) / 60)}m {(item.timeSpentSeconds || 0) % 60}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Render Active Timed Test
  if (mode === 'testing') {
    const currentQ = questions[currentIndex];
    const totalQ = questions.length;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Top Floating Control Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between sticky top-16 z-20">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
              {selectedCategory}
            </span>
            <span className="text-xs font-semibold text-slate-700">
              Question {currentIndex + 1} of {totalQ}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-sm font-bold border ${
                timeLeft < 120
                  ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <Button
              variant="success"
              size="sm"
              icon={Send}
              isLoading={submitting}
              onClick={handleSubmitTest}
            >
              Submit Test
            </Button>
          </div>
        </div>

        {/* Question Palette Indicator */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap gap-1.5">
          {questions.map((q, idx) => {
            const isAnswered = answers[q._id] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q._id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition cursor-pointer ${
                  isCurrent
                    ? 'ring-2 ring-blue-600 bg-blue-600 text-white'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        {currentQ && (
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Topic: {currentQ.topic || 'General'}</span>
                <span className="font-semibold text-slate-600">Difficulty: {currentQ.difficulty}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options?.map((option, optIdx) => {
                const isSelected = answers[currentQ._id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleOptionSelect(optIdx)}
                    className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-slate-300 text-slate-500'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-xs sm:text-sm">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Next / Prev Controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                icon={ChevronLeft}
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              >
                Previous
              </Button>

              <span className="text-xs text-slate-500 font-medium">
                {answeredCount} of {totalQ} Answered
              </span>

              {currentIndex < totalQ - 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQ - 1, prev + 1))}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="sm"
                  icon={Send}
                  isLoading={submitting}
                  onClick={handleSubmitTest}
                >
                  Finish & Submit
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // Render Test Results & Detailed Review
  if (mode === 'review') {
    const { totalQuestions, correctCount, percentage, detailedReview, timeSpentSeconds } =
      submissionResult || {};

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Score Banner */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Aptitude Test Completed</h2>
          <p className="text-xs text-slate-500">Results saved to your database progress record</p>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto py-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-2xl font-bold text-slate-900">{correctCount} / {totalQuestions}</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Score</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="block text-2xl font-bold text-blue-700">{percentage}%</span>
              <span className="text-[10px] text-blue-600 uppercase font-semibold">Accuracy</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-2xl font-bold text-slate-900">
                {Math.floor((timeSpentSeconds || 0) / 60)}m {(timeSpentSeconds || 0) % 60}s
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Time</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Button variant="outline" icon={RotateCcw} onClick={() => setMode('menu')}>
              Return to Test Menu
            </Button>
          </div>
        </div>

        {/* Detailed Question Review */}
        <Card title="Detailed Solution & Answers Review" subtitle="Step-by-step explanations for each question">
          <div className="space-y-6">
            {detailedReview?.map((rev, i) => (
              <div
                key={i}
                className={`p-5 rounded-xl border ${
                  rev.isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Q{i + 1}. {rev.question}
                  </h4>
                  {rev.isCorrect ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1 shrink-0">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 text-xs">
                  {rev.options?.map((opt, optIdx) => {
                    const isUserChoice = rev.selectedOption === optIdx;
                    const isCorrectAnswer = rev.correctAnswerIndex === optIdx;

                    let badgeClass = 'border-slate-200 bg-white text-slate-700';
                    if (isCorrectAnswer) {
                      badgeClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                    } else if (isUserChoice && !rev.isCorrect) {
                      badgeClass = 'border-rose-500 bg-rose-50 text-rose-900 font-semibold';
                    }

                    return (
                      <div key={optIdx} className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${badgeClass}`}>
                        <span className="font-bold text-[11px]">{String.fromCharCode(65 + optIdx)}.</span>
                        <span>{opt}</span>
                        {isCorrectAnswer && <span className="ml-auto text-[10px] text-emerald-700 font-bold">(Correct)</span>}
                        {isUserChoice && !isCorrectAnswer && <span className="ml-auto text-[10px] text-rose-700 font-bold">(Your Choice)</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
                  <span className="font-bold text-slate-900 block mb-0.5">Explanation:</span>
                  <p className="leading-relaxed">{rev.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return null;
};

export default AptitudePage;

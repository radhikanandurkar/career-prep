import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Map,
  CheckCircle2,
  Circle,
  Target,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';

const RoadmapPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingTopicId, setTogglingTopicId] = useState(null);
  const [expandedPhases, setExpandedPhases] = useState({ 1: true, 2: true, 3: true, 4: true, 5: true });

  const fetchRoadmap = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/roadmap');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading career roadmap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleToggleTopic = async (topicId) => {
    setTogglingTopicId(topicId);
    try {
      const res = await api.post('/roadmap/toggle-topic', {
        topicId,
        roleId: data?.targetRole?._id,
      });

      setData((prev) => ({
        ...prev,
        completedTopicIds: res.data.completedTopicIds,
        percentageCompleted: res.data.percentageCompleted,
        completedCount: res.data.completedTopicIds.length,
      }));
    } catch (err) {
      console.error('Error toggling topic progress:', err);
    } finally {
      setTogglingTopicId(null);
    }
  };

  const togglePhaseExpand = (phaseNum) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseNum]: !prev[phaseNum],
    }));
  };

  if (loading) {
    return <Loader message="Generating your personalized career roadmap..." />;
  }

  if (error) {
    return <ErrorState title="Roadmap Error" message={error} onRetry={fetchRoadmap} />;
  }

  if (!data?.hasTargetRole || !data?.phases || data.phases.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="No Roadmap Available"
        description="No roadmap available yet. Set your career goal first to generate your structured learning milestones."
        actionText="Set Career Goal"
        onAction={() => window.location.href = '/career-goal'}
      />
    );
  }

  const { targetRole, phases, completedTopicIds, totalTopics, completedCount, percentageCompleted } = data;

  return (
    <div className="space-y-6">
      {/* Roadmap Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Personalized Learning Path
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-500">Target Role: {targetRole?.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              5-Phase Placement Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Step-by-step milestones to transition from classroom fundamentals to placement readiness. Check off topics as you learn to save progress.
            </p>
          </div>

          <div className="shrink-0 bg-slate-50 border border-slate-200 p-4 rounded-xl min-w-[220px]">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-bold text-slate-800">Roadmap Progress</span>
              <span className="font-bold text-blue-600">{percentageCompleted}%</span>
            </div>
            <ProgressBar value={completedCount} max={totalTopics} showPercentage={false} color="blue" size="md" />
            <span className="text-[11px] text-slate-500 mt-2 block text-center">
              {completedCount} of {totalTopics} topics completed
            </span>
          </div>
        </div>
      </div>

      {/* Phased Milestones Accordion */}
      <div className="space-y-5">
        {phases.map((phase) => {
          const isExpanded = expandedPhases[phase.phaseNumber];
          const phaseTopics = phase.topics || [];
          const phaseCompletedCount = phaseTopics.filter((t) => completedTopicIds.includes(t.id)).length;
          const phaseAllDone = phaseTopics.length > 0 && phaseCompletedCount === phaseTopics.length;

          return (
            <Card key={phase.phaseNumber} className="overflow-hidden border-slate-200">
              {/* Phase Header */}
              <div
                onClick={() => togglePhaseExpand(phase.phaseNumber)}
                className={`p-5 flex items-center justify-between cursor-pointer select-none transition ${
                  phaseAllDone ? 'bg-emerald-50/40' : 'bg-slate-50/70 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      phaseAllDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {phaseAllDone ? <CheckCircle2 className="w-5 h-5" /> : phase.phaseNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {phase.phaseName}
                      </h3>
                      {phaseAllDone && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          COMPLETED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{phase.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
                    {phaseCompletedCount} / {phaseTopics.length} Done
                  </span>
                  <button className="text-slate-400 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Phase Topics List */}
              {isExpanded && (
                <div className="divide-y divide-slate-100 p-2 sm:p-4">
                  {phaseTopics.map((topic) => {
                    const isCompleted = completedTopicIds.includes(topic.id);
                    const isToggling = togglingTopicId === topic.id;

                    return (
                      <div
                        key={topic.id}
                        className={`p-3.5 rounded-xl transition flex items-start gap-3.5 ${
                          isCompleted ? 'bg-emerald-50/30' : 'hover:bg-slate-50'
                        }`}
                      >
                        <button
                          type="button"
                          disabled={isToggling}
                          onClick={() => handleToggleTopic(topic.id)}
                          className="mt-0.5 text-blue-600 hover:text-blue-700 transition cursor-pointer shrink-0 disabled:opacity-50"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 hover:text-blue-500" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4
                              className={`text-xs sm:text-sm font-bold ${
                                isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
                              }`}
                            >
                              {topic.title}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {topic.skills?.map((sk, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {topic.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapPage;

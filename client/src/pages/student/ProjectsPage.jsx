import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  Clock,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const pUrl = difficultyFilter !== 'All' ? `/projects/recommendations?difficulty=${difficultyFilter}` : '/projects/recommendations';
      const [projRes, certRes] = await Promise.all([
        api.get(pUrl),
        api.get('/projects/certifications'),
      ]);
      setProjects(projRes.data);
      setCertifications(certRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading project recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [difficultyFilter]);

  const getDifficultyBadge = (diff) => {
    if (diff === 'Beginner') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (diff === 'Intermediate') return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  if (loading && projects.length === 0) {
    return <Loader message="Generating customized project recommendations..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Portfolio & Verification
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Projects & Certifications Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Hands-on capstone projects and recognized industry certifications selected to close your specific skill gaps and strengthen placement resumes.
          </p>
        </div>
      </div>

      {/* Recommended Projects Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recommended Capstone Projects</h2>
            <p className="text-xs text-slate-500">Tailored to your target career role and identified skill gaps</p>
          </div>

          <div className="flex items-center gap-1.5">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  difficultyFilter === diff
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <Card key={proj._id} className="p-6 border-slate-200 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {proj.roleCategory}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{proj.title}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getDifficultyBadge(
                      proj.difficulty
                    )}`}
                  >
                    {proj.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>

                {/* Expected Outcome */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    Expected Outcome / Placement Signal:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{proj.expectedOutcome}</p>
                </div>

                {/* Skills learned */}
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Skills Developed:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {proj.skillsLearned?.map((sk, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[11px] font-semibold border border-blue-100"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Estimated: ~{proj.estimatedHours} Hours
                </span>
                <a
                  href={proj.githubTemplateUrl || 'https://github.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Template & Guides</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended Industry Certifications */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Recommended Industry Certifications</h2>
          <p className="text-xs text-slate-500">Recognized credentials highly regarded by enterprise campus recruiters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <Card key={cert._id} className="p-5 border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {cert.difficulty}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{cert.title}</h4>
                  <span className="text-xs font-semibold text-blue-600 mt-0.5 block">{cert.provider}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{cert.description}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {cert.skillsCovered?.map((sk, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">{cert.estimatedCost}</span>
                <a
                  href={cert.officialUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Official Details</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Eye,
  Edit3,
} from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import ProgressBar from '../../components/common/ProgressBar';

const ResumePage = () => {
  const [resumeData, setResumeData] = useState(null);
  const [completenessScore, setCompletenessScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [viewMode, setViewMode] = useState('edit'); // 'edit' | 'preview'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchResume = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/resume');
      setResumeData(res.data.resume);
      setCompletenessScore(res.data.completenessScore);
      setSuggestions(res.data.improvementSuggestions || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading resume data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleSaveResume = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await api.put('/resume', resumeData);
      setCompletenessScore(res.data.completenessScore);
      setSuggestions(res.data.improvementSuggestions || []);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving resume:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    setViewMode('preview');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // State handlers for arrays
  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { title: '', techStack: '', description: '', link: '' },
      ],
    }));
  };

  const removeProject = (idx) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx),
    }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        { role: '', company: '', location: '', duration: '', description: '' },
      ],
    }));
  };

  const removeExperience = (idx) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx),
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '', grade: '' },
      ],
    }));
  };

  const removeEducation = (idx) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };

  const addCertification = () => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        { title: '', issuer: '', year: '', link: '' },
      ],
    }));
  };

  const removeCertification = (idx) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== idx),
    }));
  };

  if (loading) {
    return <Loader message="Loading resume builder..." />;
  }

  if (error) {
    return <ErrorState title="Error" message={error} onRetry={fetchResume} />;
  }

  const p = resumeData?.personalInfo || {};

  return (
    <div className="space-y-6">
      {/* Top Banner (hidden during print) */}
      <div className="no-print bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Career Assets
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Resume Builder & Evaluator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Build a clean, recruiter-compliant resume. Track completeness and follow systematic suggestions before placement drives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'edit'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'preview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
              Print / PDF
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Save}
              isLoading={saving}
              onClick={handleSaveResume}
            >
              Save Resume
            </Button>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="no-print p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Resume details and completeness metrics saved successfully to MongoDB!</span>
        </div>
      )}

      {/* Completeness & Suggestions Bar (hidden during print) */}
      <div className="no-print grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-4 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Resume Completeness</span>
              <span className="text-sm font-bold text-blue-600">{completenessScore}%</span>
            </div>
            <ProgressBar value={completenessScore} max={100} showPercentage={false} color="blue" size="md" />
            <p className="text-[11px] text-slate-500 mt-2">
              A high completeness score ensures recruiters have all relevant signals.
            </p>
          </div>
        </Card>

        <Card className="md:col-span-8 p-5">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Recommended Resume Improvements:</span>
          </h4>
          {suggestions.length === 0 ? (
            <p className="text-xs text-emerald-700 font-medium">
              Excellent! Your resume has all core recommended sections.
            </p>
          ) : (
            <ul className="space-y-1 text-xs text-slate-600">
              {suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* View Mode 1: Editor Form */}
      {viewMode === 'edit' && (
        <div className="no-print space-y-6">
          {/* Personal Info */}
          <Card title="Personal Contact & Links" subtitle="Header details on your resume">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={p.fullName || ''}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personalInfo: { ...p, fullName: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={p.email || ''}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personalInfo: { ...p, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={p.phone || ''}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personalInfo: { ...p, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Location / City</label>
                <input
                  type="text"
                  placeholder="Bangalore, India"
                  value={p.location || ''}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personalInfo: { ...p, location: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  placeholder="linkedin.com/in/username"
                  value={p.linkedin || ''}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personalInfo: { ...p, linkedin: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">GitHub / Portfolio URL</label>
                <input
                  type="text"
                  placeholder="github.com/username"
                  value={p.github || ''}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personalInfo: { ...p, github: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <label className="font-semibold text-slate-700 text-xs block mb-1">
                Executive Professional Summary
              </label>
              <textarea
                rows="3"
                value={p.summary || ''}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    personalInfo: { ...p, summary: e.target.value },
                  })
                }
                placeholder="2-3 sentence overview of your engineering domain and technical achievements..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </Card>

          {/* Projects */}
          <Card
            title="Projects"
            subtitle="Showcase applied software outcomes"
            action={
              <Button variant="outline" size="sm" icon={Plus} onClick={addProject}>
                Add Project
              </Button>
            }
          >
            <div className="space-y-4">
              {(resumeData?.projects || []).map((proj, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Project #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[idx].title = e.target.value;
                          setResumeData({ ...resumeData, projects: updated });
                        }}
                        placeholder="e.g. Distributed Task Queue"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Tech Stack</label>
                      <input
                        type="text"
                        value={proj.techStack}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[idx].techStack = e.target.value;
                          setResumeData({ ...resumeData, projects: updated });
                        }}
                        placeholder="e.g. React, Node.js, Redis, Docker"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 text-xs block mb-1">Description / Bullet Points</label>
                    <textarea
                      rows="2"
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...resumeData.projects];
                        updated[idx].description = e.target.value;
                        setResumeData({ ...resumeData, projects: updated });
                      }}
                      placeholder="Built a fault-tolerant system processing 5k events/sec with automated worker retries..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Education */}
          <Card
            title="Education"
            subtitle="Degree, college and performance scores"
            action={
              <Button variant="outline" size="sm" icon={Plus} onClick={addEducation}>
                Add Education
              </Button>
            }
          >
            <div className="space-y-4">
              {(resumeData?.education || []).map((edu, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Education #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[idx].institution = e.target.value;
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Degree & Branch</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[idx].degree = e.target.value;
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">CGPA / Grade</label>
                      <input
                        type="text"
                        value={edu.grade}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[idx].grade = e.target.value;
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Internships & Experience */}
          <Card
            title="Work Experience / Internships"
            subtitle="Campus roles or tech internships"
            action={
              <Button variant="outline" size="sm" icon={Plus} onClick={addExperience}>
                Add Experience
              </Button>
            }
          >
            <div className="space-y-4">
              {(resumeData?.experience || []).map((exp, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Role #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[idx].company = e.target.value;
                          setResumeData({ ...resumeData, experience: updated });
                        }}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Designation</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[idx].role = e.target.value;
                          setResumeData({ ...resumeData, experience: updated });
                        }}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Duration</label>
                      <input
                        type="text"
                        placeholder="June 2025 - Aug 2025"
                        value={exp.duration}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[idx].duration = e.target.value;
                          setResumeData({ ...resumeData, experience: updated });
                        }}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* View Mode 2: Live Professional Resume Preview (Printable) */}
      {(viewMode === 'preview' || viewMode === 'edit') && (
        <div className={`mt-8 ${viewMode === 'edit' ? 'hidden' : 'block'}`}>
          <div className="max-w-4xl mx-auto bg-white border border-slate-300 rounded-xl shadow-lg p-8 sm:p-12 text-slate-800 font-sans print:border-none print:shadow-none print:p-0">
            {/* Header */}
            <div className="text-center border-b border-slate-300 pb-5 mb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-900">
                {p.fullName || 'Student Name'}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 mt-2">
                {p.email && <span>{p.email}</span>}
                {p.phone && <span>• {p.phone}</span>}
                {p.location && <span>• {p.location}</span>}
                {p.linkedin && <span>• {p.linkedin}</span>}
                {p.github && <span>• {p.github}</span>}
              </div>
            </div>

            {/* Summary */}
            {p.summary && (
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Professional Summary
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">{p.summary}</p>
              </div>
            )}

            {/* Education */}
            {resumeData?.education?.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Education
                </h3>
                <div className="space-y-2">
                  {resumeData.education.map((edu, i) => (
                    <div key={i} className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{edu.institution}</span>
                        <div className="text-slate-700">{edu.degree}</div>
                      </div>
                      <div className="text-right text-slate-600">
                        <span>{edu.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Skills */}
            {resumeData?.skills?.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Technical Skills
                </h3>
                <div className="text-xs text-slate-700 space-y-1">
                  {resumeData.skills.map((cat, i) => (
                    <div key={i}>
                      <strong className="text-slate-900">{cat.category}: </strong>
                      <span>{cat.items?.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData?.projects?.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Projects
                </h3>
                <div className="space-y-3">
                  {resumeData.projects.map((proj, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{proj.title}</span>
                        <span className="text-[11px] font-normal text-slate-500 italic">[{proj.techStack}]</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed mt-0.5">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {resumeData?.experience?.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Experience & Internships
                </h3>
                <div className="space-y-3">
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{exp.role} — {exp.company}</span>
                        <span className="text-slate-500 text-[11px]">{exp.duration}</span>
                      </div>
                      {exp.description && (
                        <p className="text-slate-700 leading-relaxed mt-0.5">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePage;

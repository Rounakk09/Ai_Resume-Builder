import React, { useState } from 'react';
import { 
  ResumeData, 
  TemplateType, 
  WorkExperienceItem, 
  EducationItem, 
  ProjectItem,
  CertificationItem,
  AISuggestion 
} from '../types';
import { ResumeTemplateRenderer } from './templates/ResumeTemplateRenderer';
import {
  Sparkles,
  Download,
  Save,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plus,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Wand2,
  Layers,
  FileText,
  User,
  GraduationCap,
  Briefcase,
  Code2,
  Award,
  X
} from 'lucide-react';

interface EditorPageProps {
  resume: ResumeData;
  onSave: (updated: ResumeData) => void;
  onBack: () => void;
  onPreview: (resume: ResumeData) => void;
}

type EditorStep = 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';

export const EditorPage: React.FC<EditorPageProps> = ({
  resume,
  onSave,
  onBack,
  onPreview,
}) => {
  // Ensure default arrays exist
  const [data, setData] = useState<ResumeData>({
    ...resume,
    personalDetails: {
      fullName: resume.personalDetails.fullName || `${resume.personalDetails.firstName || ''} ${resume.personalDetails.lastName || ''}`.trim(),
      firstName: resume.personalDetails.firstName || '',
      lastName: resume.personalDetails.lastName || '',
      jobTitle: resume.personalDetails.jobTitle || '',
      email: resume.personalDetails.email || '',
      phone: resume.personalDetails.phone || '',
      location: resume.personalDetails.location || '',
      address: resume.personalDetails.address || resume.personalDetails.location || '',
      linkedin: resume.personalDetails.linkedin || '',
      portfolio: resume.personalDetails.portfolio || resume.personalDetails.website || '',
      website: resume.personalDetails.website || resume.personalDetails.portfolio || '',
    },
    experience: resume.experience || [],
    education: (resume.education || []).map((edu) => ({
      ...edu,
      field: edu.field || '',
      startYear: edu.startYear || edu.startDate || '',
      endYear: edu.endYear || edu.endDate || '',
    })),
    skills: resume.skills || [],
    projects: resume.projects || [
      {
        id: 'proj-1',
        title: 'Core Portfolio Engine',
        description: 'Scalable architecture delivering responsive executive presentation assets.',
        technologies: 'React, TypeScript, Tailwind CSS',
        githubUrl: 'github.com/executive/portfolio',
        liveUrl: 'portfolio.executive.io'
      }
    ],
    certifications: (resume.certifications || []).map((cert, i) => {
      if (typeof cert === 'string') {
        return {
          id: `cert-${i}`,
          name: cert,
          issuer: '',
          issueDate: '',
          credentialUrl: ''
        };
      }
      return cert;
    }),
  });

  const [activeStep, setActiveStep] = useState<EditorStep>('contact');
  const [zoomLevel, setZoomLevel] = useState<number>(90);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Live Synchronized');
  
  // Floating AI suggestion
  const [activeSuggestion, setActiveSuggestion] = useState<AISuggestion | null>({
    id: 'sug-1',
    type: 'quantify',
    title: 'Quantify Leadership Impact',
    message: 'Consider adding verifiable efficiency metrics to your top experience bullets to maximize recruiter conversion.',
    targetField: 'experience',
    targetIndex: 0,
    suggestedText: 'Spearheaded mission-critical system migrations, accelerating organizational delivery velocity by 38% and eliminating redundant operational overhead.',
  });

  const updatePersonalDetails = (field: string, val: string) => {
    setData((prev) => {
      const updatedDetails = {
        ...prev.personalDetails,
        [field]: val,
      };

      // Auto sync firstName / lastName if fullName is edited
      if (field === 'fullName') {
        const parts = val.trim().split(' ');
        updatedDetails.firstName = parts[0] || '';
        updatedDetails.lastName = parts.slice(1).join(' ') || '';
      }

      // Auto sync portfolio and website
      if (field === 'portfolio') {
        updatedDetails.website = val;
      }
      if (field === 'address') {
        updatedDetails.location = val;
      }

      return {
        ...prev,
        lastEdited: 'Edited just now',
        personalDetails: updatedDetails,
      };
    });
    setSaveStatus('Instant Updated');
  };

  const handleImproveSummaryWithAI = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/improve-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: data.personalDetails.jobTitle,
          currentSummary: data.summary,
          skills: data.skills,
        }),
      });
      const result = await res.json();
      if (result.summary) {
        setData((prev) => ({
          ...prev,
          summary: result.summary,
          atsScore: Math.min(98, (prev.atsScore || 85) + 3),
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
      setSaveStatus('Auto-saved');
    }
  };

  const handleRewriteBulletsWithAI = async (expIndex: number) => {
    setIsAiLoading(true);
    try {
      const targetExp = data.experience[expIndex];
      const res = await fetch('/api/ai/rewrite-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: targetExp.jobTitle,
          company: targetExp.company,
          bullets: targetExp.bullets,
        }),
      });
      const result = await res.json();
      if (result.bullets && Array.isArray(result.bullets)) {
        const updatedExp = [...data.experience];
        updatedExp[expIndex].bullets = result.bullets;
        setData((prev) => ({
          ...prev,
          experience: updatedExp,
          atsScore: Math.min(98, (prev.atsScore || 85) + 4),
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
      setSaveStatus('Auto-saved');
    }
  };

  const handleSuggestSkillsWithAI = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: data.personalDetails.jobTitle,
          existingSkills: data.skills,
        }),
      });
      const result = await res.json();
      if (result.skills && Array.isArray(result.skills)) {
        const unique = Array.from(new Set([...data.skills, ...result.skills]));
        setData((prev) => ({
          ...prev,
          skills: unique,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
      setSaveStatus('Auto-saved');
    }
  };

  const applySuggestion = () => {
    if (!activeSuggestion) return;
    if (activeSuggestion.targetField === 'experience' && data.experience.length > 0) {
      const expCopy = [...data.experience];
      if (expCopy[0].bullets.length > 0 && activeSuggestion.suggestedText) {
        expCopy[0].bullets[0] = activeSuggestion.suggestedText;
        setData((prev) => ({
          ...prev,
          experience: expCopy,
          atsScore: 96,
        }));
      }
    }
    setActiveSuggestion(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col font-sans text-[#E5E5E5]">
      {/* Top Editor Bar */}
      <header className="h-16 bg-[#0E0E0E] border-b border-[#2A2A2A] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-neutral-400 hover:text-white hover:bg-[#1A1A1A] rounded transition-colors"
            title="Back to portfolio"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col">
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="font-serif text-sm text-white bg-transparent border-b border-transparent hover:border-[#333333] focus:border-[#D4AF37] focus:outline-none px-1 py-0.5 rounded"
            />
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>{saveStatus}</span>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPreview(data)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-300 bg-[#161616] hover:bg-[#202020] border border-[#2A2A2A] rounded transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Full Preview</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-200 bg-[#161616] border border-[#2A2A2A] hover:bg-[#202020] rounded shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => {
              onSave(data);
              setSaveStatus('Saved in session!');
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-[1.5px] text-black bg-[#D4AF37] hover:bg-[#E5C158] rounded shadow-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </header>

      {/* Main split view container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Form Controls & Stepper */}
        <div className="w-full lg:w-[480px] xl:w-[540px] bg-[#0E0E0E] border-r border-[#2A2A2A] flex flex-col h-[calc(100vh-4rem)] overflow-y-auto editor-scroll">
          {/* Stepper Tabs */}
          <div className="flex border-b border-[#2A2A2A] p-2 bg-[#0A0A0A] gap-1 sticky top-0 z-10 overflow-x-auto">
            {[
              { id: 'contact', label: 'Personal', icon: User },
              { id: 'summary', label: 'Summary', icon: Sparkles },
              { id: 'experience', label: 'Experience', icon: Briefcase },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'skills', label: 'Skills', icon: Layers },
              { id: 'projects', label: 'Projects', icon: Code2 },
              { id: 'certifications', label: 'Certs', icon: Award },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id as EditorStep)}
                  className={`flex-1 min-w-[65px] py-2 px-1 text-[10.5px] font-semibold uppercase tracking-wider rounded flex flex-col items-center gap-1 transition-all ${
                    isActive
                      ? 'bg-[#181818] text-[#D4AF37] shadow-xs border border-[#D4AF37]/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="truncate">{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6 flex-1">
            {/* Step 1: Personal Information */}
            {activeStep === 'contact' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base text-white">Personal Information</h3>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400">Step 1 of 7</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={data.personalDetails.fullName || `${data.personalDetails.firstName || ''} ${data.personalDetails.lastName || ''}`.trim()}
                    onChange={(e) => updatePersonalDetails('fullName', e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Professional Role / Title
                  </label>
                  <input
                    type="text"
                    value={data.personalDetails.jobTitle}
                    onChange={(e) => updatePersonalDetails('jobTitle', e.target.value)}
                    placeholder="e.g. Lead Product Strategist"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={data.personalDetails.email}
                      onChange={(e) => updatePersonalDetails('email', e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={data.personalDetails.phone}
                      onChange={(e) => updatePersonalDetails('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Address / Location
                  </label>
                  <input
                    type="text"
                    value={data.personalDetails.address || data.personalDetails.location || ''}
                    onChange={(e) => updatePersonalDetails('address', e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      value={data.personalDetails.linkedin || ''}
                      onChange={(e) => updatePersonalDetails('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/username"
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Portfolio / Website
                    </label>
                    <input
                      type="text"
                      value={data.personalDetails.portfolio || data.personalDetails.website || ''}
                      onChange={(e) => updatePersonalDetails('portfolio', e.target.value)}
                      placeholder="portfolio.me"
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Summary */}
            {activeStep === 'summary' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base text-white">Professional Summary</h3>
                  <button
                    onClick={handleImproveSummaryWithAI}
                    disabled={isAiLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E5C158] text-black rounded text-[11px] font-bold uppercase tracking-wider shadow-xs disabled:opacity-50 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAiLoading ? 'Synthesizing...' : 'AI Enhance'}</span>
                  </button>
                </div>
                <p className="text-xs text-neutral-400 font-light">
                  A high-impact executive summary articulating your core expertise, career defining milestones, and value proposition.
                </p>
                <textarea
                  rows={7}
                  value={data.summary}
                  onChange={(e) => setData({ ...data, summary: e.target.value })}
                  placeholder="Senior professional with track record of driving cross-functional growth..."
                  className="w-full p-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs leading-relaxed text-neutral-200 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            )}

            {/* Step 3: Experience */}
            {activeStep === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base text-white">Work Experience</h3>
                    <span className="text-xs text-neutral-400 font-light">Add multiple career roles and achievements</span>
                  </div>
                  <button
                    onClick={() => {
                      const newExp: WorkExperienceItem = {
                        id: `exp-${Date.now()}`,
                        jobTitle: 'Senior Strategist',
                        company: 'Enterprise Partners',
                        location: 'San Francisco, CA',
                        duration: '2022 – Present',
                        startDate: '2022',
                        endDate: 'Present',
                        isPresent: true,
                        description: 'Directed core initiatives elevating operational efficiency and client adoption.',
                        bullets: [
                          'Delivered enterprise architectures accelerating quarterly releases by 35%.',
                          'Mentored cross-functional team of 6 product specialists.'
                        ],
                      };
                      setData({ ...data, experience: [newExp, ...data.experience] });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#181818] border border-[#2A2A2A] hover:border-[#D4AF37]/50 text-[#D4AF37] rounded text-xs font-semibold uppercase tracking-wider"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                </div>

                {data.experience.length === 0 && (
                  <div className="p-8 text-center border border-dashed border-[#2A2A2A] rounded-xl text-xs text-neutral-500">
                    No experience records. Click "Add Role" to add your professional history.
                  </div>
                )}

                {data.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-4 bg-[#121212] border border-[#2A2A2A] rounded-xl space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                        Role #{idx + 1}
                      </span>
                      <button
                        onClick={() => {
                          setData({
                            ...data,
                            experience: data.experience.filter((_, i) => i !== idx),
                          });
                        }}
                        className="text-neutral-500 hover:text-rose-400 p-1"
                        title="Remove role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Role / Title
                        </label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => {
                            const copy = [...data.experience];
                            copy[idx].jobTitle = e.target.value;
                            setData({ ...data, experience: copy });
                          }}
                          placeholder="e.g. Lead Designer"
                          className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const copy = [...data.experience];
                            copy[idx].company = e.target.value;
                            setData({ ...data, experience: copy });
                          }}
                          placeholder="e.g. TechCorp Inc."
                          className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={exp.duration || (exp.startDate ? `${exp.startDate} – ${exp.isPresent ? 'Present' : exp.endDate || ''}` : '')}
                          onChange={(e) => {
                            const copy = [...data.experience];
                            copy[idx].duration = e.target.value;
                            setData({ ...data, experience: copy });
                          }}
                          placeholder="e.g. 2021 – Present"
                          className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Location (Optional)
                        </label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => {
                            const copy = [...data.experience];
                            copy[idx].location = e.target.value;
                            setData({ ...data, experience: copy });
                          }}
                          placeholder="e.g. Remote / New York"
                          className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Role Overview / Description
                      </label>
                      <textarea
                        rows={2}
                        value={exp.description || ''}
                        onChange={(e) => {
                          const copy = [...data.experience];
                          copy[idx].description = e.target.value;
                          setData({ ...data, experience: copy });
                        }}
                        placeholder="Brief overview of responsibilities and scope..."
                        className="w-full p-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs leading-tight text-neutral-200 focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    {/* Bullet Points */}
                    <div className="pt-2 border-t border-[#2A2A2A] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                          Accomplishments / Key Bullets
                        </label>
                        <button
                          onClick={() => handleRewriteBulletsWithAI(idx)}
                          disabled={isAiLoading}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] hover:text-[#E5C158]"
                        >
                          <Wand2 className="w-3 h-3" />
                          <span>AI Optimize Metrics</span>
                        </button>
                      </div>

                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-1.5">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => {
                              const copy = [...data.experience];
                              copy[idx].bullets[bIdx] = e.target.value;
                              setData({ ...data, experience: copy });
                            }}
                            className="w-full p-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs leading-tight text-neutral-200 focus:border-[#D4AF37] focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              const copy = [...data.experience];
                              copy[idx].bullets = copy[idx].bullets.filter((_, i) => i !== bIdx);
                              setData({ ...data, experience: copy });
                            }}
                            className="text-neutral-500 hover:text-rose-400 p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          const copy = [...data.experience];
                          copy[idx].bullets.push('Spearheaded core delivery initiatives expanding market share.');
                          setData({ ...data, experience: copy });
                        }}
                        className="text-[11px] text-[#D4AF37] font-semibold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Bullet Point</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Education */}
            {activeStep === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base text-white">Academic History</h3>
                    <span className="text-xs text-neutral-400 font-light">Add multiple degrees or academic institutions</span>
                  </div>
                  <button
                    onClick={() => {
                      const newEdu: EducationItem = {
                        id: `edu-${Date.now()}`,
                        degree: 'Bachelor of Science',
                        field: 'Computer Science',
                        institution: 'University of California, Berkeley',
                        startYear: '2016',
                        endYear: '2020',
                      };
                      setData({ ...data, education: [...data.education, newEdu] });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#181818] border border-[#2A2A2A] text-[#D4AF37] rounded text-xs font-semibold uppercase tracking-wider hover:border-[#D4AF37]/50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Degree</span>
                  </button>
                </div>

                {data.education.length === 0 && (
                  <div className="p-8 text-center border border-dashed border-[#2A2A2A] rounded-xl text-xs text-neutral-500">
                    No education records added yet. Click "Add Degree" to record academic credentials.
                  </div>
                )}

                {data.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 bg-[#121212] border border-[#2A2A2A] rounded-xl space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                        Degree #{idx + 1}
                      </span>
                      <button
                        onClick={() => {
                          setData({
                            ...data,
                            education: data.education.filter((_, i) => i !== idx),
                          });
                        }}
                        className="text-neutral-500 hover:text-rose-400 p-1"
                        title="Remove degree"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Institution / University
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const copy = [...data.education];
                          copy[idx].institution = e.target.value;
                          setData({ ...data, education: copy });
                        }}
                        placeholder="e.g. Stanford University"
                        className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Degree
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const copy = [...data.education];
                            copy[idx].degree = e.target.value;
                            setData({ ...data, education: copy });
                          }}
                          placeholder="e.g. Bachelor of Science"
                          className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          value={edu.field || ''}
                          onChange={(e) => {
                            const copy = [...data.education];
                            copy[idx].field = e.target.value;
                            setData({ ...data, education: copy });
                          }}
                          placeholder="e.g. Software Engineering"
                          className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Start Year
                        </label>
                        <input
                          type="text"
                          value={edu.startYear || edu.startDate || ''}
                          onChange={(e) => {
                            const copy = [...data.education];
                            copy[idx].startYear = e.target.value;
                            copy[idx].startDate = e.target.value;
                            setData({ ...data, education: copy });
                          }}
                          placeholder="e.g. 2016"
                          className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          End Year
                        </label>
                        <input
                          type="text"
                          value={edu.endYear || edu.endDate || ''}
                          onChange={(e) => {
                            const copy = [...data.education];
                            copy[idx].endYear = e.target.value;
                            copy[idx].endDate = e.target.value;
                            setData({ ...data, education: copy });
                          }}
                          placeholder="e.g. 2020"
                          className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Skills */}
            {activeStep === 'skills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base text-white">Skills & Competencies</h3>
                  <button
                    onClick={handleSuggestSkillsWithAI}
                    disabled={isAiLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] text-black rounded text-[11px] font-bold uppercase tracking-wider shadow-xs disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Skill Matrix</span>
                  </button>
                </div>

                <p className="text-xs text-neutral-400 font-light">
                  Add key technical, strategic, and domain skills. These feed directly into ATS keyword indexing.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {data.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] border border-[#2A2A2A] text-neutral-200 rounded text-xs font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => {
                          setData({
                            ...data,
                            skills: data.skills.filter((_, i) => i !== idx),
                          });
                        }}
                        className="text-neutral-500 hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add custom skill input */}
                <div className="flex gap-2 pt-2">
                  <input
                    id="new-skill-input"
                    type="text"
                    placeholder="Type skill & press Enter (e.g. React, Strategic Roadmapping)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val && !data.skills.includes(val)) {
                          setData({ ...data, skills: [...data.skills, val] });
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('new-skill-input') as HTMLInputElement;
                      if (input && input.value.trim() && !data.skills.includes(input.value.trim())) {
                        setData({ ...data, skills: [...data.skills, input.value.trim()] });
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold uppercase tracking-wider rounded text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Projects */}
            {activeStep === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base text-white">Featured Projects</h3>
                    <span className="text-xs text-neutral-400 font-light">Add multiple technical and design projects</span>
                  </div>
                  <button
                    onClick={() => {
                      const newProj: ProjectItem = {
                        id: `proj-${Date.now()}`,
                        title: 'Distributed Cloud Dashboard',
                        description: 'Architected high-throughput data visualization engine processing 50k events/sec.',
                        technologies: 'React, TypeScript, Node.js, D3.js',
                        githubUrl: 'github.com/profile/cloud-monitor',
                        liveUrl: 'cloudmonitor.io'
                      };
                      setData({ ...data, projects: [...(data.projects || []), newProj] });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#181818] border border-[#2A2A2A] text-[#D4AF37] rounded text-xs font-semibold uppercase tracking-wider hover:border-[#D4AF37]/50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {(data.projects || []).length === 0 && (
                  <div className="p-8 text-center border border-dashed border-[#2A2A2A] rounded-xl text-xs text-neutral-500">
                    No projects listed. Click "Add Project" to add your open source or enterprise builds.
                  </div>
                )}

                {(data.projects || []).map((proj, idx) => (
                  <div key={proj.id} className="p-4 bg-[#121212] border border-[#2A2A2A] rounded-xl space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                        Project #{idx + 1}
                      </span>
                      <button
                        onClick={() => {
                          setData({
                            ...data,
                            projects: (data.projects || []).filter((_, i) => i !== idx),
                          });
                        }}
                        className="text-neutral-500 hover:text-rose-400 p-1"
                        title="Remove project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const copy = [...(data.projects || [])];
                          copy[idx].title = e.target.value;
                          setData({ ...data, projects: copy });
                        }}
                        placeholder="e.g. Real-Time Analytics Pipeline"
                        className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          const copy = [...(data.projects || [])];
                          copy[idx].description = e.target.value;
                          setData({ ...data, projects: copy });
                        }}
                        placeholder="Key architectural highlights and user outcomes..."
                        className="w-full p-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs leading-tight text-neutral-200 focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Technologies Used
                        </label>
                        <input
                          type="text"
                          value={proj.technologies}
                          onChange={(e) => {
                            const copy = [...(data.projects || [])];
                            copy[idx].technologies = e.target.value;
                            setData({ ...data, projects: copy });
                          }}
                          placeholder="e.g. Next.js, Go, PostgreSQL"
                          className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          GitHub / Project Link
                        </label>
                        <input
                          type="text"
                          value={proj.githubUrl || ''}
                          onChange={(e) => {
                            const copy = [...(data.projects || [])];
                            copy[idx].githubUrl = e.target.value;
                            setData({ ...data, projects: copy });
                          }}
                          placeholder="github.com/user/project"
                          className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 7: Certifications */}
            {activeStep === 'certifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base text-white">Certifications & Licenses</h3>
                    <span className="text-xs text-neutral-400 font-light">Add industry credentials and accreditations</span>
                  </div>
                  <button
                    onClick={() => {
                      const newCert: CertificationItem = {
                        id: `cert-${Date.now()}`,
                        name: 'AWS Certified Solutions Architect',
                        issuer: 'Amazon Web Services',
                        issueDate: '2023',
                        credentialUrl: 'aws.amazon.com/verify/102938'
                      };
                      setData({
                        ...data,
                        certifications: [...(data.certifications || []), newCert],
                      });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#181818] border border-[#2A2A2A] text-[#D4AF37] rounded text-xs font-semibold uppercase tracking-wider hover:border-[#D4AF37]/50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Certificate</span>
                  </button>
                </div>

                {(data.certifications || []).length === 0 && (
                  <div className="p-8 text-center border border-dashed border-[#2A2A2A] rounded-xl text-xs text-neutral-500">
                    No certifications added. Click "Add Certificate" to showcase your accredited credentials.
                  </div>
                )}

                {(data.certifications || []).map((cert, idx) => {
                  const certObj: CertificationItem = typeof cert === 'string'
                    ? { id: `cert-${idx}`, name: cert, issuer: '', issueDate: '', credentialUrl: '' }
                    : cert;

                  return (
                    <div key={certObj.id || idx} className="p-4 bg-[#121212] border border-[#2A2A2A] rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                          Credential #{idx + 1}
                        </span>
                        <button
                          onClick={() => {
                            setData({
                              ...data,
                              certifications: (data.certifications || []).filter((_, i) => i !== idx),
                            });
                          }}
                          className="text-neutral-500 hover:text-rose-400 p-1"
                          title="Remove certificate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Certification Title / Name
                        </label>
                        <input
                          type="text"
                          value={certObj.name}
                          onChange={(e) => {
                            const copy = [...(data.certifications || [])];
                            const updatedObj = { ...certObj, name: e.target.value };
                            copy[idx] = updatedObj;
                            setData({ ...data, certifications: copy });
                          }}
                          placeholder="e.g. AWS Solutions Architect Professional"
                          className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                            Issuing Organization
                          </label>
                          <input
                            type="text"
                            value={certObj.issuer || ''}
                            onChange={(e) => {
                              const copy = [...(data.certifications || [])];
                              const updatedObj = { ...certObj, issuer: e.target.value };
                              copy[idx] = updatedObj;
                              setData({ ...data, certifications: copy });
                            }}
                            placeholder="e.g. Amazon Web Services"
                            className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                            Year / Issue Date
                          </label>
                          <input
                            type="text"
                            value={certObj.issueDate || ''}
                            onChange={(e) => {
                              const copy = [...(data.certifications || [])];
                              const updatedObj = { ...certObj, issueDate: e.target.value };
                              copy[idx] = updatedObj;
                              setData({ ...data, certifications: copy });
                            }}
                            placeholder="e.g. 2023"
                            className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Credential URL / ID (Optional)
                        </label>
                        <input
                          type="text"
                          value={certObj.credentialUrl || ''}
                          onChange={(e) => {
                            const copy = [...(data.certifications || [])];
                            const updatedObj = { ...certObj, credentialUrl: e.target.value };
                            copy[idx] = updatedObj;
                            setData({ ...data, certifications: copy });
                          }}
                          placeholder="e.g. credential.net/id-12345"
                          className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Scaled A4 Preview Stage */}
        <div className="flex-1 bg-[#050505] relative flex flex-col items-center overflow-y-auto p-4 sm:p-8">
          {/* Top Control Overlay (Zoom & Template Selector) */}
          <div className="sticky top-2 z-20 flex items-center gap-3 bg-[#121212]/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-[#2A2A2A] mb-6">
            {/* Template Selector */}
            <div className="flex items-center gap-2 pr-3 border-r border-[#2A2A2A]">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Layout:</span>
              <select
                value={data.template}
                onChange={(e) => setData({ ...data, template: e.target.value as TemplateType })}
                className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="minimalist" className="bg-[#121212]">Minimalist</option>
                <option value="executive" className="bg-[#121212]">Executive</option>
                <option value="creative" className="bg-[#121212]">Creative</option>
                <option value="modern" className="bg-[#121212]">Modern</option>
              </select>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-[#1F1F1F]"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-medium text-neutral-300 w-10 text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-[#1F1F1F]"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(90)}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-[#1F1F1F]"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scaled A4 Document Container */}
          <div
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
            }}
            className="w-[210mm] min-h-[297mm] shadow-2xl bg-white rounded-xs mb-16"
            id="printable-resume"
          >
            <ResumeTemplateRenderer data={data} template={data.template} />
          </div>

          {/* Floating AI Suggestion Card at bottom right */}
          {activeSuggestion && (
            <div className="fixed bottom-6 right-6 max-w-sm bg-[#141414]/98 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-[#D4AF37]/40 z-30 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>{activeSuggestion.title}</span>
                </div>
                <button
                  onClick={() => setActiveSuggestion(null)}
                  className="text-neutral-500 hover:text-neutral-300 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed font-light">
                {activeSuggestion.message}
              </p>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setActiveSuggestion(null)}
                  className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white rounded"
                >
                  Dismiss
                </button>
                <button
                  onClick={applySuggestion}
                  className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E5C158] text-black text-xs font-bold uppercase tracking-wider rounded shadow-sm transition-all"
                >
                  Apply Calibration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

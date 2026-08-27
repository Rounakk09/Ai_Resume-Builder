import React, { useState } from 'react';
import { ResumeData, AppView } from '../types';
import {
  Sparkles,
  Plus,
  Edit3,
  Eye,
  MoreVertical,
  TrendingUp,
  ArrowRight,
  Search,
  LayoutGrid,
  List,
  Clock,
  Trash2,
  Copy,
  Download
} from 'lucide-react';

interface DashboardPageProps {
  resumes: ResumeData[];
  onSelectResume: (resume: ResumeData) => void;
  onPreviewResume: (resume: ResumeData) => void;
  onCreateNew: () => void;
  onDeleteResume: (id: string) => void;
  onDuplicateResume: (resume: ResumeData) => void;
  onNavigate: (view: AppView) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  resumes,
  onSelectResume,
  onPreviewResume,
  onCreateNew,
  onDeleteResume,
  onDuplicateResume,
  onNavigate,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredResumes = resumes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.personalDetails.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 bg-[#0A0A0A] text-[#E5E5E5]">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            Portfolio Workspace
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            You have active candidate assets in circulation. Calibrate and distribute your portfolio.
          </p>
        </div>
        <button
          id="dashboard-top-create-btn"
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold text-xs uppercase tracking-[1.5px] py-2.5 px-4 rounded shadow-md transition-all self-start sm:self-auto hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Resume</span>
        </button>
      </div>

      {/* AI Insights Bento Card */}
      <div className="bg-gradient-to-br from-[#1A1812] via-[#121212] to-[#0A0A0A] rounded-xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-[#D4AF37]/30">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/40 px-3 py-1 rounded-full text-[10px] font-semibold text-[#D4AF37] uppercase tracking-[2px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXECUTIVE INTELLIGENCE</span>
          </div>
          <h2 className="text-xl font-serif tracking-tight text-white font-normal">
            Calibrate for &ldquo;Principal Product Strategist&rdquo;
          </h2>
          <p className="text-xs text-neutral-300 leading-relaxed font-light">
            Quantified metric density in your TechCorp tenure can elevate algorithmic keyword match by 15% across Tier-1 enterprise screeners.
          </p>
          <button
            onClick={() => onNavigate('optimizer')}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#D4AF37] hover:text-white pt-1 transition-colors group"
          >
            <span>Inspect Recommendations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ATS Score Radial Indicator */}
        <div className="flex items-center gap-4 bg-[#0A0A0A]/80 backdrop-blur-md rounded-xl p-4 border border-[#2A2A2A] shrink-0">
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* SVG Circle Gauge */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-neutral-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#D4AF37]"
                strokeDasharray="85, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-serif font-bold text-white">85</span>
              <span className="text-[9px] text-neutral-400 font-medium -mt-1">/ 100</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-white uppercase tracking-wider">ATS Alignment</div>
            <div className="text-[11px] text-[#D4AF37] font-medium">Distinguished Profile</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">Across 3 Documents</div>
          </div>
        </div>
      </div>

      {/* My Resumes Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-serif text-white">Archived Documents</h2>
            <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/30">
              {filteredResumes.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#121212] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-[#121212] p-1 rounded border border-[#2A2A2A]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-[#1F1F1F] text-[#D4AF37]' : 'text-neutral-500 hover:text-neutral-300'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-[#1F1F1F] text-[#D4AF37]' : 'text-neutral-500 hover:text-neutral-300'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Cards Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card (Dashed) */}
            <button
              id="dashboard-new-resume-card-btn"
              onClick={onCreateNew}
              className="border border-dashed border-[#333333] hover:border-[#D4AF37] rounded-xl p-6 flex flex-col items-center justify-center text-center group bg-[#0F0F0F] hover:bg-[#141414] transition-all min-h-[300px]"
            >
              <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/40 group-hover:bg-[#D4AF37] text-[#D4AF37] group-hover:text-black flex items-center justify-center transition-all mb-3 shadow-xs">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm text-white group-hover:text-[#D4AF37] transition-colors">
                Draft New Document
              </h3>
              <p className="text-[11px] text-neutral-400 mt-1 max-w-[200px] font-light">
                Initialize with curated executive structure and ATS compliance.
              </p>
            </button>

            {/* Existing Resumes */}
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-[#121212] rounded-xl border border-[#2A2A2A] hover:border-[#D4AF37]/60 transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Thumbnail Preview Area */}
                <div className="relative aspect-[16/10] bg-[#1A1A1A] overflow-hidden border-b border-[#2A2A2A]">
                  <img
                    src={
                      resume.thumbnailUrl ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVH-ndMMNHC6UsjZ12eOfDwY6jqF1sNRNuOQsucV9EGB64bhWlnL9gSrweQR31YvAA_7W3e16RHQhbt6TEQVjMqgXOipETPm3HeFhlX_Lmg1tKa8FxPSeR4WQYy6bXYOzke7EeG6fuHSg-s-euWVjYGqPHd_Y5S4m-keqJzkQa8Ac2jh9E21DNBz6utiUOiCkEZNGufDtUf3gxymOQx9-OAJZ8RdNxV0LyhFS9NTiiW6SBCrHu_lp4'
                    }
                    alt={resume.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />
                  {/* ATS Badge */}
                  {resume.atsScore && (
                    <div className="absolute top-3 right-3 bg-[#0A0A0A]/90 backdrop-blur-md px-2.5 py-0.5 rounded border border-[#D4AF37]/40 flex items-center gap-1.5 text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      <span>{resume.atsScore}% ATS</span>
                    </div>
                  )}
                  {/* Template tag */}
                  <div className="absolute bottom-2 left-2 bg-[#0A0A0A]/85 border border-[#2A2A2A] text-neutral-300 px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-widest">
                    {resume.template}
                  </div>
                </div>

                {/* Card Info & Actions */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-sm text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                        {resume.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>{resume.lastEdited}</span>
                      </div>
                    </div>

                    {/* Context menu */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === resume.id ? null : resume.id)}
                        className="p-1 text-neutral-400 hover:text-white rounded hover:bg-[#1A1A1A]"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {activeMenuId === resume.id && (
                        <div className="absolute right-0 top-7 w-36 bg-[#161616] rounded shadow-xl border border-[#2A2A2A] py-1.5 z-20 text-xs">
                          <button
                            onClick={() => {
                              onDuplicateResume(resume);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-neutral-300 hover:text-white hover:bg-[#222222]"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Duplicate</span>
                          </button>
                          <button
                            onClick={() => {
                              onDeleteResume(resume.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-rose-400 hover:bg-rose-950/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onSelectResume(resume)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#D4AF37] hover:bg-[#E5C158] text-black rounded font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onPreviewResume(resume)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1A1A1A] hover:bg-[#252525] text-neutral-200 rounded font-medium text-xs uppercase tracking-wider border border-[#2A2A2A] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-[#121212] rounded-xl border border-[#2A2A2A] divide-y divide-[#2A2A2A] overflow-hidden">
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className="p-4 flex items-center justify-between hover:bg-[#181818] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-16 bg-[#1A1A1A] rounded border border-[#2A2A2A] overflow-hidden shrink-0">
                    <img
                      src={
                        resume.thumbnailUrl ||
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuAVH-ndMMNHC6UsjZ12eOfDwY6jqF1sNuOQsucV9EGB64bhWlnL9gSrweQR31YvAA_7W3e16RHQhbt6TEQVjMqgXOipETPm3HeFhlX_Lmg1tKa8FxPSeR4WQYy6bXYOzke7EeG6fuHSg-s-euWVjYGqPHd_Y5S4m-keqJzkQa8Ac2jh9E21DNBz6utiUOiCkEZNGufDtUf3gxymOQx9-OAJZ8RdNxV0LyhFS9NTiiW6SBCrHu_lp4'
                      }
                      alt={resume.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm text-white">{resume.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mt-0.5">
                      <span>Template: <strong className="capitalize text-neutral-300">{resume.template}</strong></span>
                      <span>•</span>
                      <span>{resume.lastEdited}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {resume.atsScore && (
                    <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2.5 py-1 rounded">
                      {resume.atsScore}% ATS
                    </span>
                  )}
                  <button
                    onClick={() => onSelectResume(resume)}
                    className="p-2 text-neutral-400 hover:text-[#D4AF37] rounded hover:bg-[#202020]"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onPreviewResume(resume)}
                    className="p-2 text-neutral-400 hover:text-[#D4AF37] rounded hover:bg-[#202020]"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteResume(resume.id)}
                    className="p-2 text-neutral-400 hover:text-rose-400 rounded hover:bg-rose-950/30"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

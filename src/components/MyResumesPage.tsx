import React, { useState } from 'react';
import { AppView, ResumeData } from '../types';
import {
  FileText,
  Plus,
  Search,
  SlidersHorizontal,
  Clock,
  Sparkles,
  Edit3,
  Eye,
  Trash2,
  Copy,
  TrendingUp,
  ArrowLeft,
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import { resumeApi } from '../services/api';
import { useToast } from './Toast';

interface MyResumesPageProps {
  resumes: ResumeData[];
  onNavigate: (view: AppView) => void;
  onSelectResume: (resume: ResumeData) => void;
  onCreateNew: () => void;
  onDeleteResume: (id: string) => Promise<void>;
  onDuplicateResume?: (resume: ResumeData) => Promise<void>;
}

export const MyResumesPage: React.FC<MyResumesPageProps> = ({
  resumes,
  onNavigate,
  onSelectResume,
  onCreateNew,
  onDeleteResume,
  onDuplicateResume,
}) => {
  const { showSuccess, showError, showInfo } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredResumes = resumes.filter((resume) => {
    const fullName = resume.personalDetails?.fullName || `${resume.personalDetails?.firstName || ''} ${resume.personalDetails?.lastName || ''}`.trim() || '';
    const jobTitle = resume.personalDetails?.jobTitle || '';
    const titleMatch = (resume.title || fullName || 'Untitled')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const roleMatch = jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const currentTemplate = resume.template || 'executive';
    const templateMatch =
      templateFilter === 'all' || currentTemplate === templateFilter;

    return (titleMatch || roleMatch) && templateMatch;
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this executive resume?')) {
      try {
        setDeletingId(id);
        await onDeleteResume(id);
        showSuccess('Resume Deleted', 'The resume has been permanently removed.');
      } catch (err: any) {
        showError('Delete Failed', err.message || 'Could not delete resume.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDuplicate = async (e: React.MouseEvent, resume: ResumeData) => {
    e.stopPropagation();
    if (onDuplicateResume) {
      try {
        await onDuplicateResume(resume);
        showSuccess('Resume Duplicated', `Created a copy of ${resume.title || 'Resume'}.`);
      } catch (err: any) {
        showError('Duplication Failed', err.message || 'Could not duplicate resume.');
      }
    } else {
      showInfo('Duplicating...', 'Creating clone in workspace');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 bg-[#0A0A0A] text-[#E5E5E5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-6">
        <div className="flex items-center gap-4">
          <button
            id="myresumes-back-btn"
            onClick={() => onNavigate('dashboard')}
            className="p-2 bg-[#141414] hover:bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg text-neutral-400 hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-serif text-white tracking-tight">Executive Resumes</h1>
            <p className="text-xs text-neutral-400 mt-0.5 font-light">
              Manage, customize, and deploy your tailored career assets.
            </p>
          </div>
        </div>

        <button
          id="myresumes-create-btn"
          onClick={onCreateNew}
          className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold text-xs uppercase tracking-[1.5px] py-2.5 px-4 rounded shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Resume</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="myresumes-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by resume title, executive role, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#121212] border border-[#2A2A2A] rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-neutral-500 hidden sm:block" />
          <select
            id="myresumes-template-filter"
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            className="bg-[#121212] border border-[#2A2A2A] text-xs text-neutral-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">All Templates</option>
            <option value="executive">Executive Serif</option>
            <option value="modern">Modern Minimal</option>
            <option value="technical">Technical Grid</option>
            <option value="creative">Creative Portfolio</option>
          </select>
        </div>
      </div>

      {/* Content Section */}
      {filteredResumes.length === 0 ? (
        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif text-white tracking-tight">No Resumes Found</h3>
          <p className="text-xs text-neutral-400 mt-2 font-light leading-relaxed">
            {searchTerm || templateFilter !== 'all'
              ? 'No documents matched your query. Try clearing filters or search terms.'
              : 'You haven’t formulated any career assets yet. Create your first executive resume with AI-driven scoring.'}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setTemplateFilter('all');
                }}
                className="px-3.5 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333] text-neutral-300 rounded text-xs"
              >
                Clear Filters
              </button>
            )}
            <button
              id="myresumes-empty-create-btn"
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold text-xs uppercase tracking-[1.5px] py-2 px-4 rounded transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Resume</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => {
            const atsScore = resume.atsScore || 85;
            const updatedDate = resume.updatedAt
              ? new Date(resume.updatedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recently';

            return (
              <div
                key={resume.id}
                id={`resume-card-${resume.id}`}
                onClick={() => {
                  onSelectResume(resume);
                  onNavigate('editor');
                }}
                className="group relative bg-[#121212] hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#D4AF37]/50 rounded-xl p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl"
              >
                {/* Card Top Info */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-[#1A1A1A] border border-[#333] text-[#D4AF37] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1F1F1F] border border-[#333] text-neutral-300">
                        {resume.template || 'Executive'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      <span>{atsScore}% ATS</span>
                    </div>
                  </div>

                  <h3 className="text-base font-serif text-white font-medium group-hover:text-[#D4AF37] transition-colors truncate">
                    {resume.title || resume.personalDetails?.fullName || 'Untitled Resume'}
                  </h3>

                  <p className="text-xs text-neutral-400 font-light mt-1 truncate">
                    {resume.personalDetails?.jobTitle || 'Executive Professional'}
                  </p>
                </div>

                {/* Card Bottom Meta & Actions */}
                <div className="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                    <Clock className="w-3 h-3" />
                    <span>{updatedDate}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      id={`edit-resume-${resume.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectResume(resume);
                        onNavigate('editor');
                      }}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#222] rounded transition-colors"
                      title="Edit Resume"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`preview-resume-${resume.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectResume(resume);
                        onNavigate('preview');
                      }}
                      className="p-1.5 text-neutral-400 hover:text-[#D4AF37] hover:bg-[#222] rounded transition-colors"
                      title="Preview Resume"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`duplicate-resume-${resume.id}`}
                      onClick={(e) => handleDuplicate(e, resume)}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#222] rounded transition-colors"
                      title="Duplicate Resume"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`delete-resume-${resume.id}`}
                      disabled={deletingId === resume.id}
                      onClick={(e) => handleDelete(e, resume.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

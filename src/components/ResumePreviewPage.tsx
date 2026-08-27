import React, { useState } from 'react';
import { ResumeData, TemplateType } from '../types';
import { ResumeTemplateRenderer } from './templates/ResumeTemplateRenderer';
import {
  ArrowLeft,
  Download,
  Share2,
  Edit3,
  Check,
  Printer,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface ResumePreviewPageProps {
  resume: ResumeData;
  onEdit: (resume: ResumeData) => void;
  onBack: () => void;
}

export const ResumePreviewPage: React.FC<ResumePreviewPageProps> = ({
  resume,
  onEdit,
  onBack,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(resume.template);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://syntheticcareer.app/share/${resume.id}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const filename = `${resume.personalDetails.firstName || 'Executive'}_${resume.personalDetails.lastName || 'Resume'}_Resume.pdf`;

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col font-sans text-[#E5E5E5]">
      {/* Top Preview Bar */}
      <header className="h-16 bg-[#0E0E0E] border-b border-[#2A2A2A] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-neutral-400 hover:text-white hover:bg-[#1A1A1A] rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="font-serif text-sm text-white flex items-center gap-2">
              <span>{filename}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                Calibrated ATS
              </span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-400">
              {resume.lastEdited} • Layout: <span className="capitalize font-semibold text-[#D4AF37]">{selectedTemplate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Template Switcher */}
          <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-[#2A2A2A]">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Layout:</span>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as TemplateType)}
              className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1.5 focus:outline-none"
            >
              <option value="minimalist" className="bg-[#141414]">The Minimalist</option>
              <option value="executive" className="bg-[#141414]">The Executive</option>
              <option value="creative" className="bg-[#141414]">The Creative</option>
              <option value="modern" className="bg-[#141414]">Modern</option>
            </select>
          </div>

          <button
            onClick={() => onEdit(resume)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-300 bg-[#161616] hover:bg-[#222222] border border-[#2A2A2A] rounded transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-200 bg-[#161616] border border-[#2A2A2A] hover:bg-[#222222] rounded shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Share Link</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-[1.5px] text-black bg-[#D4AF37] hover:bg-[#E5C158] rounded shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="flex-1 p-6 md:p-12 flex justify-center items-start overflow-y-auto">
        <div
          id="printable-resume"
          className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-2xl rounded-xs overflow-hidden"
        >
          <ResumeTemplateRenderer data={resume} template={selectedTemplate} />
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141414] rounded-xl p-6 max-w-md w-full shadow-2xl border border-[#2A2A2A] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base text-white">Share Dossier Link</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-neutral-400 hover:text-white text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-neutral-400 font-light">
              Anyone with this cryptographic link can inspect your verified career credentials.
            </p>
            <div className="flex items-center gap-2 p-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent text-xs text-neutral-300 focus:outline-none font-mono"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E5C158] text-black rounded text-xs font-bold uppercase tracking-wider shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

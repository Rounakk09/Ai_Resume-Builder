import React, { useState } from 'react';
import { ResumeData, AtsScanResult } from '../types';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Target,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useToast } from './Toast';

interface AtsOptimizerPageProps {
  resumes: ResumeData[];
  onApplyKeywordsToResume: (resumeId: string, newSkills: string[]) => void;
}

export const AtsOptimizerPage: React.FC<AtsOptimizerPageProps> = ({
  resumes,
  onApplyKeywordsToResume,
}) => {
  const { showSuccess, showError, showInfo } = useToast();
  const [selectedResumeId, setSelectedResumeId] = useState<string>(resumes[0]?.id || '');
  const [jobDescription, setJobDescription] = useState<string>(
    `Role: Senior Product Designer / Lead UX
Company: TechCorp
Requirements:
- 6+ years designing enterprise SaaS applications and cloud platforms.
- Mastery of Figma, design systems, design tokens, and DesignOps workflows.
- Strong track record of running qualitative usability testing, quantitative A/B testing, and WCAG 2.1 accessibility compliance.
- Excellent communication with engineering and product partners to establish MVP scopes and design token pipelines.`
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<AtsScanResult | null>({
    score: 94,
    matchLevel: 'Exceptional',
    matchedKeywords: ['Design Systems', 'Figma', 'Prototyping', 'User Research', 'Information Architecture', 'Enterprise UX'],
    missingKeywords: ['Design Tokens', 'Design Operations (DesignOps)', 'WCAG 2.1 AA Compliance', 'Quantitative A/B Testing'],
    suggestions: [
      'Add explicit metrics on design token tokenization and component adoption rate.',
      'Highlight accessibility compliance testing with screen readers or WCAG standards.',
      'Quantify team mentorship impact (e.g., promoted 2 direct reports).',
    ],
    strengths: [
      'Strong action-oriented bullet points with clear numerical impact.',
      'Clean, standard typography that parses easily into ATS systems.',
      'Concise professional summary emphasizing 8+ years of enterprise experience.',
    ],
  });

  const selectedResume = resumes.find((r) => r.id === selectedResumeId) || resumes[0];

  const handleScan = async () => {
    if (!jobDescription.trim()) {
      showError('Missing Job Description', 'Please provide a target job description to calibrate your resume.');
      return;
    }
    setIsScanning(true);
    try {
      const resumeContent = JSON.stringify(selectedResume);
      const res = await fetch('/api/ai/ats-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          resumeText: resumeContent,
        }),
      });
      const data = await res.json();
      setScanResult(data);
      showSuccess('ATS Scan Complete', `Calibration achieved an ATS index of ${data.score}%.`);
    } catch (e) {
      console.error(e);
      showError('Scan Error', 'Could not complete the ATS calibration. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddMissingKeywords = () => {
    if (scanResult && selectedResume) {
      onApplyKeywordsToResume(selectedResume.id, scanResult.missingKeywords);
      const count = scanResult.missingKeywords.length;
      // Remove added keywords from missing
      setScanResult({
        ...scanResult,
        matchedKeywords: [...scanResult.matchedKeywords, ...scanResult.missingKeywords],
        missingKeywords: [],
        score: Math.min(99, scanResult.score + 5),
      });
      showSuccess('Keywords Injected', `Appended ${count} strategic keywords into your active resume skills.`);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 font-sans text-[#E5E5E5]">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#181818] border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI ATS SCANNER & KEYWORD MATCHER</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
          Executive ATS Calibration
        </h1>
        <p className="text-xs text-neutral-400 font-light mt-1">
          Evaluate executive career documents against mission-critical opportunity specifications to maximize parser indexing and executive recruiter callback rates.
        </p>
      </div>

      {/* Input Stage (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Job Description Input */}
        <div className="bg-[#121212] rounded-xl p-6 border border-[#2A2A2A] shadow-md space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                Target Opportunity Specification
              </label>
              <button
                onClick={() =>
                  setJobDescription(
                    `Job Title: Staff Product Designer - Platform\nLocation: Remote\nResponsibilities:\n- Design scalable multi-tenant UI components.\n- Drive Design Tokens integration with React & TypeScript.\n- Conduct quarterly UX heuristic evaluations and WCAG accessibility audits.`
                  )
                }
                className="text-[11px] text-[#D4AF37] font-semibold hover:underline"
              >
                Load Sample Spec
              </button>
            </div>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target role specification here..."
              className="w-full p-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-neutral-200 focus:border-[#D4AF37] focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#2A2A2A]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Resume:</span>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="text-xs font-semibold text-neutral-200 bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2.5 py-1.5 focus:border-[#D4AF37] focus:outline-none"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[#121212]">
                    {r.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleScan}
              disabled={isScanning || !jobDescription.trim()}
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] disabled:opacity-50 text-black text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded shadow-md transition-all hover:scale-105"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Calibrating with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Scan ATS Match</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: ATS Score & Status Card */}
        {scanResult ? (
          <div className="bg-[#121212] rounded-xl p-6 border border-[#2A2A2A] shadow-md flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Overall ATS Compatibility
                </span>
                <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                  {scanResult.matchLevel} Match
                </h3>
              </div>
              <div className="w-16 h-16 rounded-xl bg-[#1A1A1A] border border-[#D4AF37]/40 flex flex-col items-center justify-center text-[#D4AF37]">
                <span className="text-2xl font-bold font-mono">{scanResult.score}</span>
                <span className="text-[9px] font-bold uppercase -mt-1">%</span>
              </div>
            </div>

            {/* Score progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-neutral-400">
                <span className="uppercase text-[10px] tracking-wider">Keyword Coverage</span>
                <span className="font-mono font-bold text-[#D4AF37]">{scanResult.score}%</span>
              </div>
              <div className="w-full bg-[#1F1F1F] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#D4AF37] h-full rounded-full transition-all duration-700"
                  style={{ width: `${scanResult.score}%` }}
                />
              </div>
            </div>

            {/* Missing Keywords Box */}
            <div className="p-3.5 bg-[#1F1A10] border border-[#D4AF37]/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#E5C158] uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Missing Competencies ({scanResult.missingKeywords.length})</span>
                </div>
                {scanResult.missingKeywords.length > 0 && (
                  <button
                    onClick={handleAddMissingKeywords}
                    className="text-[11px] font-bold text-[#D4AF37] hover:underline"
                  >
                    Add all to resume
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {scanResult.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-[#2A2210] border border-[#D4AF37]/40 text-[#F5DEB3] text-[11px] font-medium rounded"
                  >
                    + {kw}
                  </span>
                ))}
                {scanResult.missingKeywords.length === 0 && (
                  <span className="text-xs text-emerald-400 font-medium">
                    All top keywords matched!
                  </span>
                )}
              </div>
            </div>

            {/* Matched Keywords */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Verified Indexed Keywords ({scanResult.matchedKeywords.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {scanResult.matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-[#132015] border border-emerald-800/60 text-emerald-400 text-[11px] font-medium rounded flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{kw}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#121212] border border-dashed border-[#2A2A2A] rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <Target className="w-10 h-10 text-neutral-600 mb-2" />
            <p className="text-xs text-neutral-400">
              Paste an opportunity description and click Scan to see your live ATS compatibility score.
            </p>
          </div>
        )}
      </div>

      {/* AI Recommendations List */}
      {scanResult && (
        <div className="bg-[#121212] rounded-xl p-6 border border-[#2A2A2A] shadow-md space-y-4">
          <h3 className="font-serif text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Actionable AI Recommendations</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scanResult.suggestions.map((sug, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl space-y-2 hover:border-[#D4AF37]/40 transition-colors"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Strategic Insight #{idx + 1}</div>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">{sug}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { AppView, TemplateType } from '../types';
import { TopNavbar } from './Navigation';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Layout,
  Eye,
  TrendingUp,
  FileCheck,
  Building2,
  ShieldCheck,
  Award,
  ChevronRight,
  ArrowDown
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
  onSelectTemplate: (template: TemplateType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectTemplate }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5]">
      <TopNavbar currentView="landing" onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Subtle background warm ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-[#D4AF37]/5 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161616] border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-semibold uppercase tracking-[2px] mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-POWERED RESUME ARCHITECTURE</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-white leading-[1.15] mb-6 font-normal">
            Precision Career Curation <br className="hidden sm:inline" />
            Empowered by{' '}
            <span className="relative inline-block text-[#D4AF37] italic font-serif">
              Intelligence
              {/* Gold curved underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-2.5 text-[#D4AF37]"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 14C28 2 72 2 97 14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-400 leading-relaxed mb-10 font-light">
            Instantly formulate tailored, ATS-grade executive resumes designed to captivate leadership recruiters. 
            Calibrated against industry benchmarks with quantified impact phrasing.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              id="hero-create-resume-btn"
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold text-xs uppercase tracking-[1.5px] px-8 py-3.5 rounded shadow-lg shadow-[#D4AF37]/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Create My Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              id="hero-view-examples-btn"
              href="#templates"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#141414] hover:bg-[#1C1C1C] text-neutral-200 hover:text-white font-medium text-xs uppercase tracking-[1.5px] px-8 py-3.5 rounded border border-[#2A2A2A] transition-all"
            >
              <span>View Designs</span>
            </a>
          </div>

          {/* Trust Banner */}
          <div className="pt-8 border-t border-[#2A2A2A] max-w-4xl mx-auto">
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-neutral-500 mb-6">
              TRUSTED BY CANDIDATES HIRED AT
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center opacity-80">
              <div className="flex items-center justify-center gap-2 text-neutral-400 font-serif text-sm tracking-widest uppercase">
                <Building2 className="w-4 h-4 text-[#D4AF37]" />
                <span>TechCorp</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-neutral-400 font-serif text-sm tracking-widest uppercase">
                <Zap className="w-4 h-4 text-[#D4AF37]" />
                <span>GlobalNet</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-neutral-400 font-serif text-sm tracking-widest uppercase">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>FinServe</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-neutral-400 font-serif text-sm tracking-widest uppercase">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>InnovateDesign</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="py-20 bg-[#0D0D0D] border-y border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[10px] font-bold uppercase tracking-[3px] text-[#D4AF37] mb-2">
              Capabilities
            </h2>
            <p className="text-3xl font-serif text-white tracking-tight">
              Sophisticated Suite for Elite Careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: AI Resume Optimization (2 cols) */}
            <div className="md:col-span-2 bg-[#141414] border border-[#2A2A2A] rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#D4AF37]/60 transition-all">
              <div className="max-w-md mb-8">
                <div className="w-10 h-10 rounded border border-[#D4AF37]/40 bg-[#1A1A1A] text-[#D4AF37] flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif text-white mb-2">
                  Algorithmic Keyword Harmonization
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  Our intelligence engine scans target job postings, identifies critical competency voids, 
                  and computes your applicant tracking alignment score with mathematical precision.
                </p>
              </div>

              {/* Visual Card Component */}
              <div className="bg-[#0A0A0A] rounded-lg p-5 border border-[#2A2A2A] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[2px]">
                    ATS Match Index
                  </span>
                  <span className="text-xs font-serif font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/30">
                    94%
                  </span>
                </div>
                <div className="w-full bg-[#1E1E1E] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#D4AF37] h-1.5 rounded-full w-[94%]" />
                </div>
                <p className="text-xs text-neutral-400 italic font-serif">
                  &ldquo;Optimal alignment with Senior Product Design profiles. Crucial tokens captured: Figma, Design Systems, Scalability.&rdquo;
                </p>
              </div>
            </div>

            {/* Feature 2: Modern Templates (1 col, solid gold accent container) */}
            <div className="bg-gradient-to-br from-[#1C1A14] to-[#12110D] border border-[#D4AF37]/50 text-white rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="w-10 h-10 rounded border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mb-4">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#D4AF37] mb-2">Architected Typography</h3>
                <p className="text-xs text-neutral-300 leading-relaxed mb-6 font-light">
                  Recruiter-sanctioned layouts crafted with balanced vertical rhythm, strict baseline grids, and timeless hierarchy.
                </p>
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-3 py-1.5 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified ATS Parsability</span>
                </div>
              </div>
            </div>

            {/* Feature 3: Real-time Preview (1 col) */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-8 flex flex-col justify-between hover:border-[#D4AF37]/60 transition-all">
              <div className="w-10 h-10 rounded border border-[#2A2A2A] bg-[#1A1A1A] text-neutral-300 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white mb-2">Live Page Inspection</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  Inspect your edits in real-time within an exact A4 viewport with zero print discrepancies.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#2A2A2A] text-xs text-[#D4AF37] font-semibold flex items-center gap-1">
                <span>Instant Vector PDF</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4: Smart Phrasing Suggestions (2 cols) */}
            <div className="md:col-span-2 bg-[#141414] border border-[#2A2A2A] rounded-xl p-8 hover:border-[#D4AF37]/60 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded border border-[#D4AF37]/40 bg-[#1A1A1A] text-[#D4AF37] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-white">Impact Phrase Refinement</h3>
                  <p className="text-xs text-neutral-400 font-light">Elevate passive responsibilities into quantified accomplishments</p>
                </div>
              </div>

              {/* Before / After Showcase */}
              <div className="space-y-3 mt-4">
                {/* Before */}
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3.5 flex items-start gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded shrink-0 mt-0.5">
                    Original
                  </span>
                  <p className="text-xs text-neutral-500 line-through">
                    &ldquo;Helped with the design system.&rdquo;
                  </p>
                </div>

                <div className="flex justify-center -my-1">
                  <ArrowDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>

                {/* After */}
                <div className="bg-[#121814] border border-emerald-900/50 rounded-lg p-3.5 flex items-start gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded shrink-0 mt-0.5">
                    AI Enhanced
                  </span>
                  <p className="text-xs text-emerald-100 font-normal">
                    &ldquo;Architected and maintained a multi-brand design system, accelerating engineering throughput by 30% and eliminating UI debt.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section id="templates" className="py-20 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[10px] font-bold uppercase tracking-[3px] text-[#D4AF37] mb-2">
              Curated Layouts
            </h2>
            <p className="text-3xl font-serif text-white tracking-tight mb-3">
              Distinguished Blueprints
            </p>
            <p className="text-xs text-neutral-400 font-light">
              Select an archetype to populate with your credentials and career milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Minimalist */}
            <div className="bg-[#121212] rounded-xl border border-[#2A2A2A] overflow-hidden group hover:border-[#D4AF37] transition-all duration-300">
              <div className="relative aspect-[3/4] bg-[#1A1A1A] overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJZte3lX1A0F715ggCylAdSsGaRx8udorG7K8cMHvYPlNtU8s6gr3efe4tcMkAy7qx9ahXa9IVfb90qR5-t31MLOR8QFXan0_n00yrHrTMECVdSlKcNzoFf4IosZpbmEo8Pt3DBahSAzKYopPLArSfBOmuVEUw6LHRPLYaN4tQ5AxiFVuVo6okHvI9XfwWfbe7EtYQIR1_VLiVsbxyPrIMsFYK59PhqDdFs8t5rKF0cNb96Isv-2V1"
                  alt="The Minimalist Template"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-[#0A0A0A]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <button
                    onClick={() => {
                      onSelectTemplate('minimalist');
                      onNavigate('editor');
                    }}
                    className="bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-[1.5px] px-5 py-2.5 rounded shadow-lg hover:bg-[#E5C158] transition-colors"
                  >
                    Select Template
                  </button>
                </div>
              </div>
              <div className="p-5 border-t border-[#2A2A2A]">
                <h3 className="font-serif text-base text-white">The Minimalist</h3>
                <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">Technology • Engineering • Operations</p>
              </div>
            </div>

            {/* Executive */}
            <div className="bg-[#121212] rounded-xl border border-[#2A2A2A] overflow-hidden group hover:border-[#D4AF37] transition-all duration-300">
              <div className="relative aspect-[3/4] bg-[#1A1A1A] overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFSlnCRjPAhIZbdcuzHW89aF4jRShjHG5MzniR5wBMCM8_qzVaXKceoFXQW3PQRydSrv3RMpreu5xvVIzgg5U_HbzZ42ItmlZevDJCQIiWqldWGVgldrDlofe-hdZKYtnMaaHxX-LkNh5yhiV-A4YlxsROeTyA9G9uoh1_P75YYT12f_twMEgaWs0aaiWK-p1Iki3_es-2LiC2grPhIGespjEcW9xye005Ce2-bqChPeFax5BwCh35"
                  alt="The Executive Template"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-[#0A0A0A]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <button
                    onClick={() => {
                      onSelectTemplate('executive');
                      onNavigate('editor');
                    }}
                    className="bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-[1.5px] px-5 py-2.5 rounded shadow-lg hover:bg-[#E5C158] transition-colors"
                  >
                    Select Template
                  </button>
                </div>
              </div>
              <div className="p-5 border-t border-[#2A2A2A]">
                <h3 className="font-serif text-base text-white">The Executive</h3>
                <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">Leadership • Finance • Strategy</p>
              </div>
            </div>

            {/* Creative */}
            <div className="bg-[#121212] rounded-xl border border-[#2A2A2A] overflow-hidden group hover:border-[#D4AF37] transition-all duration-300">
              <div className="relative aspect-[3/4] bg-[#1A1A1A] overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrWdYR556oDWQFHAqNCVsBj2SwC-GvdOa1jJJIfU5eak-ArhH5H94v023we2sbusHYi6595iNAo0elkNAETK_VgyPphOEZxRNG4bKRMOvSTVzHvrtUBGGHSFqAeYsKeeWrx_lDRoohFK3WyGDYsHebSxw_NZ5DBk49hQ0thMx5tIMvLKNX2iEy-Zbl7LNQsTyhuXJZy64qhwHLq_VqskjxIp57b69VBT-QY_M2lQ8BiCx5ic88mcFs"
                  alt="The Creative Template"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-[#0A0A0A]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <button
                    onClick={() => {
                      onSelectTemplate('creative');
                      onNavigate('editor');
                    }}
                    className="bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-[1.5px] px-5 py-2.5 rounded shadow-lg hover:bg-[#E5C158] transition-colors"
                  >
                    Select Template
                  </button>
                </div>
              </div>
              <div className="p-5 border-t border-[#2A2A2A]">
                <h3 className="font-serif text-base text-white">The Creative</h3>
                <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">Design • Architecture • Marketing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-20 bg-gradient-to-br from-[#1A1A1A] via-[#111111] to-[#0A0A0A] text-white border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight mb-4 text-white">
            Command Your Career Trajectory
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto mb-8 font-light">
            Distinguish your application in high-velocity recruitment pipelines with automated precision.
          </p>
          <button
            onClick={() => onNavigate('register')}
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold text-xs uppercase tracking-[1.5px] px-8 py-3.5 rounded shadow-xl transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Your Resume</span>
          </button>
          <p className="text-[11px] text-neutral-500 mt-3 font-medium uppercase tracking-wider">Complimentary tier available • No commitments</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080808] text-neutral-400 py-12 border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded border border-[#D4AF37] bg-[#141414] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xs">
              G
            </div>
            <span className="font-serif tracking-[1.5px] uppercase text-white text-sm">Golden Career</span>
          </div>
          <div className="flex flex-wrap gap-6 text-xs uppercase tracking-wider text-neutral-400">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Concierge Support</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Corporate Licensing</a>
          </div>
          <div className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Golden Career. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

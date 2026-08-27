import React from 'react';
import { AppView } from '../types';
import { ArrowLeft, Home, Compass } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (view: AppView) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 p-6 md:p-12 max-w-3xl mx-auto w-full flex flex-col items-center justify-center min-h-[65vh] text-center bg-[#0A0A0A] text-[#E5E5E5]">
      <div className="relative mb-6">
        <span className="text-7xl sm:text-8xl font-serif font-bold text-[#1F1F1F] tracking-widest select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#121212] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-xl">
            <Compass className="w-7 h-7 animate-pulse" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mb-2">
        Coordinates Not Located
      </h1>

      <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md mx-auto leading-relaxed mb-8">
        The destination or asset view you requested is not indexed within the current workspace hierarchy.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          id="notfound-dashboard-btn"
          onClick={() => onNavigate('dashboard')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold text-xs uppercase tracking-[1.5px] py-2.5 px-5 rounded-lg shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </button>

        <button
          id="notfound-resumes-btn"
          onClick={() => onNavigate('my-resumes')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#141414] hover:bg-[#1F1F1F] border border-[#2A2A2A] text-neutral-200 rounded-lg text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Resumes</span>
        </button>
      </div>
    </div>
  );
};

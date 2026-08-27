import React from 'react';
import { AppView } from '../types';
import { Sparkles, ArrowLeft, Clock, BellRing, Compass } from 'lucide-react';
import { useToast } from './Toast';

interface ComingSoonPageProps {
  title?: string;
  description?: string;
  onNavigate: (view: AppView) => void;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title = 'Module Under Active Development',
  description = 'Our team is actively engineering this executive intelligence feature. It will be available in the upcoming platform release.',
  onNavigate,
}) => {
  const { showSuccess } = useToast();

  const handleNotifyMe = () => {
    showSuccess('Notification Set', 'You will receive priority platform alerts once this module launches.');
  };

  return (
    <div className="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh] text-center bg-[#0A0A0A] text-[#E5E5E5]">
      {/* Decorative Badge */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1F1F1F] to-[#121212] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-6 shadow-xl">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-4">
        <Clock className="w-3.5 h-3.5" />
        <span>Roadmap Feature</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight max-w-lg mb-3">
        {title}
      </h1>

      <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md mx-auto leading-relaxed mb-8">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          id="coming-soon-back-btn"
          onClick={() => onNavigate('dashboard')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#141414] hover:bg-[#1F1F1F] border border-[#2A2A2A] text-neutral-200 rounded-lg text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>

        <button
          id="coming-soon-notify-btn"
          onClick={handleNotifyMe}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold text-xs uppercase tracking-[1.5px] rounded-lg shadow-md transition-all"
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>Notify on Launch</span>
        </button>
      </div>

      <div className="mt-12 pt-6 border-t border-[#222222] max-w-xs text-center text-[11px] text-neutral-500 font-light flex items-center justify-center gap-1.5">
        <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Synthesized for Executive Precision</span>
      </div>
    </div>
  );
};

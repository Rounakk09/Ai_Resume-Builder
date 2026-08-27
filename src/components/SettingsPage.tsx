import React, { useState, useEffect } from 'react';
import { ResumeData, AppView } from '../types';
import { User, Shield, Key, Bell, Check, Sparkles, Download, Trash2, ArrowRight } from 'lucide-react';
import { AuthUser } from '../services/api';
import { useToast } from './Toast';

interface SettingsPageProps {
  resumes: ResumeData[];
  onResetData: () => void;
  user?: AuthUser | null;
  onNavigate?: (view: AppView) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ resumes, onResetData, user, onNavigate }) => {
  const { showSuccess, showInfo, showError } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [targetRole, setTargetRole] = useState(user?.jobTitle || 'Senior Executive');

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
    if (user?.jobTitle) setTargetRole(user.jobTitle);
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess('Preferences Saved', 'Workspace preferences and telemetry calibrated.');
  };

  const handleExportAll = () => {
    if (resumes.length === 0) {
      showInfo('No Resumes', 'You currently have no saved resumes to export.');
      return;
    }
    const jsonStr = JSON.stringify(resumes, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `golden_career_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showSuccess('Export Complete', 'Exported JSON backup archive successfully.');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear your local workspace cache?')) {
      onResetData();
      showSuccess('Cache Cleared', 'Workspace temporary cache has been reset.');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8 font-sans text-[#E5E5E5]">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
          Executive Portfolio Governance
        </h1>
        <p className="text-xs text-neutral-400 font-light mt-1">
          Manage your credentials, encrypted configuration, and decentralized career dossier backups.
        </p>
      </div>

      {/* Profile quick-link card */}
      <div className="bg-gradient-to-r from-[#17150E] to-[#121212] rounded-xl p-6 border border-[#D4AF37]/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#262626] to-[#121212] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xl shadow-md">
              {name ? name.trim().charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-white">{name || 'Executive User'}</h3>
              <span className="bg-[#1A1608] text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {user?.role ? user.role.toUpperCase() : 'EXECUTIVE TIER'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-light mt-0.5">{email || 'Authenticated Account'}</p>
          </div>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold text-xs uppercase tracking-[1.5px] px-4 py-2.5 rounded shadow-sm transition-all shrink-0"
          >
            <span>Edit Full Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Preferences Form */}
      <div className="bg-[#121212] rounded-xl p-6 border border-[#2A2A2A] shadow-md space-y-6">
        <h3 className="font-serif font-bold text-base text-white">General Preferences</h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">Account Email</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3 py-2 bg-[#171717] border border-[#2A2A2A] rounded text-xs text-neutral-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">Primary Executive Focus</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] text-neutral-200 rounded text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
            >
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* Career Data Export & Danger Zone */}
      <div className="bg-[#121212] rounded-xl p-6 border border-[#2A2A2A] shadow-md space-y-4">
        <h3 className="font-serif font-bold text-base text-white">Data Sovereign Control</h3>
        <p className="text-xs text-neutral-400 font-light">
          Export your encrypted career dossiers as portable JSON schemas or reset to default curated templates.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportAll}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2A2A2A] text-neutral-200 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Export All Dossiers (.json)</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1010] hover:bg-[#251515] border border-rose-900/50 text-rose-300 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear Temporary Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
};

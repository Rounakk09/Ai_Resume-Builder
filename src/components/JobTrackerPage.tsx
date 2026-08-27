import React, { useState } from 'react';
import { JobApplication, ResumeData } from '../types';
import {
  Plus,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  MoreVertical,
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { useToast } from './Toast';

interface JobTrackerPageProps {
  applications: JobApplication[];
  resumes: ResumeData[];
  onAddApplication: (app: JobApplication) => void;
  onUpdateStatus: (id: string, newStatus: JobApplication['status']) => void;
  onDeleteApplication: (id: string) => void;
}

export const JobTrackerPage: React.FC<JobTrackerPageProps> = ({
  applications,
  resumes,
  onAddApplication,
  onUpdateStatus,
  onDeleteApplication,
}) => {
  const { showSuccess, showInfo } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid)');
  const [salary, setSalary] = useState('$180,000 - $210,000');
  const [status, setStatus] = useState<JobApplication['status']>('Applied');
  const [resumeId, setResumeId] = useState(resumes[0]?.id || '');
  const [notes, setNotes] = useState('');

  const statuses: JobApplication['status'][] = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

  const getStatusBadgeColor = (s: JobApplication['status']) => {
    switch (s) {
      case 'Offer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Interviewing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Applied':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Saved':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;
    const newApp: JobApplication = {
      id: `job-${Date.now()}`,
      company,
      role,
      location,
      salary,
      dateApplied: new Date().toISOString().split('T')[0],
      status,
      resumeId,
      notes,
    };
    onAddApplication(newApp);
    setShowAddModal(false);
    setCompany('');
    setRole('');
    setNotes('');
    showSuccess('Opportunity Added', `${role} at ${company} logged in tracker.`);
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 font-sans text-[#E5E5E5]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
            Executive Opportunity Pipeline
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Orchestrate and monitor targeted executive engagements, strategic interview stages, and linked career dossiers.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold uppercase tracking-wider text-xs py-2.5 px-4 rounded shadow-md transition-all self-start sm:self-auto hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Applications Kanban / Grid Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Applied', 'Interviewing', 'Offer', 'Saved'].map((colStatus) => {
          const colApps = applications.filter((a) => a.status === colStatus);
          return (
            <div key={colStatus} className="bg-[#0F0F0F] rounded-xl p-4 border border-[#222222] flex flex-col gap-3 min-h-[400px]">
              <div className="flex items-center justify-between px-1">
                <span className="font-bold text-xs uppercase tracking-wider text-[#D4AF37]">
                  {colStatus}
                </span>
                <span className="text-[11px] font-mono font-bold text-neutral-300 bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#2A2A2A]">
                  {colApps.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colApps.map((app) => {
                  const linkedResume = resumes.find((r) => r.id === app.resumeId);
                  return (
                    <div
                      key={app.id}
                      className="bg-[#141414] rounded-xl p-4 border border-[#2A2A2A] hover:border-[#D4AF37]/50 transition-all space-y-2.5 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-sm text-white line-clamp-1">{app.role}</h4>
                          <div className="text-xs font-semibold text-[#D4AF37] flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            <span>{app.company}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onDeleteApplication(app.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {app.salary && (
                        <div className="text-[11px] text-neutral-300 flex items-center gap-1 font-mono">
                          <DollarSign className="w-3 h-3 text-[#D4AF37]" />
                          <span>{app.salary}</span>
                        </div>
                      )}

                      {linkedResume && (
                        <div className="p-2 bg-[#0A0A0A] rounded text-[10px] text-neutral-400 flex items-center justify-between border border-[#222222]">
                          <span className="truncate">Dossier: {linkedResume.title}</span>
                          {linkedResume.atsScore && (
                            <span className="font-bold font-mono text-[#D4AF37] shrink-0">
                              {linkedResume.atsScore}% ATS
                            </span>
                          )}
                        </div>
                      )}

                      {app.notes && (
                        <p className="text-[11px] text-neutral-300 italic bg-[#1A1608] p-2 rounded border border-[#D4AF37]/20 font-light">
                          &ldquo;{app.notes}&rdquo;
                        </p>
                      )}

                      {/* Status quick mover */}
                      <div className="pt-2 border-t border-[#222222] flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400">Stage:</span>
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateStatus(app.id, e.target.value as any)}
                          className="text-[10px] font-bold uppercase tracking-wider text-neutral-200 bg-[#0A0A0A] border border-[#2A2A2A] rounded px-1.5 py-0.5 focus:border-[#D4AF37] focus:outline-none"
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st} className="bg-[#141414]">
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}

                {colApps.length === 0 && (
                  <div className="h-32 border border-dashed border-[#2A2A2A] rounded-xl flex items-center justify-center text-xs text-neutral-400">
                    No active records
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141414] rounded-xl p-6 max-w-md w-full shadow-2xl border border-[#2A2A2A] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base text-white">Add Executive Opportunity</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">Company / Organization</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Anthropic, Stripe"
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. VP of Product Architecture"
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">Compensation Range</label>
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">Stage Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st} className="bg-[#141414]">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">Linked Dossier</label>
                  <select
                    value={resumeId}
                    onChange={(e) => setResumeId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id} className="bg-[#141414]">
                        {r.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">Engagement Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key discussion points, compensation expectations, or recruiter feedback..."
                  className="w-full p-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C158] text-black text-xs font-bold uppercase tracking-wider rounded shadow-sm"
                >
                  Record Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

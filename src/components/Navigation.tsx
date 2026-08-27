import React from 'react';
import { AppView } from '../types';
import { Sparkles, FileText, BarChart3, Briefcase, Settings, LogOut, LayoutDashboard, User } from 'lucide-react';
import { AuthUser } from '../services/api';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onCreateNew?: () => void;
  user?: AuthUser | null;
}

export const TopNavbar: React.FC<{
  onNavigate: (view: AppView) => void;
  currentView: AppView;
  isLoggedIn?: boolean;
  user?: AuthUser | null;
}> = ({ onNavigate, currentView, isLoggedIn, user }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          id="nav-brand-btn"
          onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-8 h-8 rounded border border-[#D4AF37] bg-gradient-to-br from-[#1A1A1A] to-[#050505] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
            G
          </div>
          <span className="text-lg font-serif tracking-[2px] uppercase text-white font-light">
            Golden Career
          </span>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[2px] font-medium text-neutral-400">
          <a href="#features" className="hover:text-[#D4AF37] transition-colors">
            Features
          </a>
          <a href="#templates" className="hover:text-[#D4AF37] transition-colors">
            Templates
          </a>
          <a href="#pricing" className="hover:text-[#D4AF37] transition-colors">
            Pricing
          </a>
          <a href="#resources" className="hover:text-[#D4AF37] transition-colors">
            Intelligence
          </a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <button
                id="nav-profile-btn"
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 text-xs text-neutral-300 hover:text-[#D4AF37] px-2.5 py-1.5 rounded-lg border border-[#2A2A2A] hover:border-[#D4AF37]/40 bg-[#121212] transition-colors"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover border border-[#D4AF37]"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                )}
                <span className="truncate max-w-[100px] sm:max-w-none">{user?.name || 'Profile'}</span>
              </button>
              <button
                id="nav-dashboard-btn"
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 border border-[#D4AF37] bg-[#D4AF37] hover:bg-[#E5C158] text-black text-xs uppercase tracking-[1.5px] font-bold px-3.5 py-2 rounded shadow-sm transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Workspace</span>
              </button>
            </div>
          ) : (
            <>
              <button
                id="nav-login-btn"
                onClick={() => onNavigate('login')}
                className="text-xs uppercase tracking-[1.5px] font-medium text-neutral-300 hover:text-[#D4AF37] px-3 py-2 transition-colors"
              >
                Login
              </button>
              <button
                id="nav-get-started-btn"
                onClick={() => onNavigate('register')}
                className="flex items-center gap-2 border border-[#D4AF37] bg-[#D4AF37] hover:bg-[#E5C158] text-black text-xs uppercase tracking-[1.5px] font-bold px-4 py-2 rounded shadow-sm transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Started</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export const AppSidebar: React.FC<{
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  onCreateNew: () => void;
  user?: AuthUser | null;
}> = ({ currentView, onNavigate, onLogout, onCreateNew, user }) => {
  const navItems = [
    { id: 'dashboard' as AppView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-resumes' as AppView, label: 'My Resumes', icon: FileText },
    { id: 'optimizer' as AppView, label: 'AI Optimizer', icon: BarChart3 },
    { id: 'tracker' as AppView, label: 'Job Tracker', icon: Briefcase },
    { id: 'profile' as AppView, label: 'Profile', icon: User },
    { id: 'settings' as AppView, label: 'Settings', icon: Settings },
  ];

  const userInitials = (user?.name || 'Executive User')
    .trim()
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <aside className="w-64 bg-[#0D0D0D] text-neutral-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-[#2A2A2A]">
      <div className="p-5 overflow-y-auto">
        {/* Brand */}
        <button
          id="sidebar-brand-btn"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 mb-6 w-full text-left group"
        >
          <div className="w-8 h-8 rounded border border-[#D4AF37] bg-gradient-to-br from-[#1A1A1A] to-[#050505] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            G
          </div>
          <span className="text-base font-serif tracking-[1.5px] uppercase text-white font-light">
            Golden Career
          </span>
        </button>

        {/* User Card - Clickable to open Profile */}
        <button
          id="sidebar-user-card-btn"
          onClick={() => onNavigate('profile')}
          className="w-full text-left bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] hover:border-[#D4AF37]/50 rounded-xl p-3.5 mb-6 border border-[#2A2A2A] flex items-center gap-3 transition-all group"
          title="View & Edit Profile"
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-[#D4AF37] shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#242424] to-[#121212] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] font-serif font-bold text-sm shrink-0">
              {userInitials || 'U'}
            </div>
          )}
          <div className="overflow-hidden min-w-0 flex-1">
            <div id="sidebar-user-name" className="font-semibold text-sm text-white group-hover:text-[#D4AF37] transition-colors truncate">
              {user?.name || 'Executive User'}
            </div>
            <div id="sidebar-user-email" className="text-[10px] text-neutral-400 truncate">
              {user?.email || 'Logged In'}
            </div>
          </div>
        </button>

        {/* CTA Button */}
        <button
          id="sidebar-create-resume-btn"
          onClick={onCreateNew}
          className="w-full mb-6 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs uppercase tracking-[1.5px] font-bold py-2.5 px-3.5 rounded shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create New Resume</span>
        </button>

        {/* Navigation items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#1A1A1A] text-[#D4AF37] font-semibold border border-[#D4AF37]/40 shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout & Footer */}
      <div className="p-5 border-t border-[#2A2A2A]">
        <button
          id="sidebar-logout-btn"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-neutral-400 hover:text-rose-400 hover:bg-[#1A1A1A] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

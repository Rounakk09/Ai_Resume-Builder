import React, { useState } from 'react';
import { AppView } from '../types';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../services/api';

interface LoginPageProps {
  onNavigate: (view: AppView) => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await authApi.login(email, password);
      if (res.success) {
        onLoginSuccess();
        onNavigate('dashboard');
      } else {
        setErrorMessage(res.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden text-[#E5E5E5]">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#121212] rounded-xl p-8 border border-[#2A2A2A] shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <button
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-2.5 mb-4 group"
          >
            <div className="w-8 h-8 rounded border border-[#D4AF37] bg-gradient-to-br from-[#1A1A1A] to-[#050505] text-[#D4AF37] flex items-center justify-center font-serif font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              G
            </div>
            <span className="font-serif tracking-[2px] uppercase text-white text-base font-light">Golden Career</span>
          </button>
          <h1 className="text-2xl font-serif text-white tracking-tight">Executive Sign-in</h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            Enter your credentials to access your curated career assets.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded bg-rose-950/40 border border-rose-800/60 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
              <button
                id="login-toggle-password-btn"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 p-1 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-neutral-400 cursor-pointer">
              <input
                id="login-remember-checkbox"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#2A2A2A] bg-[#0A0A0A] text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <span className="text-[11px]">Remember this session</span>
            </label>
            <a href="#" className="text-[11px] text-[#D4AF37] hover:underline font-medium">
              Recover access
            </a>
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#D4AF37] hover:bg-[#E5C158] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-[1.5px] py-3 rounded shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Social logins */}
        <div className="mt-6 space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#2A2A2A] w-full" />
            <span className="bg-[#121212] px-2.5 text-[9px] uppercase tracking-[2px] font-bold text-neutral-500 absolute">
              Or authenticate via
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => {
                onLoginSuccess();
                onNavigate('dashboard');
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-[#2A2A2A] rounded text-xs font-medium text-neutral-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              onClick={() => {
                onLoginSuccess();
                onNavigate('dashboard');
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-[#2A2A2A] rounded text-xs font-medium text-neutral-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#2A2A2A] text-center text-xs text-neutral-400">
          New to Synthetic Career?{' '}
          <button
            id="login-goto-register-btn"
            onClick={() => onNavigate('register')}
            className="font-medium text-[#D4AF37] hover:underline"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AppView } from '../types';
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../services/api';

interface RegisterPageProps {
  onNavigate: (view: AppView) => void;
  onLoginSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.register(fullName, email, password);
      if (res.success) {
        onLoginSuccess();
        onNavigate('dashboard');
      } else {
        setErrorMessage(res.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden text-[#E5E5E5]">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
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
          <h1 className="text-2xl font-serif text-white tracking-tight">Create Account</h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            Formulate your career assets with automated precision.
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
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="register-fullname-input"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="register-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
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
                id="register-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full pl-10 pr-10 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
              <button
                id="register-toggle-password-btn"
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

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="register-confirm-password-input"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-10 pr-10 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
              <button
                id="register-toggle-confirm-password-btn"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 p-1 transition-colors"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              id="register-terms-checkbox"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-[#2A2A2A] bg-[#0A0A0A] text-[#D4AF37] focus:ring-[#D4AF37]"
            />
            <label htmlFor="register-terms-checkbox" className="text-[11px] text-neutral-400 leading-tight">
              I agree to the{' '}
              <a href="#" className="text-[#D4AF37] hover:underline font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#D4AF37] hover:underline font-medium">
                Privacy Policy
              </a>
              .
            </label>
          </div>

          {/* Submit */}
          <button
            id="register-submit-btn"
            type="submit"
            disabled={loading || !agreeTerms}
            className="w-full mt-2 bg-[#D4AF37] hover:bg-[#E5C158] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-[1.5px] py-3 rounded shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Initializing account...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Register & Continue</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#2A2A2A] text-center text-xs text-neutral-400">
          Already have an account?{' '}
          <button
            id="register-goto-login-btn"
            onClick={() => onNavigate('login')}
            className="font-medium text-[#D4AF37] hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

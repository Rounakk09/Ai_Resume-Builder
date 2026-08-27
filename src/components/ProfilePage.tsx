import React, { useState, useRef } from 'react';
import { AppView } from '../types';
import { AuthUser, authApi } from '../services/api';
import {
  User,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  FileText,
  Camera,
  Trash2,
  Save,
  ArrowLeft,
  Check,
  ShieldCheck,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useToast } from './Toast';

interface ProfilePageProps {
  user: AuthUser | null;
  onUpdateUser: (updatedUser: AuthUser) => void;
  onNavigate: (view: AppView) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateUser,
  onNavigate,
}) => {
  const { showSuccess, showError } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user?.name || '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const handleFieldChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
    setter(value);
    setHasChanged(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError('Image Too Large', 'Please select an image smaller than 2MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showError('Invalid File Format', 'Please upload a valid image (PNG, JPG, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
        setHasChanged(true);
        showSuccess('Photo Selected', 'Click Save Changes to persist your profile photo.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    setHasChanged(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showError('Name Required', 'Please provide your full name.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await authApi.updateProfile({
        name: fullName.trim(),
        jobTitle: jobTitle.trim(),
        phone: phone.trim(),
        location: location.trim(),
        bio: bio.trim(),
        avatarUrl,
      });

      if (res.success && res.user) {
        onUpdateUser(res.user);
        setHasChanged(false);
        showSuccess('Profile Updated', 'Your profile details have been saved successfully.');
      } else {
        showError('Update Failed', res.message || 'Could not save profile changes.');
      }
    } catch (err: any) {
      showError('Network Error', err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (fullName || user?.name || 'Executive User')
    .trim()
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8 bg-[#0A0A0A] text-[#E5E5E5]">
      {/* Header & Back Action */}
      <div className="flex items-center justify-between gap-4 border-b border-[#2A2A2A] pb-6">
        <div className="flex items-center gap-4">
          <button
            id="profile-back-btn"
            onClick={() => onNavigate('dashboard')}
            className="p-2 bg-[#141414] hover:bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg text-neutral-400 hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-serif text-white tracking-tight">Executive Profile</h1>
            <p className="text-xs text-neutral-400 mt-0.5 font-light">
              Manage your personal branding, executive contact coordinates, and candidate identity.
            </p>
          </div>
        </div>

        <button
          id="profile-save-top-btn"
          onClick={handleSave}
          disabled={isSaving || !hasChanged}
          className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs uppercase tracking-[1.5px] py-2.5 px-4 rounded shadow-md transition-all"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Avatar Card */}
        <div className="bg-[#121212] rounded-xl p-6 border border-[#2A2A2A] flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName || 'Profile Avatar'}
                className="w-28 h-28 rounded-full object-cover border-2 border-[#D4AF37] shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#242424] to-[#121212] border-2 border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] font-serif font-bold text-3xl shadow-lg">
                {initials || 'U'}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-[#D4AF37] text-black rounded-full shadow-md hover:scale-105 transition-transform"
              title="Upload Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-serif text-white">{fullName || 'Executive User'}</h2>
                <p className="text-xs text-neutral-400 font-light">{user?.email || 'Logged In'}</p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider self-center sm:self-start">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Account</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 font-light leading-relaxed pt-1">
              Upload a clear professional portrait (JPG, PNG, or WebP up to 2MB). This image is featured on creative and modern resume templates.
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
              <button
                type="button"
                id="profile-upload-photo-btn"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] text-neutral-200 rounded text-xs font-medium transition-colors"
              >
                Choose Photo
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  id="profile-remove-photo-btn"
                  onClick={handleRemovePhoto}
                  className="px-3 py-1.5 text-rose-400 hover:bg-rose-950/30 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Identity & Contact Details */}
        <div className="bg-[#121212] rounded-xl p-6 border border-[#2A2A2A] space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[2px] text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Professional Coordinates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Full Name <span className="text-[#D4AF37]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="profile-name-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => handleFieldChange(setFullName, e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {/* Job Title / Target Role */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Target Role / Professional Title
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="profile-jobtitle-input"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => handleFieldChange(setJobTitle, e.target.value)}
                  placeholder="e.g. Senior Distributed Systems Engineer"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {/* Email Address (Read-only) */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Email Address <span className="text-[10px] text-neutral-500 lowercase">(primary account login)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="profile-email-input"
                  type="email"
                  readOnly
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#171717] border border-[#2A2A2A] rounded text-xs text-neutral-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="profile-phone-input"
                  type="text"
                  value={phone}
                  onChange={(e) => handleFieldChange(setPhone, e.target.value)}
                  placeholder="e.g. +1 (555) 345-9821"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Location / Primary Market
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="profile-location-input"
                  type="text"
                  value={location}
                  onChange={(e) => handleFieldChange(setLocation, e.target.value)}
                  placeholder="e.g. San Francisco, CA (or Remote)"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {/* Executive Bio / Career Summary */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Executive Bio / Professional Summary
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <textarea
                  id="profile-bio-input"
                  rows={4}
                  value={bio}
                  onChange={(e) => handleFieldChange(setBio, e.target.value)}
                  placeholder="Summarize your career positioning, leadership scope, and core competencies..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2.5 bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] text-neutral-300 rounded text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            id="profile-save-bottom-btn"
            type="submit"
            disabled={isSaving || !hasChanged}
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs uppercase tracking-[1.5px] py-2.5 px-5 rounded shadow-md transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

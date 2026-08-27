export type TemplateType = 'minimalist' | 'executive' | 'creative' | 'modern';

export interface WorkExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  isPresent?: boolean;
  description?: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  startYear?: string;
  endYear?: string;
  highlights?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface PersonalDetails {
  fullName?: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  address?: string;
  website?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export interface ResumeData {
  id: string;
  title: string;
  template: TemplateType;
  lastEdited: string;
  personalDetails: PersonalDetails;
  summary: string;
  experience: WorkExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects?: ProjectItem[];
  certifications?: (string | CertificationItem)[];
  atsScore?: number;
  thumbnailUrl?: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  dateApplied: string;
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  resumeId: string;
  notes: string;
  jobDescription?: string;
}

export interface AtsScanResult {
  score: number;
  matchLevel: 'Low' | 'Medium' | 'High' | 'Exceptional';
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
}

export interface AISuggestion {
  id: string;
  type: 'quantify' | 'action-verb' | 'summary' | 'skills';
  title: string;
  message: string;
  targetField: string;
  targetIndex?: number;
  originalText?: string;
  suggestedText?: string;
}

export type AppView = 
  | 'landing' 
  | 'register' 
  | 'login' 
  | 'dashboard' 
  | 'my-resumes'
  | 'editor' 
  | 'preview' 
  | 'optimizer' 
  | 'tracker' 
  | 'profile'
  | 'settings'
  | 'coming-soon'
  | 'not-found';

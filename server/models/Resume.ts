import mongoose, { Schema, Model } from 'mongoose';
import { isDbConnected } from '../db/connection.js';

export interface IExperienceItem {
  id?: string;
  jobTitle?: string;
  role?: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  isPresent?: boolean;
  description?: string;
  bullets?: string[];
}

export interface IEducationItem {
  id?: string;
  degree: string;
  institution: string;
  field?: string;
  startYear?: string;
  endYear?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  gpa?: string;
}

export interface IProjectItem {
  id?: string;
  title?: string;
  projectTitle?: string;
  description: string;
  technologies?: string[] | string;
  githubLink?: string;
  link?: string;
  date?: string;
}

export interface ICertificationItem {
  id?: string;
  name: string;
  issuer?: string;
  date?: string;
  credentialId?: string;
}

export interface IPersonalDetails {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email: string;
  phone?: string;
  address?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
  website?: string;
  github?: string;
}

export interface IResume {
  userId: string;
  title: string;
  targetRole?: string;
  template: 'minimalist' | 'executive' | 'modern' | 'compact' | 'split';
  atsScore?: number;
  personalDetails: IPersonalDetails;
  summary: string;
  experience: IExperienceItem[];
  education: IEducationItem[];
  skills: string[];
  projects?: IProjectItem[];
  certifications?: (ICertificationItem | string)[];
  createdAt?: Date;
  updatedAt?: Date;
}

const PersonalDetailsSchema = new Schema<IPersonalDetails>(
  {
    fullName: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    website: { type: String, default: '' },
    github: { type: String, default: '' },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IExperienceItem>(
  {
    id: { type: String, default: () => `exp-${Date.now()}` },
    jobTitle: { type: String, default: '' },
    role: { type: String, default: '' },
    company: { type: String, required: true },
    location: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    duration: { type: String, default: '' },
    isPresent: { type: Boolean, default: false },
    description: { type: String, default: '' },
    bullets: { type: [String], default: [] },
  },
  { _id: false }
);

const EducationSchema = new Schema<IEducationItem>(
  {
    id: { type: String, default: () => `edu-${Date.now()}` },
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    field: { type: String, default: '' },
    startYear: { type: String, default: '' },
    endYear: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    location: { type: String, default: '' },
    gpa: { type: String, default: '' },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProjectItem>(
  {
    id: { type: String, default: () => `proj-${Date.now()}` },
    title: { type: String, default: '' },
    projectTitle: { type: String, default: '' },
    description: { type: String, default: '' },
    technologies: { type: Schema.Types.Mixed, default: [] },
    githubLink: { type: String, default: '' },
    link: { type: String, default: '' },
    date: { type: String, default: '' },
  },
  { _id: false }
);

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: String,
      required: [true, 'Resume must belong to an authenticated user ID'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a resume title'],
      trim: true,
      default: 'Untitled Resume',
    },
    targetRole: {
      type: String,
      default: '',
    },
    template: {
      type: String,
      enum: ['minimalist', 'executive', 'modern', 'compact', 'split'],
      default: 'minimalist',
    },
    atsScore: {
      type: Number,
      default: 88,
      min: 0,
      max: 100,
    },
    personalDetails: {
      type: PersonalDetailsSchema,
      default: () => ({}),
    },
    summary: {
      type: String,
      default: '',
    },
    experience: {
      type: [ExperienceSchema],
      default: [],
    },
    education: {
      type: [EducationSchema],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    projects: {
      type: [ProjectSchema],
      default: [],
    },
    certifications: {
      type: [Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const ResumeModel: Model<IResume> =
  (mongoose.models.Resume as Model<IResume>) || mongoose.model<IResume>('Resume', ResumeSchema);

export interface ResumeDocumentDTO {
  id: string;
  userId: string;
  title: string;
  targetRole?: string;
  template: 'minimalist' | 'executive' | 'modern' | 'compact' | 'split';
  lastEdited?: string;
  atsScore?: number;
  personalDetails: IPersonalDetails;
  summary: string;
  experience: IExperienceItem[];
  education: IEducationItem[];
  skills: string[];
  projects?: IProjectItem[];
  certifications?: (ICertificationItem | string)[];
  createdAt?: string;
  updatedAt?: string;
}

// Fallback in-memory storage (empty by default)
const fallbackResumes: Map<string, ResumeDocumentDTO> = new Map();

function formatResumeOutput(doc: any): ResumeDocumentDTO {
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return {
    id: obj._id ? obj._id.toString() : obj.id,
    userId: obj.userId,
    title: obj.title,
    targetRole: obj.targetRole || '',
    template: obj.template || 'minimalist',
    lastEdited: obj.updatedAt ? new Date(obj.updatedAt).toLocaleDateString() : obj.lastEdited || 'Recently',
    atsScore: obj.atsScore ?? 88,
    personalDetails: obj.personalDetails || {},
    summary: obj.summary || '',
    experience: obj.experience || [],
    education: obj.education || [],
    skills: obj.skills || [],
    projects: obj.projects || [],
    certifications: obj.certifications || [],
    createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : undefined,
    updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : undefined,
  };
}

export const ResumeRepository = {
  async findByUserId(userId: string): Promise<ResumeDocumentDTO[]> {
    if (isDbConnected()) {
      try {
        const docs: any[] = await (ResumeModel as any).find({ userId }).sort({ updatedAt: -1 }).exec();
        return docs.map(formatResumeOutput);
      } catch (err: any) {
        console.error('[Resume Model] findByUserId DB error:', err.message);
      }
    }

    const userResumes: ResumeDocumentDTO[] = [];
    for (const r of fallbackResumes.values()) {
      if (r.userId === userId) {
        userResumes.push(r);
      }
    }
    return userResumes;
  },

  async findByIdAndUser(id: string, userId: string): Promise<ResumeDocumentDTO | null> {
    if (isDbConnected()) {
      try {
        if (mongoose.isValidObjectId(id)) {
          const doc: any = await (ResumeModel as any).findOne({ _id: id, userId }).exec();
          if (doc) {
            return formatResumeOutput(doc);
          }
        }
      } catch (err: any) {
        console.error('[Resume Model] findByIdAndUser DB error:', err.message);
      }
    }

    const r = fallbackResumes.get(id);
    if (r && r.userId === userId) {
      return r;
    }
    return null;
  },

  async create(userId: string, data: Partial<IResume>): Promise<ResumeDocumentDTO> {
    if (isDbConnected()) {
      try {
        const created: any = await (ResumeModel as any).create({
          ...data,
          userId,
        });
        return formatResumeOutput(created);
      } catch (err: any) {
        console.error('[Resume Model] create DB error:', err.message);
        throw err;
      }
    }

    const newId = `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newResume: ResumeDocumentDTO = {
      id: newId,
      userId,
      title: data.title || 'Untitled Resume',
      targetRole: data.targetRole || '',
      template: data.template || 'minimalist',
      lastEdited: 'Created just now',
      atsScore: data.atsScore ?? 88,
      personalDetails: (data.personalDetails as any) || { email: '' },
      summary: data.summary || '',
      experience: data.experience || [],
      education: data.education || [],
      skills: data.skills || [],
      projects: data.projects || [],
      certifications: data.certifications || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fallbackResumes.set(newId, newResume);
    return newResume;
  },

  async update(id: string, userId: string, data: Partial<IResume>): Promise<ResumeDocumentDTO | null> {
    if (isDbConnected()) {
      try {
        if (mongoose.isValidObjectId(id)) {
          const updated: any = await (ResumeModel as any).findOneAndUpdate(
            { _id: id, userId },
            { $set: data },
            { new: true, runValidators: true }
          ).exec();
          if (updated) {
            return formatResumeOutput(updated);
          }
        }
      } catch (err: any) {
        console.error('[Resume Model] update DB error:', err.message);
        throw err;
      }
    }

    const existing = fallbackResumes.get(id);
    if (existing && existing.userId === userId) {
      const updated: ResumeDocumentDTO = {
        ...existing,
        ...data,
        id,
        userId,
        lastEdited: 'Edited just now',
        createdAt: existing.createdAt ? String(existing.createdAt) : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as ResumeDocumentDTO;
      fallbackResumes.set(id, updated);
      return updated;
    }
    return null;
  },

  async delete(id: string, userId: string): Promise<boolean> {
    if (isDbConnected()) {
      try {
        if (mongoose.isValidObjectId(id)) {
          const res: any = await (ResumeModel as any).findOneAndDelete({ _id: id, userId }).exec();
          if (res) return true;
        }
      } catch (err: any) {
        console.error('[Resume Model] delete DB error:', err.message);
        throw err;
      }
    }

    const existing = fallbackResumes.get(id);
    if (existing && existing.userId === userId) {
      fallbackResumes.delete(id);
      return true;
    }
    return false;
  },
};

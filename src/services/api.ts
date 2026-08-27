import { ResumeData } from '../types';

const TOKEN_KEY = 'golden_career_token';
const USER_KEY = 'golden_career_user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
  jobTitle?: string;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt?: string;
}

export const authStorage = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser: (): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser: (user: AuthUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; [key: string]: any }> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      // If unauthorized, could clear token
      if (res.status === 401 && token) {
        // Token expired
        console.warn('Session expired or invalid token');
      }
      return {
        success: false,
        message: body.message || `Request failed with status ${res.status}`,
        ...body,
      };
    }

    return body;
  } catch (error: any) {
    console.error(`API Error on ${url}:`, error);
    return {
      success: false,
      message: error.message || 'Network connection failed.',
    };
  }
}

export const authApi = {
  async register(name: string, email: string, password: string) {
    const res = await apiFetch<{ token: string; user: AuthUser }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (res.success && res.token && res.user) {
      authStorage.setToken(res.token);
      authStorage.setUser(res.user);
    }

    return res;
  },

  async login(email: string, password: string) {
    const res = await apiFetch<{ token: string; user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.token && res.user) {
      authStorage.setToken(res.token);
      authStorage.setUser(res.user);
    }

    return res;
  },

  async getMe() {
    return apiFetch<{ user: AuthUser }>('/api/auth/me', {
      method: 'GET',
    });
  },

  async updateProfile(profileData: {
    name?: string;
    avatarUrl?: string;
    jobTitle?: string;
    phone?: string;
    location?: string;
    bio?: string;
  }) {
    const res = await apiFetch<{ user: AuthUser }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    if (res.success && res.user) {
      authStorage.setUser(res.user);
    }

    return res;
  },

  logout() {
    authStorage.clear();
  },
};

export const resumeApi = {
  async getAll(): Promise<{ success: boolean; data?: ResumeData[]; message?: string }> {
    return apiFetch<ResumeData[]>('/api/resumes', {
      method: 'GET',
    });
  },

  async getById(id: string): Promise<{ success: boolean; data?: ResumeData; message?: string }> {
    return apiFetch<ResumeData>(`/api/resumes/${id}`, {
      method: 'GET',
    });
  },

  async create(resume: Partial<ResumeData>): Promise<{ success: boolean; data?: ResumeData; message?: string }> {
    return apiFetch<ResumeData>('/api/resumes', {
      method: 'POST',
      body: JSON.stringify(resume),
    });
  },

  async update(id: string, resume: Partial<ResumeData>): Promise<{ success: boolean; data?: ResumeData; message?: string }> {
    return apiFetch<ResumeData>(`/api/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resume),
    });
  },

  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    return apiFetch(`/api/resumes/${id}`, {
      method: 'DELETE',
    });
  },
};

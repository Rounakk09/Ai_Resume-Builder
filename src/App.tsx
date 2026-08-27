import React, { useState, useEffect, useCallback } from 'react';
import { ResumeData, JobApplication, AppView, TemplateType } from './types';
import { initialResumes, initialJobApplications } from './data/initialData';
import { LandingPage } from './components/LandingPage';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { EditorPage } from './components/EditorPage';
import { ResumePreviewPage } from './components/ResumePreviewPage';
import { AtsOptimizerPage } from './components/AtsOptimizerPage';
import { JobTrackerPage } from './components/JobTrackerPage';
import { SettingsPage } from './components/SettingsPage';
import { ProfilePage } from './components/ProfilePage';
import { MyResumesPage } from './components/MyResumesPage';
import { ComingSoonPage } from './components/ComingSoonPage';
import { NotFoundPage } from './components/NotFoundPage';
import { AppSidebar } from './components/Navigation';
import { ToastProvider, useToast } from './components/Toast';
import { authApi, authStorage, resumeApi, AuthUser } from './services/api';

function AppContent() {
  const { showSuccess, showError, showInfo } = useToast();
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authStorage.getUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!authStorage.getToken();
  });
  
  // Resumes state for currently logged-in user
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState<boolean>(false);

  // Selected active resume
  const [activeResumeId, setActiveResumeId] = useState<string>('');

  // Load resumes from backend for the currently logged-in user
  const loadUserResumes = useCallback(async () => {
    if (!authStorage.getToken()) {
      setResumes([]);
      setActiveResumeId('');
      return;
    }
    setIsLoadingResumes(true);
    try {
      const res = await resumeApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        setResumes(res.data);
        if (res.data.length > 0) {
          setActiveResumeId((prev) => {
            const exists = res.data!.some((r) => r.id === prev);
            return exists ? prev : res.data![0].id;
          });
        } else {
          setActiveResumeId('');
        }
      } else {
        setResumes([]);
        setActiveResumeId('');
      }
    } catch (err) {
      console.warn('Could not load resumes from backend:', err);
      setResumes([]);
    } finally {
      setIsLoadingResumes(false);
    }
  }, []);

  // Check login on startup / page refresh and restore session with backend
  useEffect(() => {
    const token = authStorage.getToken();
    if (token) {
      authApi.getMe().then((res) => {
        if (res.success && res.user) {
          setCurrentUser(res.user);
          authStorage.setUser(res.user);
          setIsLoggedIn(true);
          loadUserResumes();
        } else {
          // Token expired or invalid
          authApi.logout();
          setCurrentUser(null);
          setIsLoggedIn(false);
          setResumes([]);
          setActiveResumeId('');
        }
      }).catch(() => {
        const cached = authStorage.getUser();
        if (cached) {
          setCurrentUser(cached);
          setIsLoggedIn(true);
          loadUserResumes();
        }
      });
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setResumes([]);
      setActiveResumeId('');
    }
  }, [loadUserResumes]);

  // Job applications state
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('synthetic_career_jobs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialJobApplications;
      }
    }
    return initialJobApplications;
  });

  useEffect(() => {
    localStorage.setItem('synthetic_career_jobs', JSON.stringify(applications));
  }, [applications]);

  const activeResume = resumes.find((r) => r.id === activeResumeId) || resumes[0];

  const handleCreateNewResume = async (template: TemplateType = 'minimalist') => {
    const user = currentUser || authStorage.getUser();
    const userName = user?.name || '';
    const userEmail = user?.email || '';
    const nameParts = userName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const newResumePayload: Partial<ResumeData> = {
      title: firstName ? `${firstName}'s Executive Resume` : 'Untitled Executive Resume',
      template,
      atsScore: 88,
      personalDetails: {
        fullName: userName,
        firstName,
        lastName,
        jobTitle: user?.jobTitle || 'Senior Specialist',
        email: userEmail,
        phone: user?.phone || '+1 (555) 019-2834',
        location: user?.location || 'San Francisco, CA',
        address: user?.location || 'San Francisco, CA',
        linkedin: firstName ? `linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}` : '',
      },
      summary: 'Results-oriented executive with extensive background in optimizing system architectures, scaling cross-functional teams, and driving organizational impact.',
      experience: [
        {
          id: `exp-${Date.now()}`,
          jobTitle: 'Lead Specialist',
          company: 'Acme Global Corp',
          location: 'San Francisco, CA',
          startDate: '2022',
          endDate: 'Present',
          duration: '2022 – Present',
          isPresent: true,
          description: 'Orchestrate enterprise workflows and strategic roadmaps.',
          bullets: [
            'Spearheaded key initiatives accelerating product deployment cycles by 32%.',
            'Mentored cross-functional team of 5 direct reports.',
          ],
        },
      ],
      education: [
        {
          id: `edu-${Date.now()}`,
          degree: 'Bachelor of Science',
          institution: 'University of California',
          field: 'Information Systems',
          startYear: '2016',
          endYear: '2020',
        },
      ],
      skills: ['Strategic Roadmapping', 'Agile Delivery', 'Executive Communication', 'Data Analytics', 'Cross-Functional Leadership'],
    };

    if (isLoggedIn && authStorage.getToken()) {
      try {
        const res = await resumeApi.create(newResumePayload);
        if (res.success && res.data) {
          setResumes((prev) => [res.data!, ...prev]);
          setActiveResumeId(res.data.id);
          setCurrentView('editor');
          showSuccess('Resume Created', 'New executive draft initialized.');
          return;
        }
      } catch (err) {
        console.error('Failed to create resume in backend:', err);
      }
    }

    // Fallback local creation
    const localNew: ResumeData = {
      id: `res-${Date.now()}`,
      title: newResumePayload.title!,
      template: newResumePayload.template!,
      atsScore: newResumePayload.atsScore!,
      lastEdited: 'Created just now',
      personalDetails: newResumePayload.personalDetails!,
      summary: newResumePayload.summary!,
      experience: newResumePayload.experience!,
      education: newResumePayload.education!,
      skills: newResumePayload.skills!,
    };
    setResumes((prev) => [localNew, ...prev]);
    setActiveResumeId(localNew.id);
    setCurrentView('editor');
    showSuccess('Resume Created', 'New executive draft initialized.');
  };

  const handleSaveResume = async (updated: ResumeData) => {
    // Optimistic UI update
    setResumes((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...updated, lastEdited: 'Edited just now' } : r))
    );

    if (isLoggedIn && authStorage.getToken()) {
      try {
        await resumeApi.update(updated.id, updated);
      } catch (err) {
        console.error('Failed to sync save with backend:', err);
      }
    }
  };

  const handleDeleteResume = async (id: string) => {
    // Optimistic UI update
    setResumes((prev) => prev.filter((r) => r.id !== id));
    if (activeResumeId === id) {
      const remaining = resumes.filter((r) => r.id !== id);
      setActiveResumeId(remaining.length > 0 ? remaining[0].id : '');
    }

    if (isLoggedIn && authStorage.getToken()) {
      try {
        await resumeApi.delete(id);
        showSuccess('Resume Removed', 'Document was deleted successfully.');
      } catch (err) {
        console.error('Failed to delete resume in backend:', err);
        showError('Delete Failed', 'Could not delete resume from server.');
      }
    } else {
      showSuccess('Resume Removed', 'Document was deleted from workspace.');
    }
  };

  const handleDuplicateResume = async (resume: ResumeData) => {
    const dupPayload: Partial<ResumeData> = {
      ...resume,
      title: `${resume.title} (Copy)`,
    };

    if (isLoggedIn && authStorage.getToken()) {
      try {
        const res = await resumeApi.create(dupPayload);
        if (res.success && res.data) {
          setResumes((prev) => [res.data!, ...prev]);
          showSuccess('Resume Duplicated', `Created copy "${res.data.title}".`);
          return;
        }
      } catch (err) {
        console.error('Failed to duplicate resume in backend:', err);
        showError('Duplicate Failed', 'Could not duplicate document on server.');
      }
    }

    const localDup: ResumeData = {
      ...resume,
      id: `res-${Date.now()}`,
      title: `${resume.title} (Copy)`,
      lastEdited: 'Duplicated just now',
    };
    setResumes((prev) => [localDup, ...prev]);
    showSuccess('Resume Duplicated', `Created copy "${localDup.title}".`);
  };

  const handleApplyKeywordsToResume = async (resumeId: string, newSkills: string[]) => {
    let updatedTarget: ResumeData | null = null;
    setResumes((prev) =>
      prev.map((r) => {
        if (r.id === resumeId) {
          const unique = Array.from(new Set([...r.skills, ...newSkills]));
          const updated = {
            ...r,
            skills: unique,
            atsScore: Math.min(99, (r.atsScore || 85) + 5),
            lastEdited: 'Optimized with AI keywords',
          };
          updatedTarget = updated;
          return updated;
        }
        return r;
      })
    );

    if (updatedTarget && isLoggedIn && authStorage.getToken()) {
      try {
        await resumeApi.update(resumeId, updatedTarget);
      } catch (err) {
        console.error('Failed to sync ATS keywords to backend:', err);
      }
    }
  };

  const handleLoginSuccess = () => {
    const user = authStorage.getUser();
    setCurrentUser(user);
    setIsLoggedIn(true);
    loadUserResumes();
  };

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setResumes([]);
    setActiveResumeId('');
    setCurrentView('landing');
    showInfo('Signed Out', 'You have been safely logged out.');
  };

  const handleUpdateUserProfile = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    authStorage.setUser(updatedUser);
  };

  // Protected route views check
  const isDashboardView =
    isLoggedIn &&
    ['dashboard', 'my-resumes', 'optimizer', 'tracker', 'profile', 'settings', 'coming-soon'].includes(currentView);

  // If a view requires login but user is logged out, show Login or Landing
  useEffect(() => {
    if (!isLoggedIn && ['dashboard', 'my-resumes', 'optimizer', 'tracker', 'profile', 'settings', 'coming-soon', 'editor', 'preview'].includes(currentView)) {
      if (currentView !== 'landing' && currentView !== 'login' && currentView !== 'register') {
        setCurrentView('login');
      }
    }
  }, [isLoggedIn, currentView]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] flex flex-col font-sans selection:bg-[#D4AF37]/25 selection:text-white">
      {/* 1. Landing Page */}
      {currentView === 'landing' && (
        <LandingPage
          onNavigate={(view) => {
            if (view === 'editor') {
              if (isLoggedIn) {
                handleCreateNewResume('minimalist');
              } else {
                setCurrentView('register');
              }
            } else {
              setCurrentView(view);
            }
          }}
          onSelectTemplate={(tpl) => {
            if (isLoggedIn) {
              handleCreateNewResume(tpl);
            } else {
              setCurrentView('register');
            }
          }}
        />
      )}

      {/* 2. Register Page */}
      {currentView === 'register' && (
        <RegisterPage
          onNavigate={setCurrentView}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 3. Login Page */}
      {currentView === 'login' && (
        <LoginPage
          onNavigate={setCurrentView}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 4. Editor Page (Full layout) */}
      {currentView === 'editor' && activeResume && (
        <EditorPage
          resume={activeResume}
          onSave={handleSaveResume}
          onBack={() => setCurrentView('dashboard')}
          onPreview={(res) => {
            handleSaveResume(res);
            setCurrentView('preview');
          }}
        />
      )}

      {/* 5. Resume Preview Page (Full layout) */}
      {currentView === 'preview' && activeResume && (
        <ResumePreviewPage
          resume={activeResume}
          onEdit={(res) => {
            setActiveResumeId(res.id);
            setCurrentView('editor');
          }}
          onBack={() => setCurrentView('dashboard')}
        />
      )}

      {/* 6. Dashboard & Sub-views with persistent AppSidebar */}
      {isDashboardView && (
        <div className="flex min-h-screen">
          <AppSidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            onLogout={handleLogout}
            onCreateNew={() => handleCreateNewResume('minimalist')}
            user={currentUser}
          />
          <main className="flex-1 flex flex-col bg-[#0A0A0A] overflow-y-auto">
            {currentView === 'dashboard' && (
              <DashboardPage
                resumes={resumes}
                onSelectResume={(res) => {
                  setActiveResumeId(res.id);
                  setCurrentView('editor');
                }}
                onPreviewResume={(res) => {
                  setActiveResumeId(res.id);
                  setCurrentView('preview');
                }}
                onCreateNew={() => handleCreateNewResume('minimalist')}
                onDeleteResume={handleDeleteResume}
                onDuplicateResume={handleDuplicateResume}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'my-resumes' && (
              <MyResumesPage
                resumes={resumes}
                onNavigate={setCurrentView}
                onSelectResume={(res) => {
                  setActiveResumeId(res.id);
                  setCurrentView('editor');
                }}
                onCreateNew={() => handleCreateNewResume('minimalist')}
                onDeleteResume={handleDeleteResume}
                onDuplicateResume={handleDuplicateResume}
              />
            )}

            {currentView === 'optimizer' && (
              <AtsOptimizerPage
                resumes={resumes}
                onApplyKeywordsToResume={handleApplyKeywordsToResume}
              />
            )}

            {currentView === 'tracker' && (
              <JobTrackerPage
                applications={applications}
                resumes={resumes}
                onAddApplication={(app) => setApplications((prev) => [app, ...prev])}
                onUpdateStatus={(id, st) =>
                  setApplications((prev) =>
                    prev.map((a) => (a.id === id ? { ...a, status: st } : a))
                  )
                }
                onDeleteApplication={(id) =>
                  setApplications((prev) => prev.filter((a) => a.id !== id))
                }
              />
            )}

            {currentView === 'profile' && currentUser && (
              <ProfilePage
                user={currentUser}
                onUpdateUser={handleUpdateUserProfile}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'settings' && (
              <SettingsPage
                resumes={resumes}
                user={currentUser}
                onNavigate={setCurrentView}
                onResetData={() => {
                  setResumes([]);
                  setApplications(initialJobApplications);
                  localStorage.removeItem('synthetic_career_jobs');
                }}
              />
            )}

            {currentView === 'coming-soon' && (
              <ComingSoonPage
                onNavigate={setCurrentView}
                title="Intelligence Feature in Calibration"
                description="Our engineering team is refining this executive capability. Check back soon for seamless integration."
              />
            )}
          </main>
        </div>
      )}

      {/* 7. Not Found Fallback */}
      {currentView === 'not-found' && (
        <NotFoundPage onNavigate={setCurrentView} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

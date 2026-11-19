'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FundingApplication, UserProfile, UserRole } from './types';
import { INITIAL_APPLICATIONS, MOCK_USERS } from './mock-data';

const STORAGE_KEY_APPS = 'sipanda_applications_v1';
const STORAGE_KEY_USER = 'sipanda_current_user_v1';

export function getStoredUser(): UserProfile {
  if (typeof window === 'undefined') return MOCK_USERS.mahasiswa;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get user from localStorage', e);
  }
  return MOCK_USERS.mahasiswa;
}

export function setStoredUser(user: UserProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user to localStorage', e);
  }
}

export function getStoredApplications(): FundingApplication[] {
  if (typeof window === 'undefined') return INITIAL_APPLICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(INITIAL_APPLICATIONS));
  } catch (e) {
    console.error('Failed to get apps from localStorage', e);
  }
  return INITIAL_APPLICATIONS;
}

export function saveStoredApplications(apps: FundingApplication[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
  } catch (e) {
    console.error('Failed to save apps to localStorage', e);
  }
}

export interface AppStateContextValue {
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  applications: FundingApplication[];
  isLoaded: boolean;
  addApplication: (
    newApp: Omit<
      FundingApplication,
      'id' | 'created_at' | 'updated_at' | 'verifications' | 'approvals'
    >
  ) => FundingApplication;
  updateApplication: (id: string, updates: Partial<FundingApplication>) => void;
  verifyApplication: (id: string, action: 'approved' | 'revision_needed', notes: string) => void;
  approveApplication: (id: string, action: 'approved' | 'rejected', notes: string) => void;
  submitLPJ: (id: string, file_name: string, file_size: number, notes: string) => void;
  verifyLPJ: (id: string, action: 'approved' | 'revision_needed', notes: string) => void;
  resubmitRevision: (
    id: string,
    updates: Partial<FundingApplication>,
    studentNote: string
  ) => void;
}

export const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS.mahasiswa);
  const [applications, setApplications] = useState<FundingApplication[]>(INITIAL_APPLICATIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCurrentUser(getStoredUser());
    setApplications(getStoredApplications());
    setIsLoaded(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_USER && e.newValue) {
        try {
          setCurrentUser(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === STORAGE_KEY_APPS && e.newValue) {
        try {
          setApplications(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const user = MOCK_USERS[role];
    if (user) {
      setCurrentUser(user);
      setStoredUser(user);
    }
  }, []);

  const addApplication = useCallback(
    (
      newApp: Omit<
        FundingApplication,
        'id' | 'created_at' | 'updated_at' | 'verifications' | 'approvals'
      >
    ) => {
      const now = new Date().toISOString();
      const id = `APP-2026-${String(applications.length + 1).padStart(3, '0')}`;
      const fullApp: FundingApplication = {
        ...newApp,
        id,
        created_at: now,
        updated_at: now,
        verifications: [],
        approvals: [],
      };
      const updated = [fullApp, ...applications];
      setApplications(updated);
      saveStoredApplications(updated);
      return fullApp;
    },
    [applications]
  );

  const updateApplication = useCallback(
    (id: string, updates: Partial<FundingApplication>) => {
      const now = new Date().toISOString();
      const updated = applications.map((app) =>
        app.id === id ? { ...app, ...updates, updated_at: now } : app
      );
      setApplications(updated);
      saveStoredApplications(updated);
    },
    [applications]
  );

  const verifyApplication = useCallback(
    (id: string, action: 'approved' | 'revision_needed', notes: string) => {
      const app = applications.find((a) => a.id === id);
      if (!app) return;
      const now = new Date().toISOString();
      const newVer = {
        id: `ver-${Date.now()}`,
        application_id: id,
        verifier_id: currentUser.id,
        verifier_name: currentUser.full_name,
        action,
        notes,
        created_at: now,
      };
      const newStatus = action === 'approved' ? 'verified' : 'revision_needed';
      updateApplication(id, {
        status: newStatus,
        verifications: [...(app.verifications || []), newVer],
      });
    },
    [applications, currentUser, updateApplication]
  );

  const approveApplication = useCallback(
    (id: string, action: 'approved' | 'rejected', notes: string) => {
      const app = applications.find((a) => a.id === id);
      if (!app) return;
      const now = new Date().toISOString();
      const newAppr = {
        id: `appr-${Date.now()}`,
        application_id: id,
        approver_id: currentUser.id,
        approver_name: currentUser.full_name,
        action,
        notes,
        created_at: now,
      };
      const newStatus = action === 'approved' ? 'approved' : 'rejected';
      updateApplication(id, {
        status: newStatus,
        approvals: [...(app.approvals || []), newAppr],
      });
    },
    [applications, currentUser, updateApplication]
  );

  const submitLPJ = useCallback(
    (id: string, file_name: string, file_size: number, notes: string) => {
      const app = applications.find((a) => a.id === id);
      if (!app) return;
      const now = new Date().toISOString();
      const lpj = {
        id: `lpj-${Date.now()}`,
        application_id: id,
        submitted_by: currentUser.id,
        file_name,
        file_size,
        notes,
        submitted_at: now,
        is_verified: false,
      };
      updateApplication(id, {
        status: 'lpj_submitted',
        lpj,
      });
    },
    [applications, currentUser, updateApplication]
  );

  const verifyLPJ = useCallback(
    (id: string, action: 'approved' | 'revision_needed', notes: string) => {
      const app = applications.find((a) => a.id === id);
      if (!app || !app.lpj) return;
      const now = new Date().toISOString();
      if (action === 'approved') {
        const updatedLpj = {
          ...app.lpj,
          is_verified: true,
          verified_by: currentUser.full_name,
          verified_at: now,
          verification_notes: notes,
        };
        updateApplication(id, {
          status: 'completed',
          lpj: updatedLpj,
          verifications: [
            ...(app.verifications || []),
            {
              id: `ver-lpj-${Date.now()}`,
              application_id: id,
              verifier_id: currentUser.id,
              verifier_name: `[Verifikasi LPJ] ${currentUser.full_name}`,
              action: 'approved',
              notes: notes || 'Berkas LPJ dan rekapitulasi bukti pengeluaran disahkan tuntas.',
              created_at: now,
            },
          ],
        });
      } else {
        const updatedLpj = {
          ...app.lpj,
          is_verified: false,
          verification_notes: notes,
        };
        updateApplication(id, {
          status: 'approved',
          lpj: updatedLpj,
          verifications: [
            ...(app.verifications || []),
            {
              id: `ver-lpj-${Date.now()}`,
              application_id: id,
              verifier_id: currentUser.id,
              verifier_name: `[Revisi LPJ] ${currentUser.full_name}`,
              action: 'revision_needed',
              notes: notes || 'Berkas LPJ perlu perbaikan bukti pengeluaran/kuitansi.',
              created_at: now,
            },
          ],
        });
      }
    },
    [applications, currentUser, updateApplication]
  );

  const resubmitRevision = useCallback(
    (id: string, updates: Partial<FundingApplication>, studentNote: string) => {
      const app = applications.find((a) => a.id === id);
      if (!app) return;
      const now = new Date().toISOString();
      const revisionLog = {
        id: `rev-${Date.now()}`,
        application_id: id,
        verifier_id: currentUser.id,
        verifier_name: `[Revisi Mahasiswa] ${currentUser.full_name}`,
        action: 'approved' as const,
        notes: studentNote || 'Berkas perbaikan telah diperbarui dan diajukan ulang ke verifikator.',
        created_at: now,
      };
      updateApplication(id, {
        ...updates,
        status: 'submitted',
        verifications: [...(app.verifications || []), revisionLog],
      });
    },
    [applications, currentUser, updateApplication]
  );

  const value: AppStateContextValue = {
    currentUser,
    switchRole,
    applications,
    isLoaded,
    addApplication,
    updateApplication,
    verifyApplication,
    approveApplication,
    submitLPJ,
    verifyLPJ,
    resubmitRevision,
  };

  return React.createElement(AppStateContext.Provider, { value }, children);
}

// Fallback hook for unit tests or unprovided contexts
function useLocalAppState() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS.mahasiswa);
  const [applications, setApplications] = useState<FundingApplication[]>(INITIAL_APPLICATIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCurrentUser(getStoredUser());
    setApplications(getStoredApplications());
    setIsLoaded(true);
  }, []);

  const switchRole = (role: UserRole) => {
    const user = MOCK_USERS[role];
    if (user) {
      setCurrentUser(user);
      setStoredUser(user);
    }
  };

  const addApplication = (
    newApp: Omit<
      FundingApplication,
      'id' | 'created_at' | 'updated_at' | 'verifications' | 'approvals'
    >
  ) => {
    const now = new Date().toISOString();
    const id = `APP-2026-${String(applications.length + 1).padStart(3, '0')}`;
    const fullApp: FundingApplication = {
      ...newApp,
      id,
      created_at: now,
      updated_at: now,
      verifications: [],
      approvals: [],
    };
    const updated = [fullApp, ...applications];
    setApplications(updated);
    saveStoredApplications(updated);
    return fullApp;
  };

  const updateApplication = (id: string, updates: Partial<FundingApplication>) => {
    const now = new Date().toISOString();
    const updated = applications.map((app) =>
      app.id === id ? { ...app, ...updates, updated_at: now } : app
    );
    setApplications(updated);
    saveStoredApplications(updated);
  };

  const verifyApplication = (id: string, action: 'approved' | 'revision_needed', notes: string) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    const now = new Date().toISOString();
    const newVer = {
      id: `ver-${Date.now()}`,
      application_id: id,
      verifier_id: currentUser.id,
      verifier_name: currentUser.full_name,
      action,
      notes,
      created_at: now,
    };
    const newStatus = action === 'approved' ? 'verified' : 'revision_needed';
    updateApplication(id, {
      status: newStatus,
      verifications: [...(app.verifications || []), newVer],
    });
  };

  const approveApplication = (id: string, action: 'approved' | 'rejected', notes: string) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    const now = new Date().toISOString();
    const newAppr = {
      id: `appr-${Date.now()}`,
      application_id: id,
      approver_id: currentUser.id,
      approver_name: currentUser.full_name,
      action,
      notes,
      created_at: now,
    };
    const newStatus = action === 'approved' ? 'approved' : 'rejected';
    updateApplication(id, {
      status: newStatus,
      approvals: [...(app.approvals || []), newAppr],
    });
  };

  const submitLPJ = (id: string, file_name: string, file_size: number, notes: string) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    const now = new Date().toISOString();
    const lpj = {
      id: `lpj-${Date.now()}`,
      application_id: id,
      submitted_by: currentUser.id,
      file_name,
      file_size,
      notes,
      submitted_at: now,
      is_verified: false,
    };
    updateApplication(id, {
      status: 'lpj_submitted',
      lpj,
    });
  };

  const verifyLPJ = (id: string, action: 'approved' | 'revision_needed', notes: string) => {
    const app = applications.find((a) => a.id === id);
    if (!app || !app.lpj) return;
    const now = new Date().toISOString();
    if (action === 'approved') {
      const updatedLpj = {
        ...app.lpj,
        is_verified: true,
        verified_by: currentUser.full_name,
        verified_at: now,
        verification_notes: notes,
      };
      updateApplication(id, {
        status: 'completed',
        lpj: updatedLpj,
        verifications: [
          ...(app.verifications || []),
          {
            id: `ver-lpj-${Date.now()}`,
            application_id: id,
            verifier_id: currentUser.id,
            verifier_name: `[Verifikasi LPJ] ${currentUser.full_name}`,
            action: 'approved',
            notes: notes || 'Berkas LPJ dan rekapitulasi bukti pengeluaran disahkan tuntas.',
            created_at: now,
          },
        ],
      });
    } else {
      const updatedLpj = {
        ...app.lpj,
        is_verified: false,
        verification_notes: notes,
      };
      updateApplication(id, {
        status: 'approved',
        lpj: updatedLpj,
        verifications: [
          ...(app.verifications || []),
          {
            id: `ver-lpj-${Date.now()}`,
            application_id: id,
            verifier_id: currentUser.id,
            verifier_name: `[Revisi LPJ] ${currentUser.full_name}`,
            action: 'revision_needed',
            notes: notes || 'Berkas LPJ perlu perbaikan bukti pengeluaran/kuitansi.',
            created_at: now,
          },
        ],
      });
    }
  };

  const resubmitRevision = (
    id: string,
    updates: Partial<FundingApplication>,
    studentNote: string
  ) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    const now = new Date().toISOString();
    const revisionLog = {
      id: `rev-${Date.now()}`,
      application_id: id,
      verifier_id: currentUser.id,
      verifier_name: `[Revisi Mahasiswa] ${currentUser.full_name}`,
      action: 'approved' as const,
      notes: studentNote || 'Berkas perbaikan telah diperbarui dan diajukan ulang ke verifikator.',
      created_at: now,
    };
    updateApplication(id, {
      ...updates,
      status: 'submitted',
      verifications: [...(app.verifications || []), revisionLog],
    });
  };

  return {
    currentUser,
    switchRole,
    applications,
    isLoaded,
    addApplication,
    updateApplication,
    verifyApplication,
    approveApplication,
    submitLPJ,
    verifyLPJ,
    resubmitRevision,
  };
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context) {
    return context;
  }
  return useLocalAppState();
}

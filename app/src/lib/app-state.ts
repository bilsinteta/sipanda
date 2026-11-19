'use client';

import { useState, useEffect } from 'react';
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

export function useAppState() {
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

  const addApplication = (newApp: Omit<FundingApplication, 'id' | 'created_at' | 'updated_at' | 'verifications' | 'approvals'>) => {
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
    const updated = applications.map((app) => (app.id === id ? { ...app, ...updates, updated_at: now } : app));
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
      is_verified: true,
    };
    updateApplication(id, {
      status: 'completed',
      lpj,
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
  };
}

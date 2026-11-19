import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredUser,
  setStoredUser,
  getStoredApplications,
  saveStoredApplications,
} from '../lib/app-state';
import { MOCK_USERS, INITIAL_APPLICATIONS } from '../lib/mock-data';
import { FundingApplication } from '../lib/types';

describe('App State & Workflow Transition Integrity', () => {
  beforeEach(() => {
    // Reset global localStorage mock
    const store: Record<string, string> = {};
    global.localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k];
      },
      length: 0,
      key: () => null,
    };
  });

  it('handles user storage and fallback cleanly', () => {
    // Default fallback is mahasiswa
    expect(getStoredUser().role).toBe('mahasiswa');

    // Switch to Wadek III (approver)
    setStoredUser(MOCK_USERS.approver);
    expect(getStoredUser().role).toBe('approver');
    expect(getStoredUser().full_name).toContain('Hendra Gunawan');
  });

  it('loads initial applications when storage is empty', () => {
    const apps = getStoredApplications();
    expect(apps.length).toBeGreaterThanOrEqual(4);
    expect(apps[0].id).toMatch(/^APP-2026-/);
  });

  it('simulates the full 4-actor lifecycle: Submit -> Verify -> Approve -> LPJ', () => {
    const initialApps = [...INITIAL_APPLICATIONS];
    saveStoredApplications(initialApps);

    // 1. Mahasiswa Submits New Proposal
    const newProposal: FundingApplication = {
      id: 'APP-2026-TEST',
      title: 'Workshop Cloud Computing Ramah Lingkungan',
      organization_name: 'BEM FILKOM',
      activity_category: 'Seminar & Workshop',
      amount_requested: 5000000,
      target_date: '2026-12-01',
      description: 'Pengenalan GSE dan komputasi awan rendah karbon.',
      applicant_id: MOCK_USERS.mahasiswa.id,
      applicant_name: MOCK_USERS.mahasiswa.full_name,
      applicant_nim: MOCK_USERS.mahasiswa.nim,
      status: 'submitted',
      estimated_paper_sheets: 20,
      documents: [
        {
          id: 'doc-1',
          application_id: 'APP-2026-TEST',
          file_name: 'Proposal_Workshop.pdf',
          file_size: 1024000,
          file_type: 'application/pdf',
          document_type: 'proposal',
          uploaded_by: MOCK_USERS.mahasiswa.id,
          uploaded_at: new Date().toISOString(),
          url: '#',
        },
      ],
      verifications: [],
      approvals: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const appsWithNew = [newProposal, ...initialApps];
    saveStoredApplications(appsWithNew);
    expect(getStoredApplications()[0].id).toBe('APP-2026-TEST');
    expect(getStoredApplications()[0].status).toBe('submitted');

    // 2. Verifikator approves document completeness
    const verVerification = {
      id: 'ver-test',
      application_id: 'APP-2026-TEST',
      verifier_id: MOCK_USERS.verifikator.id,
      verifier_name: MOCK_USERS.verifikator.full_name,
      action: 'approved' as const,
      notes: 'RAB dan lembar pengesahan lengkap dan valid.',
      created_at: new Date().toISOString(),
    };

    const verifiedApps = appsWithNew.map((a) =>
      a.id === 'APP-2026-TEST'
        ? {
            ...a,
            status: 'verified' as const,
            verifications: [verVerification],
          }
        : a
    );
    saveStoredApplications(verifiedApps);

    const verifiedItem = getStoredApplications().find((a) => a.id === 'APP-2026-TEST');
    expect(verifiedItem?.status).toBe('verified');
    expect(verifiedItem?.verifications.length).toBe(1);

    // 3. Approver (Wadek III) approves funding
    const appApproval = {
      id: 'appr-test',
      application_id: 'APP-2026-TEST',
      approver_id: MOCK_USERS.approver.id,
      approver_name: MOCK_USERS.approver.full_name,
      action: 'approved' as const,
      notes: 'Disetujui sesuai pagu kemahasiswaan semester ganjil.',
      created_at: new Date().toISOString(),
    };

    const approvedApps = verifiedApps.map((a) =>
      a.id === 'APP-2026-TEST'
        ? {
            ...a,
            status: 'approved' as const,
            approvals: [appApproval],
          }
        : a
    );
    saveStoredApplications(approvedApps);

    const approvedItem = getStoredApplications().find((a) => a.id === 'APP-2026-TEST');
    expect(approvedItem?.status).toBe('approved');
    expect(approvedItem?.approvals.length).toBe(1);

    // 4. Mahasiswa submits LPJ after event completion
    const lpjRecord = {
      id: 'lpj-test',
      application_id: 'APP-2026-TEST',
      submitted_by: MOCK_USERS.mahasiswa.id,
      file_name: 'LPJ_Workshop_Final.pdf',
      file_size: 2048000,
      notes: 'Kegiatan terlaksana dengan 120 peserta. Saldo nihil.',
      submitted_at: new Date().toISOString(),
      is_verified: true,
    };

    const completedApps = approvedApps.map((a) =>
      a.id === 'APP-2026-TEST'
        ? {
            ...a,
            status: 'completed' as const,
            lpj: lpjRecord,
          }
        : a
    );
    saveStoredApplications(completedApps);

    const completedItem = getStoredApplications().find((a) => a.id === 'APP-2026-TEST');
    expect(completedItem?.status).toBe('completed');
    expect(completedItem?.lpj?.file_name).toBe('LPJ_Workshop_Final.pdf');
  });
});

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

  it('supports the revision lifecycle: Submit -> Revision Needed -> Resubmit -> Verified', () => {
    const initialApps = [...INITIAL_APPLICATIONS];
    saveStoredApplications(initialApps);

    // 1. Submit proposal
    const testApp: FundingApplication = {
      id: 'APP-REV-01',
      title: 'Lomba Robotika Nasional',
      organization_name: 'Komunitas Robotika',
      activity_category: 'Kompetisi & Lomba',
      amount_requested: 10000000,
      target_date: '2026-11-25',
      description: 'Partisipasi kontes robot.',
      applicant_id: MOCK_USERS.mahasiswa.id,
      applicant_name: MOCK_USERS.mahasiswa.full_name,
      status: 'submitted',
      estimated_paper_sheets: 20,
      documents: [],
      verifications: [],
      approvals: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveStoredApplications([testApp, ...initialApps]);

    // 2. Verifikator asks for revision
    const verRev = {
      id: 'ver-rev',
      application_id: 'APP-REV-01',
      verifier_id: MOCK_USERS.verifikator.id,
      verifier_name: MOCK_USERS.verifikator.full_name,
      action: 'revision_needed' as const,
      notes: 'Mohon rincikan anggaran akomodasi dan lampirkan surat izin Dekanat.',
      created_at: new Date().toISOString(),
    };

    const appsWithRev = getStoredApplications().map((a) =>
      a.id === 'APP-REV-01'
        ? { ...a, status: 'revision_needed' as const, verifications: [verRev] }
        : a
    );
    saveStoredApplications(appsWithRev);

    let currentApp = getStoredApplications().find((a) => a.id === 'APP-REV-01');
    expect(currentApp?.status).toBe('revision_needed');
    expect(currentApp?.verifications[0].notes).toContain('akomodasi');

    // 3. Mahasiswa edits and resubmits
    const studentNote = 'RAB akomodasi telah dirinci dan surat izin Dekanat telah dilampirkan.';
    const resubmittedApps = getStoredApplications().map((a) =>
      a.id === 'APP-REV-01'
        ? {
            ...a,
            status: 'submitted' as const,
            amount_requested: 9500000, // adjusted
            verifications: [
              ...a.verifications,
              {
                id: 'rev-sub-01',
                application_id: 'APP-REV-01',
                verifier_id: MOCK_USERS.mahasiswa.id,
                verifier_name: `[Revisi Mahasiswa] ${MOCK_USERS.mahasiswa.full_name}`,
                action: 'approved' as const,
                notes: studentNote,
                created_at: new Date().toISOString(),
              },
            ],
          }
        : a
    );
    saveStoredApplications(resubmittedApps);

    currentApp = getStoredApplications().find((a) => a.id === 'APP-REV-01');
    expect(currentApp?.status).toBe('submitted');
    expect(currentApp?.amount_requested).toBe(9500000);
    expect(currentApp?.verifications.length).toBe(2);
    expect(currentApp?.verifications[1].verifier_name).toContain('[Revisi Mahasiswa]');
  });

  it('supports the full LPJ verification lifecycle: Submit LPJ -> LPJ Revision -> Resubmit -> LPJ Approved & Completed', () => {
    const initialApps = [...INITIAL_APPLICATIONS];
    saveStoredApplications(initialApps);

    // 1. Application is approved
    const appRecord: FundingApplication = {
      id: 'APP-LPJ-01',
      title: 'Festival Budaya Mahasiswa FILKOM',
      organization_name: 'BEM FILKOM',
      activity_category: 'Seminar & Workshop',
      amount_requested: 8000000,
      target_date: '2026-10-10',
      description: 'Pentas seni dan budaya mahasiswa.',
      applicant_id: MOCK_USERS.mahasiswa.id,
      applicant_name: MOCK_USERS.mahasiswa.full_name,
      status: 'approved',
      estimated_paper_sheets: 25,
      documents: [],
      verifications: [],
      approvals: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveStoredApplications([appRecord, ...initialApps]);

    // 2. Mahasiswa submits LPJ -> status MUST stay 'approved' and is_verified MUST be false
    const initialLPJ = {
      id: 'lpj-101',
      application_id: 'APP-LPJ-01',
      submitted_by: MOCK_USERS.mahasiswa.id,
      file_name: 'LPJ_Festival_Budaya.pdf',
      file_size: 1800000,
      notes: 'Acara berjalan lancar, terlampir rincian pengeluaran.',
      submitted_at: new Date().toISOString(),
      is_verified: false,
    };
    const appsWithLPJ = getStoredApplications().map((a) =>
      a.id === 'APP-LPJ-01' ? { ...a, lpj: initialLPJ } : a
    );
    saveStoredApplications(appsWithLPJ);

    let currentApp = getStoredApplications().find((a) => a.id === 'APP-LPJ-01');
    expect(currentApp?.status).toBe('approved');
    expect(currentApp?.lpj?.is_verified).toBe(false);

    // 3. Verifikator requests revision on LPJ (e.g. missing receipts)
    const lpjRevNotes = 'Mohon lampirkan kuitansi sewa tenda dan rincian konsumsi pemateri.';
    const appsWithLPJRev = getStoredApplications().map((a) =>
      a.id === 'APP-LPJ-01'
        ? {
            ...a,
            lpj: {
              ...a.lpj!,
              verification_notes: lpjRevNotes,
              is_verified: false,
            },
            verifications: [
              ...a.verifications,
              {
                id: 'ver-lpj-rev',
                application_id: 'APP-LPJ-01',
                verifier_id: MOCK_USERS.verifikator.id,
                verifier_name: `[Revisi LPJ] ${MOCK_USERS.verifikator.full_name}`,
                action: 'revision_needed' as const,
                notes: lpjRevNotes,
                created_at: new Date().toISOString(),
              },
            ],
          }
        : a
    );
    saveStoredApplications(appsWithLPJRev);

    currentApp = getStoredApplications().find((a) => a.id === 'APP-LPJ-01');
    expect(currentApp?.status).toBe('approved');
    expect(currentApp?.lpj?.is_verified).toBe(false);
    expect(currentApp?.lpj?.verification_notes).toContain('sewa tenda');
    expect(currentApp?.verifications.some((v) => v.verifier_name.includes('[Revisi LPJ]'))).toBe(true);

    // 4. Mahasiswa updates LPJ with revised document
    const updatedLPJ = {
      ...currentApp!.lpj!,
      file_name: 'LPJ_Festival_Budaya_Revisi_Lengkap.pdf',
      file_size: 2400000,
      notes: 'Kuitansi sewa tenda dan rincian konsumsi telah dilengkapi.',
    };
    const appsWithResubmittedLPJ = getStoredApplications().map((a) =>
      a.id === 'APP-LPJ-01' ? { ...a, lpj: updatedLPJ } : a
    );
    saveStoredApplications(appsWithResubmittedLPJ);

    currentApp = getStoredApplications().find((a) => a.id === 'APP-LPJ-01');
    expect(currentApp?.lpj?.file_name).toBe('LPJ_Festival_Budaya_Revisi_Lengkap.pdf');

    // 5. Verifikator approves LPJ -> status becomes 'completed', is_verified becomes true
    const approvalTime = new Date().toISOString();
    const appsWithApprovedLPJ = getStoredApplications().map((a) =>
      a.id === 'APP-LPJ-01'
        ? {
            ...a,
            status: 'completed' as const,
            lpj: {
              ...a.lpj!,
              is_verified: true,
              verified_by: MOCK_USERS.verifikator.full_name,
              verified_at: approvalTime,
              verification_notes: 'LPJ dan bukti kuitansi sah tuntas 100%.',
            },
            verifications: [
              ...a.verifications,
              {
                id: 'ver-lpj-ok',
                application_id: 'APP-LPJ-01',
                verifier_id: MOCK_USERS.verifikator.id,
                verifier_name: `[Verifikasi LPJ] ${MOCK_USERS.verifikator.full_name}`,
                action: 'approved' as const,
                notes: 'LPJ dan bukti kuitansi sah tuntas 100%.',
                created_at: approvalTime,
              },
            ],
          }
        : a
    );
    saveStoredApplications(appsWithApprovedLPJ);

    currentApp = getStoredApplications().find((a) => a.id === 'APP-LPJ-01');
    expect(currentApp?.status).toBe('completed');
    expect(currentApp?.lpj?.is_verified).toBe(true);
    expect(currentApp?.lpj?.verified_by).toContain('Budi Santoso');
    expect(currentApp?.verifications.some((v) => v.verifier_name.includes('[Verifikasi LPJ]'))).toBe(true);
  });
});

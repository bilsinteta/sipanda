import { describe, it, expect } from 'vitest';
import { MOCK_USERS, INITIAL_APPLICATIONS } from '../lib/mock-data';
import { UserRole, ApplicationStatus, ActivityCategory } from '../lib/types';
import { createClient } from '../lib/supabase/client';

describe('Schema, Types, Mock Data & Client Initialization Integrity', () => {
  it('has all 4 required actor roles properly configured in MOCK_USERS', () => {
    const requiredRoles: UserRole[] = ['mahasiswa', 'verifikator', 'approver', 'admin'];
    for (const role of requiredRoles) {
      expect(MOCK_USERS[role]).toBeDefined();
      expect(MOCK_USERS[role].role).toBe(role);
      expect(MOCK_USERS[role].email).toContain('@');
      expect(MOCK_USERS[role].full_name.length).toBeGreaterThan(3);
    }
  });

  it('validates INITIAL_APPLICATIONS conforms to FundingApplication schema', () => {
    expect(INITIAL_APPLICATIONS.length).toBeGreaterThanOrEqual(4);

    for (const app of INITIAL_APPLICATIONS) {
      expect(app.id).toBeDefined();
      expect(app.title.length).toBeGreaterThan(5);
      expect(app.amount_requested).toBeGreaterThan(0);
      expect(typeof app.estimated_paper_sheets).toBe('number');
      expect(app.estimated_paper_sheets).toBeGreaterThan(0);

      const validStatuses: ApplicationStatus[] = [
        'draft',
        'submitted',
        'verified',
        'revision_needed',
        'approved',
        'rejected',
        'completed',
      ];
      expect(validStatuses).toContain(app.status);

      const validCategories: ActivityCategory[] = [
        'Kompetisi & Lomba',
        'Seminar & Workshop',
        'Program Kerja Ormawa',
        'Pengabdian Masyarakat',
        'Karya Inovasi & Riset',
      ];
      expect(validCategories).toContain(app.activity_category);

      expect(Array.isArray(app.documents)).toBe(true);
      expect(Array.isArray(app.verifications)).toBe(true);
      expect(Array.isArray(app.approvals)).toBe(true);
    }
  });

  it('initializes Supabase browser client safely even with fallback dummy credentials', () => {
    const client = createClient();
    expect(client).toBeDefined();
    expect(typeof client.from).toBe('function');
    expect(typeof client.auth.getSession).toBe('function');
  });
});

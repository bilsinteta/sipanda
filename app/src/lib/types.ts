export type UserRole = 'mahasiswa' | 'verifikator' | 'approver' | 'admin';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'revision_needed'
  | 'verified'
  | 'approved'
  | 'rejected'
  | 'completed';

export type DocumentType = 'proposal' | 'rab' | 'lampiran' | 'lpj' | 'revisi';

export type ActivityCategory =
  | 'Kompetisi & Lomba'
  | 'Seminar & Workshop'
  | 'Program Kerja Ormawa'
  | 'Pengabdian Masyarakat'
  | 'Karya Inovasi & Riset';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  nim?: string;
  organization?: string;
  created_at?: string;
}

export interface DocumentItem {
  id: string;
  application_id: string;
  file_name: string;
  file_size: number; // in bytes
  file_type: string;
  document_type: DocumentType;
  uploaded_by: string;
  uploaded_at: string;
  url?: string;
}

export interface VerificationLog {
  id: string;
  application_id: string;
  verifier_id: string;
  verifier_name: string;
  action: 'approved' | 'revision_needed';
  notes: string;
  created_at: string;
}

export interface ApprovalLog {
  id: string;
  application_id: string;
  approver_id: string;
  approver_name: string;
  action: 'approved' | 'rejected';
  notes: string;
  created_at: string;
}

export interface AccountabilityReport {
  id: string;
  application_id: string;
  submitted_by: string;
  notes: string;
  file_name: string;
  file_size: number;
  submitted_at: string;
  is_verified: boolean;
}

export interface FundingApplication {
  id: string;
  title: string;
  organization_name: string;
  activity_category: ActivityCategory;
  amount_requested: number;
  target_date: string;
  description: string;
  applicant_id: string;
  applicant_name: string;
  applicant_nim?: string;
  status: ApplicationStatus;
  estimated_paper_sheets: number; // For CO2 calculation: ~20 sheets per app
  created_at: string;
  updated_at: string;
  documents: DocumentItem[];
  verifications: VerificationLog[];
  approvals: ApprovalLog[];
  lpj?: AccountabilityReport;
}

export interface EmissionCalculationResult {
  totalApplications: number;
  conventional: {
    totalSheets: number;
    paperEmissionKg: number; // kg CO2
    printerElectricityKwh: number;
    printerEmissionKg: number; // kg CO2e
    totalCostSavedIdr: number; // based on paper & printing cost
  };
  digital: {
    totalAccess: number;
    totalTransferGB: number;
    energyKwh: number;
    emissionKg: number; // kg CO2e
    emissionPerAccessKg: number;
  };
  comparison: {
    differencePercentage: number;
    warningNote: string;
  };
}


-- =========================================================================
-- SIPANDA (Sistem Informasi Pengajuan Dana) - Supabase Database Schema
-- Berbasis Green Software Engineering di FILKOM Universitas Brawijaya
-- Idempotent / Safe to Run Multiple Times
-- =========================================================================

-- 1. Setup Custom Types & Enums safely
do $$ begin
  create type user_role as enum ('mahasiswa', 'verifikator', 'approver', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type application_status as enum ('draft', 'submitted', 'revision_needed', 'verified', 'approved', 'rejected', 'completed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type document_type as enum ('proposal', 'rab', 'lampiran', 'lpj', 'revisi');
exception
  when duplicate_object then null;
end $$;

-- 2. Users Table (Linked to Supabase Auth)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  role user_role not null default 'mahasiswa',
  nim text,
  organization text,
  created_at timestamptz default now()
);

-- Enable RLS for users
alter table public.users enable row level security;
drop policy if exists "Allow public view for profiles" on public.users;
create policy "Allow public view for profiles" on public.users for select using (true);
drop policy if exists "Allow users to update own profile" on public.users;
create policy "Allow users to update own profile" on public.users for update using (auth.uid() = id);

-- 3. Funding Applications Table
create table if not exists public.funding_applications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  organization_name text not null,
  activity_category text not null,
  amount_requested numeric(15, 2) not null check (amount_requested > 0),
  target_date date not null,
  description text,
  applicant_id uuid references public.users(id) on delete set null,
  applicant_name text not null,
  applicant_nim text,
  status application_status not null default 'submitted',
  estimated_paper_sheets integer not null default 20,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS for funding applications
alter table public.funding_applications enable row level security;
drop policy if exists "Applicants view own applications" on public.funding_applications;
create policy "Applicants view own applications" on public.funding_applications 
  for select using (auth.uid() = applicant_id);
drop policy if exists "Staff view all applications" on public.funding_applications;
create policy "Staff view all applications" on public.funding_applications 
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role in ('verifikator', 'approver', 'admin'))
  );
drop policy if exists "Applicants create applications" on public.funding_applications;
create policy "Applicants create applications" on public.funding_applications 
  for insert with check (auth.uid() = applicant_id);
drop policy if exists "Update applications" on public.funding_applications;
create policy "Update applications" on public.funding_applications 
  for update using (
    auth.uid() = applicant_id or 
    exists (select 1 from public.users where id = auth.uid() and role in ('verifikator', 'approver', 'admin'))
  );

-- 4. Documents Table
create table if not exists public.documents (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references public.funding_applications(id) on delete cascade not null,
  file_name text not null,
  file_path text not null,
  file_size bigint not null default 0,
  file_type text not null,
  document_type document_type not null default 'proposal',
  uploaded_by uuid references public.users(id) on delete set null,
  uploaded_at timestamptz default now()
);

alter table public.documents enable row level security;
drop policy if exists "View documents" on public.documents;
create policy "View documents" on public.documents for select using (true);
drop policy if exists "Upload documents" on public.documents;
create policy "Upload documents" on public.documents for insert with check (auth.role() = 'authenticated');

-- 5. Verifications Table
create table if not exists public.verifications (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references public.funding_applications(id) on delete cascade not null,
  verifier_id uuid references public.users(id) on delete set null,
  verifier_name text not null,
  action text not null check (action in ('approved', 'revision_needed')),
  notes text,
  created_at timestamptz default now()
);

alter table public.verifications enable row level security;
drop policy if exists "View verifications" on public.verifications;
create policy "View verifications" on public.verifications for select using (true);
drop policy if exists "Insert verifications" on public.verifications;
create policy "Insert verifications" on public.verifications for insert with check (
  exists (select 1 from public.users where id = auth.uid() and role in ('verifikator', 'admin'))
);

-- 6. Approvals Table
create table if not exists public.approvals (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references public.funding_applications(id) on delete cascade not null,
  approver_id uuid references public.users(id) on delete set null,
  approver_name text not null,
  action text not null check (action in ('approved', 'rejected')),
  notes text,
  created_at timestamptz default now()
);

alter table public.approvals enable row level security;
drop policy if exists "View approvals" on public.approvals;
create policy "View approvals" on public.approvals for select using (true);
drop policy if exists "Insert approvals" on public.approvals;
create policy "Insert approvals" on public.approvals for insert with check (
  exists (select 1 from public.users where id = auth.uid() and role in ('approver', 'admin'))
);

-- 7. Accountability Reports (LPJ) Table
create table if not exists public.accountability_reports (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references public.funding_applications(id) on delete cascade unique not null,
  submitted_by uuid references public.users(id) on delete set null,
  file_name text not null,
  file_path text not null,
  file_size bigint not null default 0,
  notes text,
  submitted_at timestamptz default now(),
  is_verified boolean not null default false
);

alter table public.accountability_reports enable row level security;
drop policy if exists "View LPJ" on public.accountability_reports;
create policy "View LPJ" on public.accountability_reports for select using (true);
drop policy if exists "Submit LPJ" on public.accountability_reports;
create policy "Submit LPJ" on public.accountability_reports for insert with check (auth.role() = 'authenticated');

-- 8. Storage Buckets (Run in Supabase Storage setup)
insert into storage.buckets (id, name, public) 
values ('sipanda-docs', 'sipanda-docs', true)
on conflict (id) do nothing;

drop policy if exists "Allow authenticated uploads" on storage.objects;
create policy "Allow authenticated uploads" on storage.objects 
  for insert with check (bucket_id = 'sipanda-docs' and auth.role() = 'authenticated');

drop policy if exists "Allow public document access" on storage.objects;
create policy "Allow public document access" on storage.objects 
  for select using (bucket_id = 'sipanda-docs');

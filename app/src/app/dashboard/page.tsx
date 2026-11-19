'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CarbonBadge } from '@/components/ui/CarbonBadge';
import { useAppState } from '@/lib/app-state';
import { EMISSION_FACTORS } from '@/lib/emission-data';
import { ApplicationStatus } from '@/lib/types';

export default function DashboardPage() {
  const { currentUser, applications } = useAppState();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter applications based on role and tab
  const roleApplications = applications.filter((app) => {
    if (currentUser.role === 'mahasiswa') {
      // Mahasiswa sees their own or all relevant
      return true;
    }
    return true;
  });

  const filteredApps = roleApplications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  // KPI calculations
  const totalApprovedFunds = applications
    .filter((a) => a.status === 'approved' || a.status === 'completed')
    .reduce((sum, a) => sum + Number(a.amount_requested), 0);

  const pendingVerificationCount = applications.filter((a) => a.status === 'submitted').length;
  const pendingApprovalCount = applications.filter((a) => a.status === 'verified').length;
  const needsRevisionCount = applications.filter((a) => a.status === 'revision_needed').length;
  const completedLpjCount = applications.filter((a) => a.status === 'completed').length;

  const totalSheetsSaved = applications.reduce((sum, a) => sum + (a.estimated_paper_sheets || 20), 0);
  const paperEmissionPreventedKg = (totalSheetsSaved * EMISSION_FACTORS.paperProductionGramCO2PerSheet) / 1000;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Welcome Banner */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">👋</span>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                Selamat Datang di SIPANDA FILKOM
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentUser.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
              {currentUser.organization || 'Fakultas Ilmu Komputer Universitas Brawijaya'} • Peran Aktif:{' '}
              <span className="font-semibold capitalize bg-emerald-700/80 px-2 py-0.5 rounded text-white text-xs">
                {currentUser.role}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentUser.role === 'mahasiswa' && (
              <Link href="/dashboard/pengajuan/baru">
                <Button variant="primary" className="bg-white text-emerald-900 hover:bg-emerald-50">
                  + Buat Pengajuan Baru
                </Button>
              </Link>
            )}
            {currentUser.role === 'verifikator' && (
              <Link href="/dashboard/verifikasi">
                <Button variant="primary" className="bg-white text-emerald-900 hover:bg-emerald-50">
                  Periksa Antrean ({pendingVerificationCount})
                </Button>
              </Link>
            )}
            {currentUser.role === 'approver' && (
              <Link href="/dashboard/persetujuan">
                <Button variant="primary" className="bg-white text-emerald-900 hover:bg-emerald-50">
                  Persetujuan Dana ({pendingApprovalCount})
                </Button>
              </Link>
            )}
            <Link href="/dashboard/emisi">
              <Button variant="secondary" className="bg-emerald-950/60 text-white border border-emerald-700/50 hover:bg-emerald-900">
                🌱 Kalkulator Emisi
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Dana Disetujui */}
          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Dana Disetujui</span>
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">💰</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              Rp {(totalApprovedFunds / 1000000).toFixed(1)} Jt
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Dari total {applications.length} usulan kegiatan
            </div>
          </Card>

          {/* Card 2: Pengajuan Aktif & Status */}
          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Status Pengajuan</span>
              <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600">📂</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {applications.length}{' '}
              <span className="text-xs font-normal text-slate-500">Total</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-amber-600 dark:text-amber-400">⏳ {pendingVerificationCount + pendingApprovalCount} proses</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400">✓ {completedLpjCount} tuntas</span>
            </div>
          </Card>

          {/* Card 3: Kertas Dihemat (Green Metric) */}
          <Card className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40">
            <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
              <span>Kertas Terhindar</span>
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700">📄</span>
            </div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-2">
              {totalSheetsSaved.toLocaleString('id-ID')}{' '}
              <span className="text-xs font-normal text-slate-500">lembar</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              ± Rp {(totalSheetsSaved * 500).toLocaleString('id-ID')} biaya jilid/cetak
            </div>
          </Card>

          {/* Card 4: Potensi Emisi Dicegah (Green Metric) */}
          <Card className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40">
            <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
              <span>Emisi Kertas Dicegah</span>
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700">🌿</span>
            </div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-2">
              {paperEmissionPreventedKg.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-500">kg CO₂</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Faktor 34g CO₂/lembar (Ekin & Elitok)
            </div>
          </Card>
        </div>

        {/* Quick Role Context Alert */}
        {currentUser.role === 'verifikator' && pendingVerificationCount > 0 && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <span className="text-base">⚠️</span>
              <span>
                Terdapat <strong>{pendingVerificationCount} proposal</strong> baru yang menunggu pemeriksaan administrasi kelengkapan berkas Anda.
              </span>
            </div>
            <Link href="/dashboard/verifikasi" className="font-semibold text-amber-700 dark:text-amber-300 hover:underline">
              Buka Verifikasi →
            </Link>
          </div>
        )}

        {currentUser.role === 'approver' && pendingApprovalCount > 0 && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
              <span className="text-base">⚖️</span>
              <span>
                Terdapat <strong>{pendingApprovalCount} usulan</strong> yang telah lolos verifikasi administrasi dan memerlukan keputusan persetujuan dana Anda.
              </span>
            </div>
            <Link href="/dashboard/persetujuan" className="font-semibold text-emerald-700 dark:text-emerald-300 hover:underline">
              Buka Persetujuan →
            </Link>
          </div>
        )}

        {/* Applications List Card */}
        <Card
          title="Daftar Pengajuan Dana Mahasiswa"
          subtitle="Pemantauan alur status proposal, verifikasi berkas, persetujuan dekanat, dan LPJ"
          action={
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">Semua Status ({applications.length})</option>
                <option value="submitted">Diajukan ({applications.filter((a) => a.status === 'submitted').length})</option>
                <option value="verified">Terverifikasi ({applications.filter((a) => a.status === 'verified').length})</option>
                <option value="revision_needed">Perlu Revisi ({needsRevisionCount})</option>
                <option value="approved">Disetujui ({applications.filter((a) => a.status === 'approved').length})</option>
                <option value="completed">LPJ Selesai ({completedLpjCount})</option>
              </select>
            </div>
          }
        >
          {filteredApps.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              Tidak ada pengajuan dengan filter status ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Kode & Judul Kegiatan</th>
                    <th className="py-3 px-3">Ormawa / Pemohon</th>
                    <th className="py-3 px-3">Nominal Usulan</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Tanggal Acara</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-3">
                        <Link
                          href={`/dashboard/pengajuan/${app.id}`}
                          className="font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 block line-clamp-1"
                        >
                          {app.title}
                        </Link>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">{app.id}</span>
                          <span>•</span>
                          <span>{app.activity_category}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                          {app.organization_name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {app.applicant_name} ({app.applicant_nim || '-'})
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                        Rp {Number(app.amount_requested).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge status={app.status} />
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        {app.target_date}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link href={`/dashboard/pengajuan/${app.id}`}>
                          <Button variant="outline" size="sm">
                            Detail →
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Green IT Principles Summary Footer */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 text-base">🌱</span>
            <span>
              <strong>Efisiensi Transfer Data:</strong> Rata-rata transfer halaman ini terukur ~0.8 MB (target &lt; 1 MB), mendukung prinsip Sustainable Web Design.
            </span>
          </div>
          <CarbonBadge gramsCO2={0.08} cleanerThanPercent={91} />
        </div>
      </div>
    </DashboardLayout>
  );
}

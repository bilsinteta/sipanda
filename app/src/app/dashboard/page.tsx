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

export default function DashboardPage() {
  const { currentUser, applications } = useAppState();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const totalApprovedFunds = applications
    .filter((a) => a.status === 'approved' || a.status === 'lpj_submitted' || a.status === 'completed')
    .reduce((sum, a) => sum + Number(a.amount_requested), 0);

  const pendingVerificationCount = applications.filter((a) => a.status === 'submitted').length;
  const pendingApprovalCount = applications.filter((a) => a.status === 'verified').length;
  const needsRevisionCount = applications.filter((a) => a.status === 'revision_needed').length;
  const pendingLpjVerifyCount = applications.filter(
    (a) => a.status === 'lpj_submitted' || (a.status === 'approved' && a.lpj && !a.lpj.is_verified)
  ).length;
  const completedLpjCount = applications.filter((a) => a.status === 'completed').length;

  const totalSheetsSaved = applications.reduce((sum, a) => sum + (a.estimated_paper_sheets || 20), 0);
  const paperEmissionPreventedKg = (totalSheetsSaved * EMISSION_FACTORS.paperProductionGramCO2PerSheet) / 1000;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <div className="text-xs text-zinc-400 font-mono">
              PERAN: <span className="uppercase text-zinc-800 dark:text-zinc-200 font-semibold">{currentUser.role}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
              Selamat datang, {currentUser.full_name}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {currentUser.organization || 'Fakultas Ilmu Komputer Universitas Brawijaya'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentUser.role === 'mahasiswa' && (
              <Link href="/dashboard/pengajuan/baru">
                <Button variant="primary" size="sm">
                  + Buat Usulan Baru
                </Button>
              </Link>
            )}
            {currentUser.role === 'verifikator' && (
              <Link href="/dashboard/verifikasi">
                <Button variant="primary" size="sm">
                  Antrean Verifikasi ({pendingVerificationCount})
                </Button>
              </Link>
            )}
            {currentUser.role === 'approver' && (
              <Link href="/dashboard/persetujuan">
                <Button variant="primary" size="sm">
                  Tinjau Persetujuan ({pendingApprovalCount})
                </Button>
              </Link>
            )}
            <Link href="/dashboard/emisi">
              <Button variant="secondary" size="sm">
                Kalkulator CO₂e
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <Card className="p-3 sm:p-4">
            <div className="text-[11px] sm:text-xs text-zinc-500 font-medium">
              Dana Disetujui
            </div>
            <div className="text-lg sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
              Rp {(totalApprovedFunds / 1000000).toFixed(1)} Jt
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-1 truncate">
              Dari {applications.length} usulan
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="text-[11px] sm:text-xs text-zinc-500 font-medium">
              Status Berkas
            </div>
            <div className="text-lg sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
              {applications.length}{' '}
              <span className="text-xs font-normal text-zinc-500">Usulan</span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-1 flex items-center gap-1 truncate">
              <span className="text-amber-700 dark:text-amber-400">{pendingVerificationCount + pendingApprovalCount} p</span>
              <span>·</span>
              <span className="text-emerald-700 dark:text-emerald-400">{completedLpjCount} tuntas</span>
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="text-[11px] sm:text-xs text-zinc-500 font-medium">
              Kertas Tereliminasi
            </div>
            <div className="text-lg sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
              {totalSheetsSaved.toLocaleString('id-ID')}{' '}
              <span className="text-xs font-normal text-zinc-500">Lembar</span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-1 truncate">
              ± Rp {(totalSheetsSaved * 500).toLocaleString('id-ID')} hemat
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="text-[11px] sm:text-xs text-zinc-500 font-medium">
              Emisi Dicegah
            </div>
            <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
              {paperEmissionPreventedKg.toFixed(2)}{' '}
              <span className="text-xs font-normal text-zinc-500">kg CO₂</span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-1 truncate">
              Faktor 34g CO₂/lbr
            </div>
          </Card>
        </div>

        {/* Role Action Alert if needed */}
        {currentUser.role === 'verifikator' && pendingVerificationCount > 0 && (
          <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between text-xs">
            <span className="text-amber-800 dark:text-amber-300">
              Ada <strong>{pendingVerificationCount} proposal</strong> menunggu verifikasi berkas administrasi.
            </span>
            <Link href="/dashboard/verifikasi" className="font-semibold text-amber-800 dark:text-amber-300 hover:underline">
              Buka Antrean →
            </Link>
          </div>
        )}

        {currentUser.role === 'approver' && pendingApprovalCount > 0 && (
          <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between text-xs">
            <span className="text-zinc-800 dark:text-zinc-200">
              Ada <strong>{pendingApprovalCount} usulan</strong> lolos verifikasi menunggu persetujuan dana Anda.
            </span>
            <Link href="/dashboard/persetujuan" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline">
              Buka Persetujuan →
            </Link>
          </div>
        )}

        {/* Applications List */}
        <Card
          title="Daftar Pengajuan Dana Mahasiswa"
          subtitle="Pemantauan alur status proposal, verifikasi berkas, persetujuan dekanat, dan LPJ"
          action={
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-zinc-800 dark:text-zinc-200 focus:outline-none"
            >
              <option value="all">Semua Status ({applications.length})</option>
              <option value="submitted">Diajukan ({applications.filter((a) => a.status === 'submitted').length})</option>
              <option value="verified">Terverifikasi ({applications.filter((a) => a.status === 'verified').length})</option>
              <option value="revision_needed">Perlu Revisi ({needsRevisionCount})</option>
              <option value="approved">Disetujui (Belum LPJ) ({applications.filter((a) => a.status === 'approved' && !a.lpj).length})</option>
              <option value="lpj_submitted">Menunggu Verifikasi LPJ ({pendingLpjVerifyCount})</option>
              <option value="completed">LPJ Selesai ({completedLpjCount})</option>
            </select>
          }
        >
          {filteredApps.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              Tidak ada data pengajuan dengan filter ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider font-medium text-[11px]">
                    <th className="py-2.5 px-3">Kode & Kegiatan</th>
                    <th className="py-2.5 px-3">Ormawa</th>
                    <th className="py-2.5 px-3">Usulan Dana</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Target Tanggal</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <Link
                          href={`/dashboard/pengajuan/${app.id}`}
                          className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline block truncate max-w-xs"
                        >
                          {app.title}
                        </Link>
                        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono">{app.id}</span>
                          <span>·</span>
                          <span>{app.activity_category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-zinc-800 dark:text-zinc-200 truncate max-w-[180px]">
                          {app.organization_name}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                          {app.applicant_name}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                        Rp {Number(app.amount_requested).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <Badge status={app.status} lpj={app.lpj} />
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                        {app.target_date}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
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

        {/* Minimal Footer Info */}
        <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Efisiensi Transfer Data: Rata-rata transfer halaman terukur ~0,8 MB (&lt; 1 MB target).</span>
          <CarbonBadge gramsCO2={0.02} cleanerThanPercent={96} />
        </div>
      </div>
    </DashboardLayout>
  );
}

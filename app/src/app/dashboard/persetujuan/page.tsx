'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppState } from '@/lib/app-state';

export default function PersetujuanPage() {
  const { applications, currentUser } = useAppState();

  const pendingApproval = applications.filter((app) => app.status === 'verified');
  const alreadyApproved = applications.filter(
    (app) => app.status === 'approved' || app.status === 'completed'
  );

  const totalPendingAmount = pendingApproval.reduce(
    (sum, a) => sum + Number(a.amount_requested),
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Persetujuan Alokasi Dana (Wakil Dekan III)
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Penetapan persetujuan pendanaan untuk usulan kegiatan yang telah lolos verifikasi administrasi
          </p>
        </div>

        {currentUser.role !== 'approver' && currentUser.role !== 'admin' && (
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs text-zinc-600 dark:text-zinc-400">
            Peran aktif saat ini: <strong>{currentUser.role}</strong>. Untuk mensimulasikan wewenang Wakil Dekan III, ganti peran di bilah atas.
          </div>
        )}

        {/* Budget Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="text-xs text-zinc-500 font-medium">
              Usulan Menunggu Keputusan
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
              Rp {totalPendingAmount.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              {pendingApproval.length} proposal lolos verifikasi berkas
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-xs text-zinc-500 font-medium">
              Total Dana Terealisasi
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
              Rp{' '}
              {alreadyApproved
                .reduce((sum, a) => sum + Number(a.amount_requested), 0)
                .toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              {alreadyApproved.length} kegiatan telah disetujui
            </div>
          </Card>
        </div>

        {/* Pending Approval List */}
        <Card
          title={`Antrean Persetujuan (${pendingApproval.length})`}
          subtitle="Daftar proposal siap diterbitkan keputusan persetujuannya"
        >
          {pendingApproval.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              Tidak ada antrean persetujuan yang menunggu keputusan saat ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider font-medium text-[11px]">
                    <th className="py-2.5 px-3">Kode</th>
                    <th className="py-2.5 px-3">Kegiatan & Lembaga</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3">Nominal Usulan</th>
                    <th className="py-2.5 px-3">Verifikator</th>
                    <th className="py-2.5 px-3 text-right">Keputusan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {pendingApproval.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                        {app.id}
                      </td>
                      <td className="py-3 px-3 max-w-sm">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {app.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {app.organization_name} · {app.applicant_name}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-zinc-500 whitespace-nowrap">
                        {app.activity_category}
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                        Rp {Number(app.amount_requested).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-zinc-400 whitespace-nowrap">
                        {app.verifications[app.verifications.length - 1]?.verifier_name || 'Staf Kemahasiswaan'}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <Link href={`/dashboard/pengajuan/${app.id}`}>
                          <Button variant="primary" size="sm">
                            Tinjau Usulan →
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
      </div>
    </DashboardLayout>
  );
}

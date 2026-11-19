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
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Persetujuan Alokasi Dana (Wakil Dekan III)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Penetapan keputusan pendanaan untuk usulan kegiatan mahasiswa yang telah memenuhi syarat verifikasi administrasi
          </p>
        </div>

        {currentUser.role !== 'approver' && currentUser.role !== 'admin' && (
          <div className="p-3.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
            ℹ️ Anda sedang masuk sebagai <strong>{currentUser.role}</strong>. Untuk mensimulasikan wewenang Wakil Dekan III, ganti peran di sudut kanan atas.
          </div>
        )}

        {/* Budget Overview Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
            <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
              Usulan Dana Menunggu Persetujuan
            </div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
              Rp {totalPendingAmount.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {pendingApproval.length} proposal lolos verifikasi administrasi
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-xs text-slate-500 font-semibold">
              Total Dana Terealisasi Tahap Berjalan
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Rp{' '}
              {alreadyApproved
                .reduce((sum, a) => sum + Number(a.amount_requested), 0)
                .toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {alreadyApproved.length} kegiatan disetujui
            </div>
          </Card>
        </div>

        {/* Pending Approval List */}
        <Card
          title={`Antrean Persetujuan Pimpinan (${pendingApproval.length})`}
          subtitle="Daftar proposal yang telah diverifikasi dan siap diterbitkan keputusan persetujuannya"
        >
          {pendingApproval.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <span className="text-4xl block mb-2">✨</span>
              <p className="text-sm font-semibold">Tidak Ada Antrean Persetujuan</p>
              <p className="text-xs text-slate-400 mt-1">
                Semua usulan yang telah diverifikasi telah tuntas diproses.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Kode</th>
                    <th className="py-3 px-3">Nama Kegiatan & Lembaga</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Nominal Usulan</th>
                    <th className="py-3 px-3">Verifikator Terakhir</th>
                    <th className="py-3 px-3 text-right">Keputusan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {pendingApproval.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {app.id}
                      </td>
                      <td className="py-3.5 px-3 max-w-sm">
                        <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                          {app.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {app.organization_name} • {app.applicant_name}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                        {app.activity_category}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                        Rp {Number(app.amount_requested).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        {app.verifications[app.verifications.length - 1]?.verifier_name || 'Staf Kemahasiswaan'}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link href={`/dashboard/pengajuan/${app.id}`}>
                          <Button variant="primary" size="sm">
                            Tinjau & Setujui →
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

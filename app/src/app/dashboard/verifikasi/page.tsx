'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppState } from '@/lib/app-state';

export default function VerifikasiPage() {
  const { applications, currentUser } = useAppState();

  const pendingVerification = applications.filter(
    (app) => app.status === 'submitted' || app.status === 'revision_needed'
  );

  const pendingLpjCount = applications.filter(
    (app) => (app.status === 'lpj_submitted' || app.status === 'approved') && app.lpj && !app.lpj.is_verified
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Antrean Verifikasi Administrasi
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Pemeriksaan kelengkapan proposal, validitas RAB, dan lembar pengesahan usulan mahasiswa
          </p>
        </div>

        {/* LPJ Verification Notification Banner */}
        {pendingLpjCount > 0 && (
          <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📑</span>
              <div>
                <span className="font-semibold text-purple-900 dark:text-purple-200">
                  {pendingLpjCount} Laporan Pertanggungjawaban (LPJ) Menunggu Pemeriksaan
                </span>
                <p className="text-purple-700/80 dark:text-purple-300/80 text-[11px] mt-0.5">
                  Mahasiswa telah mengunggah berkas LPJ digital dan memerlukan verifikasi bukti pengeluaran.
                </p>
              </div>
            </div>
            <Link href="/dashboard/lpj">
              <Button variant="primary" size="sm" className="bg-purple-700 hover:bg-purple-800 text-white shrink-0">
                Buka Verifikasi LPJ ({pendingLpjCount}) →
              </Button>
            </Link>
          </div>
        )}

        {currentUser.role !== 'verifikator' && currentUser.role !== 'admin' && (
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs text-zinc-600 dark:text-zinc-400">
            Peran aktif saat ini: <strong>{currentUser.role}</strong>. Untuk memproses verifikasi, gunakan pengalih peran di bilah atas.
          </div>
        )}

        <Card
          title={`Menunggu Verifikasi (${pendingVerification.length})`}
          subtitle="Pilih berkas proposal untuk melakukan validasi kelayakan administratif"
        >
          {pendingVerification.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              Tidak ada proposal baru dalam antrean saat ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider font-medium text-[11px]">
                    <th className="py-2.5 px-3">Kode</th>
                    <th className="py-2.5 px-3">Judul Usulan & Ormawa</th>
                    <th className="py-2.5 px-3">Usulan Dana</th>
                    <th className="py-2.5 px-3">Tanggal Kegiatan</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {pendingVerification.map((app) => (
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
                        <div className="text-[11px] text-zinc-400 truncate flex items-center gap-1.5 mt-0.5">
                          <span>{app.organization_name}</span>
                          <span>·</span>
                          <span>Pengusul: {app.applicant_name}</span>
                          {app.verifications?.some((v) => v.verifier_name?.includes('[Revisi Mahasiswa]')) && (
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800 text-[10px]">
                              Telah Direvisi
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                        Rp {Number(app.amount_requested).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                        {app.target_date}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <Badge status={app.status} lpj={app.lpj} />
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <Link href={`/dashboard/pengajuan/${app.id}`}>
                          <Button variant="primary" size="sm">
                            Periksa Berkas →
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

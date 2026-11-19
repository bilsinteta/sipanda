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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Antrean Verifikasi Administrasi
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pemeriksaan kelengkapan proposal, validitas RAB, dan lembar pengesahan usulan mahasiswa
          </p>
        </div>

        {currentUser.role !== 'verifikator' && currentUser.role !== 'admin' && (
          <div className="p-3.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
            ℹ️ Anda sedang masuk sebagai <strong>{currentUser.role}</strong>. Untuk mensimulasikan tugas verifikator, Anda dapat mengganti peran melalui tombol di pojok kanan atas.
          </div>
        )}

        <Card
          title={`Daftar Menunggu Verifikasi (${pendingVerification.length})`}
          subtitle="Pilih usulan untuk memeriksa berkas digital dan memberikan rekomendasi kelayakan"
        >
          {pendingVerification.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <span className="text-4xl block mb-2">🎉</span>
              <p className="text-sm font-semibold">Semua Usulan Selesai Diverifikasi</p>
              <p className="text-xs text-slate-400 mt-1">Tidak ada proposal baru dalam antrean saat ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Kode Proposal</th>
                    <th className="py-3 px-3">Judul Usulan & Ormawa</th>
                    <th className="py-3 px-3">Usulan Dana</th>
                    <th className="py-3 px-3">Tanggal Kegiatan</th>
                    <th className="py-3 px-3">Status Berkas</th>
                    <th className="py-3 px-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {pendingVerification.map((app) => (
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
                          {app.organization_name} • Pengusul: {app.applicant_name}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                        Rp {Number(app.amount_requested).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        {app.target_date}
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge status={app.status} />
                      </td>
                      <td className="py-3.5 px-3 text-right">
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

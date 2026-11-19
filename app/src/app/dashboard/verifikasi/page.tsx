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
        <div className="pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Antrean Verifikasi Administrasi
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Pemeriksaan kelengkapan proposal, validitas RAB, dan lembar pengesahan usulan mahasiswa
          </p>
        </div>

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
                        <div className="text-[11px] text-zinc-400 truncate">
                          {app.organization_name} · Pengusul: {app.applicant_name}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                        Rp {Number(app.amount_requested).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                        {app.target_date}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <Badge status={app.status} />
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

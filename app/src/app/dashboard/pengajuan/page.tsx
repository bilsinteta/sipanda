'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppState } from '@/lib/app-state';
import { ActivityCategory } from '@/lib/types';

export default function PengajuanListPage() {
  const { applications, currentUser } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || app.activity_category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' || app.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories: ActivityCategory[] = [
    'Kompetisi & Lomba',
    'Seminar & Workshop',
    'Program Kerja Ormawa',
    'Pengabdian Masyarakat',
    'Karya Inovasi & Riset',
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Daftar Usulan Pendanaan Kegiatan
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Seluruh rekapitulasi proposal kegiatan mahasiswa dan Ormawa FILKOM UB
            </p>
          </div>

          {currentUser.role === 'mahasiswa' && (
            <Link href="/dashboard/pengajuan/baru">
              <Button variant="primary" size="sm">
                + Usulan Baru
              </Button>
            </Link>
          )}
        </div>

        {/* Filter */}
        <Card className="p-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <input
                type="text"
                placeholder="Cari judul, ormawa, kode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="submitted">Diajukan</option>
                <option value="verified">Terverifikasi</option>
                <option value="revision_needed">Perlu Revisi</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
                <option value="completed">LPJ Selesai</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Results */}
        <Card>
          {filteredApps.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              Tidak ditemukan data pengajuan yang sesuai.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider font-medium text-[11px]">
                    <th className="py-2.5 px-3">Kode</th>
                    <th className="py-2.5 px-3">Judul Kegiatan</th>
                    <th className="py-2.5 px-3">Ormawa</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3">Usulan Dana</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Kertas Dihemat</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                        {app.id}
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <Link
                          href={`/dashboard/pengajuan/${app.id}`}
                          className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline block truncate"
                        >
                          {app.title}
                        </Link>
                        <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                          {app.target_date}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-zinc-800 dark:text-zinc-200 truncate max-w-[160px]">
                          {app.organization_name}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate max-w-[160px]">
                          {app.applicant_name}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-zinc-500 whitespace-nowrap">
                        {app.activity_category}
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                        Rp {Number(app.amount_requested).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <Badge status={app.status} />
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                        {app.estimated_paper_sheets} lembar
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <Link href={`/dashboard/pengajuan/${app.id}`}>
                          <Button variant="outline" size="sm">
                            Detail
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

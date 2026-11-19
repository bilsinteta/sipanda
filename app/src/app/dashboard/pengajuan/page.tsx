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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Daftar Usulan Pendanaan Kegiatan
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Seluruh rekapitulasi proposal kegiatan mahasiswa dan Ormawa FILKOM UB
            </p>
          </div>

          {currentUser.role === 'mahasiswa' && (
            <Link href="/dashboard/pengajuan/baru">
              <Button variant="primary">
                + Ajukan Usulan Baru
              </Button>
            </Link>
          )}
        </div>

        {/* Filter & Search Bar */}
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Pencarian
              </label>
              <input
                type="text"
                placeholder="Cari judul, ormawa, kode proposal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Kategori Kegiatan
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Status Alur
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
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

        {/* Results Table */}
        <Card>
          {filteredApps.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <p className="text-sm font-semibold">Tidak ditemukan data pengajuan</p>
              <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Kode</th>
                    <th className="py-3 px-3">Judul Kegiatan</th>
                    <th className="py-3 px-3">Ormawa / Pengaju</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Usulan Dana</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Est. Kertas Dihemat</th>
                    <th className="py-3 px-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
                        {app.id}
                      </td>
                      <td className="py-3.5 px-3 max-w-xs">
                        <Link
                          href={`/dashboard/pengajuan/${app.id}`}
                          className="font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-2"
                        >
                          {app.title}
                        </Link>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Acara: {app.target_date}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {app.organization_name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {app.applicant_name}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                        {app.activity_category}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        Rp {Number(app.amount_requested).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <Badge status={app.status} />
                      </td>
                      <td className="py-3.5 px-3 text-emerald-700 dark:text-emerald-400 font-medium whitespace-nowrap">
                        🌿 {app.estimated_paper_sheets} lembar
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <Link href={`/dashboard/pengajuan/${app.id}`}>
                          <Button variant="outline" size="sm">
                            Buka Detail
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

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppState } from '@/lib/app-state';

export default function ArsipPage() {
  const { applications } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');

  const archivedApps = applications.filter((app) => {
    return (
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalArchivedSheets = applications.reduce(
    (acc, a) => acc + (a.estimated_paper_sheets || 20),
    0
  );

  const totalArchivedFunds = applications.reduce(
    (acc, a) => acc + Number(a.amount_requested),
    0
  );

  const exportCSV = () => {
    const headers = ['ID', 'Judul Kegiatan', 'Ormawa', 'Kategori', 'Usulan Dana', 'Status', 'Tanggal'];
    const rows = applications.map((a) => [
      a.id,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.organization_name}"`,
      `"${a.activity_category}"`,
      a.amount_requested,
      a.status,
      a.target_date,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Arsip_SIPANDA_FILKOM_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🗄️</span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Arsip Digital Usulan & LPJ
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pusat penyimpanan permanen seluruh dokumen proposal, RAB, verifikasi, dan LPJ kegiatan mahasiswa
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={exportCSV}>
            📥 Ekspor Rekap (.CSV)
          </Button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-xs text-slate-500 font-semibold">Total Dokumen Terarsip</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {applications.length * 2 + 1}{' '}
              <span className="text-xs font-normal text-slate-500">Berkas</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">Proposal, RAB, dan LPJ Digital</div>
          </Card>

          <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
            <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">Kertas Fisik Tergantikan</div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
              {totalArchivedSheets.toLocaleString('id-ID')}{' '}
              <span className="text-xs font-normal text-slate-500">Lembar A4</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Penyimpanan 100% paperless</div>
          </Card>

          <Card className="p-4">
            <div className="text-xs text-slate-500 font-semibold">Total Alokasi Terekam</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Rp {(totalArchivedFunds / 1000000).toFixed(1)} Jt
            </div>
            <div className="text-xs text-slate-500 mt-1">Akumulasi anggaran kegiatan</div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-4">
          <input
            type="text"
            placeholder="Cari riwayat arsip berdasarkan kode, judul kegiatan, atau nama organisasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </Card>

        {/* Archive Table */}
        <Card title="Repositori Dokumen Administrasi">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Kode Dokumen</th>
                  <th className="py-3 px-3">Kegiatan & Ormawa</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Status Terakhir</th>
                  <th className="py-3 px-3">Tanggal Unggah</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {archivedApps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {app.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {app.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {app.organization_name} • Pengusul: {app.applicant_name}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                      {app.activity_category}
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge status={app.status} />
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {app.created_at.split('T')[0]}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link href={`/dashboard/pengajuan/${app.id}`}>
                        <Button variant="outline" size="sm">
                          Buka Arsip ↗
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

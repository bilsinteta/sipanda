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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Arsip Digital Usulan & LPJ
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Pusat penyimpanan permanen seluruh dokumen proposal, RAB, verifikasi, dan LPJ kegiatan mahasiswa
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={exportCSV}>
            Ekspor Rekap (.CSV)
          </Button>
        </div>

        {/* 3 Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="p-4">
            <div className="text-xs text-zinc-500 font-medium">Dokumen Terarsip</div>
            <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
              {applications.length * 2 + 1}{' '}
              <span className="text-xs font-normal text-zinc-500">Berkas</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Proposal, RAB, dan LPJ digital</div>
          </Card>

          <Card className="p-4">
            <div className="text-xs text-zinc-500 font-medium">Kertas Tergantikan</div>
            <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
              {totalArchivedSheets.toLocaleString('id-ID')}{' '}
              <span className="text-xs font-normal text-zinc-500">Lembar A4</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Penyimpanan 100% paperless</div>
          </Card>

          <Card className="p-4">
            <div className="text-xs text-zinc-500 font-medium">Total Anggaran Terekam</div>
            <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
              Rp {(totalArchivedFunds / 1000000).toFixed(1)} Jt
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Akumulasi anggaran kegiatan</div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-3">
          <input
            type="text"
            placeholder="Cari riwayat arsip berdasarkan kode, judul kegiatan, atau nama organisasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none"
          />
        </Card>

        {/* Table */}
        <Card title="Repositori Dokumen Administrasi">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider font-medium text-[11px]">
                  <th className="py-2.5 px-3">Kode Dokumen</th>
                  <th className="py-2.5 px-3">Kegiatan & Ormawa</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Status Terakhir</th>
                  <th className="py-2.5 px-3">Tanggal Unggah</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {archivedApps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                      {app.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {app.title}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {app.organization_name} · {app.applicant_name}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-zinc-500">
                      {app.activity_category}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <Badge status={app.status} />
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                      {app.created_at.split('T')[0]}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
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

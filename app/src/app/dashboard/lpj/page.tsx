'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FileUpload } from '@/components/ui/FileUpload';
import { useAppState } from '@/lib/app-state';

export default function LpjPage() {
  const { applications, submitLPJ } = useAppState();

  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');

  const waitingLpj = applications.filter((app) => app.status === 'approved' && !app.lpj);
  const completedLpj = applications.filter((app) => app.status === 'completed' || app.lpj);

  const handleSaveLpj = () => {
    if (!activeUploadId || !uploadedFile) return;
    submitLPJ(activeUploadId, uploadedFile.name, uploadedFile.size, notes);
    setActiveUploadId(null);
    setUploadedFile(null);
    setNotes('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Laporan Pertanggungjawaban (LPJ) Digital
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Pengumpulan berkas pertanggungjawaban kegiatan, bukti transaksi, dan dokumentasi hasil acara tanpa berkas cetak
          </p>
        </div>

        {/* Section 1: Waiting */}
        <Card
          title={`Menunggu Pengumpulan LPJ (${waitingLpj.length})`}
          subtitle="Kegiatan yang telah disetujui pendanaannya dan perlu mengunggah berkas LPJ"
        >
          {waitingLpj.length === 0 ? (
            <div className="py-8 text-center text-zinc-400 text-xs">
              Tidak ada kegiatan yang berstatus menunggu unggah LPJ.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider font-medium text-[11px]">
                    <th className="py-2.5 px-3">Kode</th>
                    <th className="py-2.5 px-3">Nama Kegiatan</th>
                    <th className="py-2.5 px-3">Ormawa</th>
                    <th className="py-2.5 px-3">Dana Disetujui</th>
                    <th className="py-2.5 px-3">Tanggal Kegiatan</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {waitingLpj.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                        {app.id}
                      </td>
                      <td className="py-3 px-3 font-medium text-zinc-900 dark:text-zinc-100">
                        {app.title}
                      </td>
                      <td className="py-3 px-3 text-zinc-500">
                        {app.organization_name}
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-zinc-900 dark:text-zinc-100">
                        Rp {Number(app.amount_requested).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                        {app.target_date}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setActiveUploadId(app.id)}
                        >
                          Unggah LPJ
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Section 2: Completed */}
        <Card
          title={`Arsip LPJ Selesai (${completedLpj.length})`}
          subtitle="Rekapitulasi berkas pertanggungjawaban yang telah diverifikasi"
        >
          {completedLpj.length === 0 ? (
            <div className="py-8 text-center text-zinc-400 text-xs">
              Belum ada LPJ yang tuntas diarsipkan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider font-medium text-[11px]">
                    <th className="py-2.5 px-3">Kode</th>
                    <th className="py-2.5 px-3">Judul Kegiatan</th>
                    <th className="py-2.5 px-3">Ormawa</th>
                    <th className="py-2.5 px-3">Berkas LPJ</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {completedLpj.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                        {app.id}
                      </td>
                      <td className="py-3 px-3 font-medium text-zinc-900 dark:text-zinc-100">
                        {app.title}
                      </td>
                      <td className="py-3 px-3 text-zinc-500">
                        {app.organization_name}
                      </td>
                      <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                        {app.lpj?.file_name || 'LPJ_Lengkap.pdf'}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <Badge status="completed" />
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

        {/* Modal: Upload LPJ */}
        <Modal
          isOpen={!!activeUploadId}
          onClose={() => setActiveUploadId(null)}
          title="Unggah Dokumen Laporan Pertanggungjawaban (LPJ)"
        >
          <div className="space-y-4 text-xs">
            <p className="text-zinc-500">
              Lampirkan berkas pertanggungjawaban final yang mencakup laporan kegiatan, rekapitulasi realisasi anggaran, kuitansi sah, dan dokumentasi foto.
            </p>

            <FileUpload
              onFileSelect={(f) => setUploadedFile(f)}
              label="Pilih Berkas LPJ (.pdf)"
              hint="Format PDF diutamakan. Maksimal 5 MB."
            />

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Catatan Pengantar LPJ:
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tuliskan keterangan ringkas mengenai sisa anggaran atau ketercapaian target..."
                className="w-full text-xs p-2.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setActiveUploadId(null)}>
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!uploadedFile}
                onClick={handleSaveLpj}
              >
                Kirim & Selesaikan LPJ
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

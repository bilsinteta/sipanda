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

  // Apps ready for LPJ (approved but no LPJ yet)
  const waitingLpj = applications.filter((app) => app.status === 'approved' && !app.lpj);
  // Apps with completed LPJ
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
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📑</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Laporan Pertanggungjawaban (LPJ) Digital
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pengumpulan berkas pertanggungjawaban kegiatan, bukti transaksi, dan dokumentasi hasil acara tanpa berkas cetak
          </p>
        </div>

        {/* Section 1: Waiting for LPJ */}
        <Card
          title={`Kegiatan Menunggu Pengumpulan LPJ (${waitingLpj.length})`}
          subtitle="Kegiatan yang telah disetujui pendanaannya dan perlu mengunggah LPJ setelah pelaksanaan"
        >
          {waitingLpj.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              Tidak ada kegiatan yang berstatus menunggu unggah LPJ.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Kode</th>
                    <th className="py-3 px-3">Nama Kegiatan</th>
                    <th className="py-3 px-3">Ormawa</th>
                    <th className="py-3 px-3">Dana Disetujui</th>
                    <th className="py-3 px-3">Tanggal Kegiatan</th>
                    <th className="py-3 px-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {waitingLpj.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {app.id}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                        {app.title}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                        {app.organization_name}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-emerald-700 dark:text-emerald-400">
                        Rp {Number(app.amount_requested).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        {app.target_date}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setActiveUploadId(app.id)}
                        >
                          📤 Unggah LPJ
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Section 2: Completed LPJs */}
        <Card
          title={`Arsip LPJ Selesai & Terverifikasi (${completedLpj.length})`}
          subtitle="Rekapitulasi berkas pertanggungjawaban yang telah diterima dan terekam secara permanen"
        >
          {completedLpj.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              Belum ada LPJ yang tuntas diarsipkan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Kode</th>
                    <th className="py-3 px-3">Judul Kegiatan</th>
                    <th className="py-3 px-3">Ormawa</th>
                    <th className="py-3 px-3">Berkas LPJ Terunggah</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {completedLpj.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {app.id}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                        {app.title}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                        {app.organization_name}
                      </td>
                      <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300">
                        📄 {app.lpj?.file_name || 'LPJ_Lengkap.pdf'}
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge status="completed" />
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link href={`/dashboard/pengajuan/${app.id}`}>
                          <Button variant="outline" size="sm">
                            Lihat Detail
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
            <p className="text-slate-600 dark:text-slate-400">
              Lampirkan berkas pertanggungjawaban final yang mencakup laporan kegiatan, rekapitulasi realisasi anggaran, kuitansi/nota sah, dan bukti foto kegiatan.
            </p>

            <FileUpload
              onFileSelect={(f) => setUploadedFile(f)}
              label="Pilih Berkas LPJ (.pdf)"
              hint="Format PDF diutamakan. Maksimal 5 MB."
            />

            <div>
              <label className="block font-semibold mb-1">Catatan Pengantar LPJ:</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tuliskan keterangan ringkas mengenai sisa anggaran atau ketercapaian target..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
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

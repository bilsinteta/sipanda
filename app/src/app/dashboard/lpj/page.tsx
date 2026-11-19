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
import { FundingApplication } from '@/lib/types';

export default function LpjPage() {
  const { applications, currentUser, submitLPJ, verifyLPJ } = useAppState();

  // Upload modal state (Mahasiswa)
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');

  // Verification modal state (Verifikator)
  const [activeVerifyApp, setActiveVerifyApp] = useState<FundingApplication | null>(null);
  const [verifyAction, setVerifyAction] = useState<'approved' | 'revision_needed'>('approved');
  const [verifyNotes, setVerifyNotes] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // 1. Usulan disetujui yang BELUM mengunggah LPJ
  const waitingUploadLpj = applications.filter((app) => app.status === 'approved' && !app.lpj);

  // 2. LPJ yang sudah diunggah tapi BELUM diverifikasi tuntas oleh verifikator
  const waitingVerifyLpj = applications.filter(
    (app) => (app.status === 'lpj_submitted' || app.status === 'approved') && app.lpj && !app.lpj.is_verified
  );

  // 3. LPJ yang sudah diverifikasi dan berstatus tuntas
  const completedLpj = applications.filter(
    (app) => app.status === 'completed' || (app.lpj && app.lpj.is_verified)
  );

  // Handler: Mahasiswa unggah LPJ
  const handleSaveLpj = () => {
    if (!activeUploadId || !uploadedFile) return;
    submitLPJ(activeUploadId, uploadedFile.name, uploadedFile.size, notes);
    setActiveUploadId(null);
    setUploadedFile(null);
    setNotes('');
    showToast('Berkas LPJ berhasil diunggah! Menunggu pemeriksaan verifikator kemahasiswaan.');
  };

  // Handler: Verifikator verifikasi LPJ
  const handleConfirmVerifyLPJ = () => {
    if (!activeVerifyApp) return;
    verifyLPJ(activeVerifyApp.id, verifyAction, verifyNotes);
    const msg =
      verifyAction === 'approved'
        ? `LPJ untuk "${activeVerifyApp.title}" berhasil disahkan dan usulan tuntas!`
        : `Catatan revisi LPJ untuk "${activeVerifyApp.title}" telah dikirim ke mahasiswa.`;
    setActiveVerifyApp(null);
    setVerifyNotes('');
    showToast(msg);
  };

  const isVerifikator = currentUser.role === 'verifikator' || currentUser.role === 'admin';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between gap-3 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Page Title */}
        <div className="pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Laporan Pertanggungjawaban (LPJ) Digital
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Alur verifikasi berjenjang: Pengunggahan LPJ oleh mahasiswa → Pemeriksaan kuitansi & berkas oleh Verifikator → Pengesahan Usulan Tuntas
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
              Peran: <strong className="capitalize text-zinc-900 dark:text-zinc-100">{currentUser.role}</strong>
            </span>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="text-[11px] text-zinc-500 font-medium">Belum Unggah LPJ</div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
              {waitingUploadLpj.length} <span className="text-xs font-normal text-zinc-400">kegiatan</span>
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">Menunggu mahasiswa input berkas</div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20">
            <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">Menunggu Verifikasi LPJ</div>
            <div className="text-xl font-bold font-mono text-amber-900 dark:text-amber-200 mt-0.5">
              {waitingVerifyLpj.length} <span className="text-xs font-normal text-amber-600/80">berkas</span>
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">Perlu pemeriksaan oleh verifikator</div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">LPJ Disahkan (Tuntas)</div>
            <div className="text-xl font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-0.5">
              {completedLpj.length} <span className="text-xs font-normal text-emerald-600/80">arsip</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Diverifikasi & terdokumentasi</div>
          </div>
        </div>

        {/* Section 1: Menunggu Verifikasi LPJ (Priority for Verifikator) */}
        <Card
          title={`1. Menunggu Verifikasi Berkas LPJ (${waitingVerifyLpj.length})`}
          subtitle="LPJ telah diunggah oleh mahasiswa dan sedang menunggu pemeriksaan & pengesahan bukti pengeluaran oleh Verifikator"
        >
          {waitingVerifyLpj.length === 0 ? (
            <div className="py-8 text-center text-zinc-400 text-xs">
              Tidak ada berkas LPJ yang sedang mengantre untuk diverifikasi saat ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider font-medium text-[11px]">
                    <th className="py-2.5 px-3">Kode</th>
                    <th className="py-2.5 px-3">Nama Kegiatan & Ormawa</th>
                    <th className="py-2.5 px-3">Berkas LPJ Terunggah</th>
                    <th className="py-2.5 px-3">Catatan Mahasiswa</th>
                    <th className="py-2.5 px-3">Status Verifikasi</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {waitingVerifyLpj.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                        {app.id}
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {app.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {app.organization_name} · Pengusul: {app.applicant_name}
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-mono text-zinc-800 dark:text-zinc-200 font-medium">
                          📄 {app.lpj?.file_name}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {((app.lpj?.file_size || 0) / 1024).toFixed(0)} KB
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <p className="text-zinc-600 dark:text-zinc-300 italic truncate text-[11px]">
                          &ldquo;{app.lpj?.notes || 'Tidak ada catatan khusus.'}&rdquo;
                        </p>
                        {app.lpj?.verification_notes && (
                          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                            Revisi sebelumnya: {app.lpj.verification_notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Menunggu Verifikasi
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {isVerifikator ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setActiveVerifyApp(app);
                                setVerifyAction('approved');
                                setVerifyNotes('');
                              }}
                            >
                              Periksa & Verifikasi LPJ →
                            </Button>
                          ) : (
                            <Link href={`/dashboard/pengajuan/${app.id}`}>
                              <Button variant="outline" size="sm">
                                Detail Usulan
                              </Button>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Section 2: Menunggu Pengumpulan LPJ */}
        <Card
          title={`2. Menunggu Pengumpulan LPJ (${waitingUploadLpj.length})`}
          subtitle="Kegiatan yang telah disetujui pendanaannya dan mahasiswa perlu mengunggah berkas LPJ"
        >
          {waitingUploadLpj.length === 0 ? (
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
                    <th className="py-2.5 px-3">Target Tanggal</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {waitingUploadLpj.map((app) => (
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
                        <div className="flex items-center justify-end gap-2">
                          {currentUser.role === 'mahasiswa' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setActiveUploadId(app.id);
                                setUploadedFile(null);
                                setNotes('');
                              }}
                            >
                              Unggah LPJ
                            </Button>
                          )}
                          <Link href={`/dashboard/pengajuan/${app.id}`}>
                            <Button variant="outline" size="sm">
                              Detail
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Section 3: Completed / Verified Archive */}
        <Card
          title={`3. Arsip LPJ Disahkan (${completedLpj.length})`}
          subtitle="Rekapitulasi berkas pertanggungjawaban yang telah selesai dan diverifikasi sah oleh pihak kemahasiswaan"
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
                    <th className="py-2.5 px-3">Diverifikasi Oleh</th>
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
                        📄 {app.lpj?.file_name || 'LPJ_Lengkap.pdf'}
                      </td>
                      <td className="py-3 px-3 text-zinc-500 text-[11px]">
                        {app.lpj?.verified_by || 'Verifikator Kemahasiswaan'}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <Badge status="completed" />
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <Link href={`/dashboard/pengajuan/${app.id}`}>
                          <Button variant="outline" size="sm">
                            Detail Usulan
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

        {/* Modal: Upload LPJ (Mahasiswa) */}
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

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-[11px]">
              ℹ️ Berkas LPJ yang diunggah akan masuk ke antrean verifikasi untuk ditelaah keabsahan kuitansi dan kesesuaian anggaran oleh Verifikator Kemahasiswaan sebelum status usulan dituntaskan.
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
                Kirim LPJ untuk Diverifikasi
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Verifikasi LPJ (Verifikator) */}
        <Modal
          isOpen={!!activeVerifyApp}
          onClose={() => setActiveVerifyApp(null)}
          title={`Verifikasi LPJ: ${activeVerifyApp?.id}`}
        >
          {activeVerifyApp && (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-1.5">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                  {activeVerifyApp.title}
                </div>
                <div className="text-zinc-500 text-[11px]">
                  Ormawa: <strong>{activeVerifyApp.organization_name}</strong> · Pengusul: {activeVerifyApp.applicant_name}
                </div>
                <div className="text-zinc-500 text-[11px]">
                  Alokasi Dana: <strong className="text-zinc-800 dark:text-zinc-200 font-mono">Rp {Number(activeVerifyApp.amount_requested).toLocaleString('id-ID')}</strong>
                </div>
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300 font-medium">
                    📄 {activeVerifyApp.lpj?.file_name} ({((activeVerifyApp.lpj?.file_size || 0) / 1024).toFixed(0)} KB)
                  </div>
                  <Button variant="outline" size="sm">
                    Unduh Berkas ↗
                  </Button>
                </div>
                {activeVerifyApp.lpj?.notes && (
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 italic pt-1">
                    &ldquo;{activeVerifyApp.lpj.notes}&rdquo;
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1 text-zinc-900 dark:text-zinc-100">
                  Keputusan Pemeriksaan LPJ:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 cursor-pointer flex-1">
                    <input
                      type="radio"
                      name="verLpjAction"
                      value="approved"
                      checked={verifyAction === 'approved'}
                      onChange={() => setVerifyAction('approved')}
                    />
                    <div>
                      <div className="font-semibold text-emerald-800 dark:text-emerald-300">
                        Sahkan & Tuntaskan LPJ
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        Bukti kuitansi dan laporan pertanggungjawaban telah lengkap dan sah
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 cursor-pointer flex-1">
                    <input
                      type="radio"
                      name="verLpjAction"
                      value="revision_needed"
                      checked={verifyAction === 'revision_needed'}
                      onChange={() => setVerifyAction('revision_needed')}
                    />
                    <div>
                      <div className="font-semibold text-amber-800 dark:text-amber-300">
                        Minta Perbaikan LPJ
                      </div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-400">
                        Terdapat kekurangan nota/kuitansi atau selisih pembukuan
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-zinc-900 dark:text-zinc-100">
                  Catatan Pemeriksa LPJ:
                </label>
                <textarea
                  rows={3}
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder={
                    verifyAction === 'approved'
                      ? 'LPJ telah diperiksa dan dinyatakan tuntas sesuai rekapitulasi anggaran...'
                      : 'Tuliskan poin kekurangan kuitansi atau revisi yang harus dilengkapi mahasiswa...'
                  }
                  className="w-full text-xs p-2.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setActiveVerifyApp(null)}>
                  Batal
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConfirmVerifyLPJ}
                  className={verifyAction === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'}
                >
                  {verifyAction === 'approved' ? 'Sahkan & Selesaikan Usulan' : 'Kirim Catatan Revisi'}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}

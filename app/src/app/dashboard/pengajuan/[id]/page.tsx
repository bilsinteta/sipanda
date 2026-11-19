'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FileUpload } from '@/components/ui/FileUpload';
import { useAppState } from '@/lib/app-state';
import { DocumentItem } from '@/lib/types';
import { EMISSION_FACTORS } from '@/lib/emission-data';

export default function DetailPengajuanPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const {
    applications,
    currentUser,
    verifyApplication,
    approveApplication,
    submitLPJ,
    verifyLPJ,
    resubmitRevision,
  } = useAppState();

  const app = applications.find((a) => a.id === id);

  // Modal states
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyAction, setVerifyAction] = useState<'approved' | 'revision_needed'>('approved');
  const [verifyNotes, setVerifyNotes] = useState('');

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approveAction, setApproveAction] = useState<'approved' | 'rejected'>('approved');
  const [approveNotes, setApproveNotes] = useState('');

  const [lpjModalOpen, setLpjModalOpen] = useState(false);
  const [lpjFileName, setLpjFileName] = useState('Laporan_Pertanggungjawaban_Final.pdf');
  const [lpjNotes, setLpjNotes] = useState('');

  // Modal: LPJ Verification State (Verifikator)
  const [verifyLpjModalOpen, setVerifyLpjModalOpen] = useState(false);
  const [verifyLpjAction, setVerifyLpjAction] = useState<'approved' | 'revision_needed'>('approved');
  const [verifyLpjNotes, setVerifyLpjNotes] = useState('');

  // Modal: Revision State for Mahasiswa
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revTitle, setRevTitle] = useState('');
  const [revCategory, setRevCategory] = useState('Kompetisi & Lomba');
  const [revAmount, setRevAmount] = useState(0);
  const [revDate, setRevDate] = useState('');
  const [revDescription, setRevDescription] = useState('');
  const [revSheets, setRevSheets] = useState(20);
  const [revNotes, setRevNotes] = useState('');
  const [revFile, setRevFile] = useState<File | null>(null);
  const [revSuccessToast, setRevSuccessToast] = useState(false);

  if (!app) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
            Pengajuan Tidak Ditemukan
          </h2>
          <p className="text-xs text-zinc-500 mt-2">
            Kode usulan: <span className="font-mono">{id}</span> tidak terdaftar dalam sistem.
          </p>
          <Link href="/dashboard/pengajuan" className="mt-4 inline-block">
            <Button variant="primary">Kembali ke Daftar Pengajuan</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Handle actions
  const handleConfirmVerification = () => {
    verifyApplication(app.id, verifyAction, verifyNotes);
    setVerifyModalOpen(false);
    setVerifyNotes('');
  };

  const handleConfirmApproval = () => {
    approveApplication(app.id, approveAction, approveNotes);
    setApproveModalOpen(false);
    setApproveNotes('');
  };

  const handleConfirmLPJ = () => {
    submitLPJ(app.id, lpjFileName, 2400000, lpjNotes);
    setLpjModalOpen(false);
    setLpjNotes('');
  };

  const handleConfirmVerifyLPJ = () => {
    verifyLPJ(app.id, verifyLpjAction, verifyLpjNotes);
    setVerifyLpjModalOpen(false);
    setVerifyLpjNotes('');
  };

  const handleOpenRevisionModal = () => {
    setRevTitle(app.title);
    setRevCategory(app.activity_category);
    setRevAmount(app.amount_requested);
    setRevDate(app.target_date);
    setRevDescription(app.description);
    setRevSheets(app.estimated_paper_sheets || 20);
    setRevNotes('');
    setRevFile(null);
    setRevisionModalOpen(true);
  };

  const handleConfirmRevision = () => {
    const newDocs: DocumentItem[] = revFile
      ? [
          ...(app.documents || []),
          {
            id: `doc-rev-${Date.now()}`,
            application_id: app.id,
            file_name: revFile.name,
            file_size: revFile.size,
            file_type: revFile.type || 'application/pdf',
            document_type: 'revisi' as const,
            uploaded_by: currentUser.full_name,
            uploaded_at: new Date().toISOString(),
          },
        ]
      : app.documents;

    resubmitRevision(
      app.id,
      {
        title: revTitle,
        activity_category: revCategory as any,
        amount_requested: Number(revAmount),
        target_date: revDate,
        description: revDescription,
        estimated_paper_sheets: Number(revSheets),
        documents: newDocs,
      },
      revNotes || 'Berkas perbaikan telah disesuaikan dan diajukan kembali untuk verifikasi.'
    );
    setRevisionModalOpen(false);
    setRevSuccessToast(true);
    setTimeout(() => setRevSuccessToast(false), 6000);
  };

  const latestVerification = app.verifications?.[app.verifications.length - 1];

  // Timeline step definitions
  const steps = [
    { key: 'submitted', label: '1. Pengajuan Usulan', done: true },
    {
      key: 'verified',
      label: '2. Verifikasi Berkas',
      done: ['verified', 'approved', 'completed'].includes(app.status),
      active: app.status === 'submitted',
      error: app.status === 'revision_needed',
    },
    {
      key: 'approved',
      label: '3. Persetujuan Pimpinan',
      done: ['approved', 'completed'].includes(app.status),
      active: app.status === 'verified',
      error: app.status === 'rejected',
    },
    {
      key: 'completed',
      label: '4. LPJ & Arsip Digital',
      done: app.status === 'completed',
      active: app.status === 'approved',
    },
  ];

  const sheets = app.estimated_paper_sheets || 20;
  const paperEmissionKg = (sheets * EMISSION_FACTORS.paperProductionGramCO2PerSheet) / 1000;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/pengajuan"
            className="text-xs text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 font-medium"
          >
            ← Kembali ke Daftar Pengajuan
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Status Terkini:</span>
            <Badge status={app.status} />
          </div>
        </div>

        {/* Success Toast after Resubmission */}
        {revSuccessToast && (
          <div className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">✓</span>
              <span><strong>Berhasil Diajukan Ulang:</strong> Revisi usulan telah dikirim kembali ke antrean Verifikator Administrasi untuk pemeriksaan ulang.</span>
            </div>
            <button onClick={() => setRevSuccessToast(false)} className="text-emerald-600 hover:text-emerald-900 dark:hover:text-emerald-100 font-bold ml-2">✕</button>
          </div>
        )}

        {/* Prominent Revision Alert Banner when Status is revision_needed */}
        {app.status === 'revision_needed' && (
          <div className="p-4 sm:p-5 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50/80 dark:bg-amber-950/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                  Status: Memerlukan Revisi Berkas (Bukan Ditolak)
                </h3>
              </div>
              {currentUser.role === 'mahasiswa' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenRevisionModal}
                  className="bg-amber-600 hover:bg-amber-700 text-white border-amber-700 font-semibold shrink-0"
                >
                  ✏️ Edit & Ajukan Ulang Usulan
                </Button>
              )}
            </div>

            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              Verifikator telah memeriksa proposal Anda dan meminta perbaikan berkas. Anda <strong>tidak perlu membuat usulan baru</strong> dari nol. Silakan klik tombol <strong>&quot;Edit & Ajukan Ulang Usulan&quot;</strong> untuk memperbaiki rincian usulan atau mengunggah berkas revisi, lalu kirim kembali ke verifikator.
            </p>

            {latestVerification?.notes && (
              <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800 text-xs">
                <span className="font-semibold text-amber-800 dark:text-amber-400">
                  Catatan dari Verifikator ({latestVerification.verifier_name}):
                </span>
                <p className="text-zinc-800 dark:text-zinc-200 mt-1 italic leading-relaxed">
                  &ldquo;{latestVerification.notes}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Banner: LPJ Menunggu Verifikasi */}
        {app.status === 'approved' && app.lpj && !app.lpj.is_verified && (
          <div className="p-4 sm:p-5 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50/80 dark:bg-amber-950/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                  Status: Berkas LPJ Menunggu Verifikasi Administrasi
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {(currentUser.role === 'verifikator' || currentUser.role === 'admin') && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setVerifyLpjAction('approved');
                      setVerifyLpjNotes('');
                      setVerifyLpjModalOpen(true);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold shrink-0"
                  >
                    Periksa & Verifikasi LPJ →
                  </Button>
                )}
                {currentUser.role === 'mahasiswa' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLpjModalOpen(true)}
                    className="shrink-0"
                  >
                    Unggah Ulang LPJ
                  </Button>
                )}
              </div>
            </div>

            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              Mahasiswa telah mengunggah berkas LPJ <strong>{app.lpj.file_name}</strong>. Saat ini pihak verifikator kemahasiswaan sedang memeriksa keabsahan bukti pengeluaran dan kuitansi sebelum status usulan dituntaskan.
            </p>

            {app.lpj.verification_notes && (
              <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800 text-xs">
                <span className="font-semibold text-amber-800 dark:text-amber-400">
                  Catatan Revisi LPJ Terakhir:
                </span>
                <p className="text-zinc-800 dark:text-zinc-200 mt-1 italic leading-relaxed">
                  &ldquo;{app.lpj.verification_notes}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Main Header Card */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                  {app.id}
                </span>
                <span className="text-xs text-zinc-400">·</span>
                <span className="text-xs text-zinc-500 font-medium">
                  {app.activity_category}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
                {app.title}
              </h1>
              <p className="text-xs text-zinc-500 mt-2">
                Diajukan oleh <strong className="text-zinc-800 dark:text-zinc-200">{app.applicant_name}</strong> ({app.applicant_nim || '-'}) ·{' '}
                <strong className="text-zinc-800 dark:text-zinc-200">{app.organization_name}</strong> · Tanggal: {app.target_date}
              </p>
            </div>

            <div className="text-right flex flex-col md:items-end justify-between">
              <div>
                <div className="text-xs text-zinc-400">Nominal Usulan Dana</div>
                <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  Rp {Number(app.amount_requested).toLocaleString('id-ID')}
                </div>
              </div>

              {/* Action buttons based on Role and Status */}
              <div className="mt-4 flex flex-wrap gap-2">
                {currentUser.role === 'mahasiswa' && app.status === 'revision_needed' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleOpenRevisionModal}
                    className="bg-amber-600 hover:bg-amber-700 text-white border-amber-700 font-semibold"
                  >
                    ✏️ Perbaiki & Ajukan Ulang →
                  </Button>
                )}

                {currentUser.role === 'verifikator' && app.status === 'submitted' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setVerifyAction('approved');
                      setVerifyModalOpen(true);
                    }}
                  >
                    Verifikasi Administrasi →
                  </Button>
                )}

                {currentUser.role === 'approver' && app.status === 'verified' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setApproveAction('approved');
                      setApproveModalOpen(true);
                    }}
                  >
                    Putuskan Persetujuan →
                  </Button>
                )}

                {currentUser.role === 'mahasiswa' && app.status === 'approved' && !app.lpj && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setLpjModalOpen(true)}
                  >
                    Unggah Berkas LPJ →
                  </Button>
                )}

                {(currentUser.role === 'verifikator' || currentUser.role === 'admin') &&
                  app.status === 'approved' &&
                  app.lpj &&
                  !app.lpj.is_verified && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setVerifyLpjAction('approved');
                        setVerifyLpjNotes('');
                        setVerifyLpjModalOpen(true);
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Periksa & Verifikasi LPJ →
                    </Button>
                  )}
              </div>
            </div>
          </div>
        </Card>

        {/* Workflow Progress Timeline */}
        <Card title="Alur Pengajuan & Tahapan Administrasi">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs pt-1">
            {steps.map((st) => (
              <div
                key={st.key}
                className={`p-3 rounded-lg border transition-all ${
                  st.done
                    ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : st.active
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/40'
                    : st.error
                    ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20'
                    : 'border-zinc-200 dark:border-zinc-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {st.label}
                  </span>
                  <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{
                    backgroundColor: st.done ? '#10b981' : st.active ? '#3b82f6' : st.error ? '#f43f5e' : '#a1a1aa'
                  }} />
                </div>
                <div className="text-[11px] text-zinc-400">
                  {st.done
                    ? 'Selesai'
                    : st.active
                    ? 'Tahap berjalan'
                    : st.error
                    ? 'Perlu revisi'
                    : 'Menunggu'}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Two Columns: Details & Documents vs Review Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Details & Documents */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Deskripsi & Sasaran Usulan">
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {app.description || 'Tidak ada deskripsi rinci.'}
              </p>
            </Card>

            <Card title="Dokumen Berkas Terunggah (Digital Archive)">
              <div className="space-y-2">
                {app.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📄</span>
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-white">
                          {doc.file_name}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {((doc.file_size || 0) / 1024).toFixed(0)} KB • Tipe:{' '}
                          <span className="uppercase font-mono">{doc.document_type}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Unduh Berkas ↗
                    </Button>
                  </div>
                ))}

                {app.lpj && (
                  <div
                    className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                      app.lpj.is_verified
                        ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📑</span>
                      <div>
                        <div
                          className={`font-semibold ${
                            app.lpj.is_verified
                              ? 'text-emerald-900 dark:text-emerald-200'
                              : 'text-amber-900 dark:text-amber-200'
                          }`}
                        >
                          {app.lpj.file_name} (Laporan Pertanggungjawaban)
                        </div>
                        <div
                          className={`text-[11px] ${
                            app.lpj.is_verified
                              ? 'text-emerald-700/80 dark:text-emerald-300/80'
                              : 'text-amber-700/80 dark:text-amber-300/80'
                          }`}
                        >
                          {((app.lpj.file_size || 0) / 1024).toFixed(0)} KB • Status:{' '}
                          {app.lpj.is_verified ? (
                            <strong className="text-emerald-700 dark:text-emerald-400">
                              Disahkan ({app.lpj.verified_by || 'Verifikator'})
                            </strong>
                          ) : (
                            <strong className="text-amber-700 dark:text-amber-400">
                              Menunggu Verifikasi Administrasi
                            </strong>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Buka LPJ ↗
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Green Impact & Verification Notes */}
          <div className="space-y-6">
            {/* Eco Impact Box */}
            <Card title="🌿 Jejak Emisi Proposal Ini">
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                  <div className="font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                    Kertas Fisik Terhindar
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                    {sheets} lembar A4
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                    Mencegah <strong>{paperEmissionKg.toFixed(2)} kg CO₂</strong> dari proses produksi kertas.
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                    Jejak Operasional Digital
                  </div>
                  <div className="text-base font-bold text-zinc-700 dark:text-zinc-300">
                    ~0,00037 kg CO₂e
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    Berdasarkan model energi SWDM v4 untuk siklus akses formulir dan dokumen.
                  </div>
                </div>
              </div>
            </Card>

            {/* Verification / Approval Logs */}
            <Card title="Riwayat Keputusan & Catatan">
              <div className="space-y-3 text-xs">
                {app.verifications.length === 0 && app.approvals.length === 0 ? (
                  <p className="text-zinc-400 italic">Belum ada catatan verifikasi atau persetujuan.</p>
                ) : (
                  <>
                    {app.verifications.map((v) => (
                      <div
                        key={v.id}
                        className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30"
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-zinc-800 dark:text-zinc-200">
                            {v.verifier_name}
                          </span>
                          <span
                            className={
                              v.action === 'approved'
                                ? 'text-emerald-600 font-bold'
                                : 'text-amber-600 font-bold'
                            }
                          >
                            {v.action === 'approved' ? 'Lolos Administrasi' : 'Perlu Revisi'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                          &quot;{v.notes}&quot;
                        </p>
                      </div>
                    ))}

                    {app.approvals.map((ap) => (
                      <div
                        key={ap.id}
                        className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20"
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-emerald-900 dark:text-emerald-200">
                            {ap.approver_name}
                          </span>
                          <span
                            className={
                              ap.action === 'approved'
                                ? 'text-emerald-600 font-bold'
                                : 'text-rose-600 font-bold'
                            }
                          >
                            {ap.action === 'approved' ? 'Dana Disetujui' : 'Ditolak'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                          &quot;{ap.notes}&quot;
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Modal: Verifikator Review */}
        <Modal
          isOpen={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          title="Verifikasi Administrasi Proposal"
        >
          <div className="space-y-4 text-xs">
            <p className="text-zinc-600 dark:text-zinc-400">
              Periksa kelengkapan proposal, rincian anggaran (RAB), dan lembar pengesahan kegiatan mahasiswa.
            </p>

            <div>
              <label className="block font-semibold mb-1">Keputusan Verifikasi:</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="verAction"
                    value="approved"
                    checked={verifyAction === 'approved'}
                    onChange={() => setVerifyAction('approved')}
                  />
                  <span className="font-semibold text-emerald-600">Lolos Administrasi</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="verAction"
                    value="revision_needed"
                    checked={verifyAction === 'revision_needed'}
                    onChange={() => setVerifyAction('revision_needed')}
                  />
                  <span className="font-semibold text-amber-600">Minta Revisi Berkas</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Catatan / Arahan Verifikator:</label>
              <textarea
                rows={3}
                required
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                placeholder="Berikan catatan perbaikan atau konfirmasi kelengkapan berkas..."
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setVerifyModalOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmVerification}>
                Simpan Keputusan Verifikasi
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Approver Review */}
        <Modal
          isOpen={approveModalOpen}
          onClose={() => setApproveModalOpen(false)}
          title="Persetujuan Alokasi Dana (Wadek III)"
        >
          <div className="space-y-4 text-xs">
            <p className="text-zinc-600 dark:text-zinc-400">
              Pengusul meminta dana sebesar{' '}
              <strong className="text-emerald-600">
                Rp {Number(app.amount_requested).toLocaleString('id-ID')}
              </strong>
              . Putuskan persetujuan resmi pimpinan fakultas.
            </p>

            <div>
              <label className="block font-semibold mb-1">Keputusan Pendanaan:</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="appAction"
                    value="approved"
                    checked={approveAction === 'approved'}
                    onChange={() => setApproveAction('approved')}
                  />
                  <span className="font-semibold text-emerald-600">Setujui Pendanaan</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="appAction"
                    value="rejected"
                    checked={approveAction === 'rejected'}
                    onChange={() => setApproveAction('rejected')}
                  />
                  <span className="font-semibold text-rose-600">Tolak Permohonan</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Catatan Pengesahan / SK Pendanaan:</label>
              <textarea
                rows={3}
                required
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
                placeholder="Disetujui dari DIPA FILKOM tahap I dengan ketentuan..."
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setApproveModalOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmApproval}>
                Konfirmasi Keputusan Pimpinan
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: LPJ Submission */}
        <Modal
          isOpen={lpjModalOpen}
          onClose={() => setLpjModalOpen(false)}
          title="Unggah Laporan Pertanggungjawaban (LPJ)"
        >
          <div className="space-y-4 text-xs">
            <p className="text-zinc-600 dark:text-zinc-400">
              Unggah berkas LPJ digital beserta bukti pengeluaran dan dokumentasi kegiatan.
            </p>

            <div>
              <label className="block font-semibold mb-1">Nama Berkas LPJ:</label>
              <input
                type="text"
                value={lpjFileName}
                onChange={(e) => setLpjFileName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Catatan Pelaksanaan Kegiatan:</label>
              <textarea
                rows={3}
                value={lpjNotes}
                onChange={(e) => setLpjNotes(e.target.value)}
                placeholder="Rangkuman ketercapaian kegiatan dan penggunaan anggaran..."
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setLpjModalOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmLPJ}>
                Simpan & Selesaikan LPJ
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Student Revision & Resubmission */}
        <Modal
          isOpen={revisionModalOpen}
          onClose={() => setRevisionModalOpen(false)}
          title="Perbaiki & Ajukan Ulang Usulan (Revisi)"
        >
          <div className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {latestVerification?.notes && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                <div className="font-semibold text-[11px] uppercase tracking-wider mb-0.5">
                  Catatan Verifikator yang Harus Diperbaiki:
                </div>
                <p className="italic text-xs">&ldquo;{latestVerification.notes}&rdquo;</p>
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1">Judul Usulan Kegiatan:</label>
              <input
                type="text"
                required
                value={revTitle}
                onChange={(e) => setRevTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Kategori Kegiatan:</label>
                <select
                  value={revCategory}
                  onChange={(e) => setRevCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                >
                  <option value="Kompetisi & Lomba">Kompetisi & Lomba</option>
                  <option value="Seminar & Workshop">Seminar & Workshop</option>
                  <option value="Program Kerja Ormawa">Program Kerja Ormawa</option>
                  <option value="Pengabdian Masyarakat">Pengabdian Masyarakat</option>
                  <option value="Karya Inovasi & Riset">Karya Inovasi & Riset</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Tanggal Kegiatan:</label>
                <input
                  type="date"
                  required
                  value={revDate}
                  onChange={(e) => setRevDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Nominal Usulan Dana (Rp):</label>
                <input
                  type="number"
                  min={100000}
                  step={50000}
                  required
                  value={revAmount}
                  onChange={(e) => setRevAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Estimasi Lembar Kertas Pengajuan:</label>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={revSheets}
                  onChange={(e) => setRevSheets(Math.max(5, parseInt(e.target.value) || 20))}
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Deskripsi & Rincian Rencana Kegiatan:</label>
              <textarea
                rows={3}
                required
                value={revDescription}
                onChange={(e) => setRevDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Unggah Dokumen Proposal / RAB Revisi:</label>
              <FileUpload
                onFileSelect={setRevFile}
                accept=".pdf,.docx,.xlsx"
                maxSizeMB={5}
                label=""
                hint="Format: PDF/DOCX (Maks 5 MB). Lampirkan berkas yang sudah disesuaikan dengan instruksi verifikator."
              />
              {revFile && (
                <div className="mt-1.5 p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>Berkas dipilih: <strong>{revFile.name}</strong> ({(revFile.size / 1024).toFixed(1)} KB)</span>
                  <span className="font-bold text-emerald-600">Siap Dilampirkan</span>
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-amber-800 dark:text-amber-400">
                Catatan Penjelasan Revisi untuk Verifikator:
              </label>
              <textarea
                rows={2}
                required
                value={revNotes}
                onChange={(e) => setRevNotes(e.target.value)}
                placeholder="Contoh: Rincian anggaran (RAB) konsumsi dan banner telah disesuaikan dan lembar pengesahan ketua telah dilampirkan..."
                className="w-full text-xs p-2.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-zinc-800 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Button variant="outline" size="sm" onClick={() => setRevisionModalOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmRevision}>
                Kirim Revisi ke Verifikator →
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: LPJ Verification by Verifikator */}
        <Modal
          isOpen={verifyLpjModalOpen}
          onClose={() => setVerifyLpjModalOpen(false)}
          title={`Verifikasi Laporan Pertanggungjawaban (LPJ)`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-zinc-600 dark:text-zinc-400">
              Periksa keabsahan bukti pengeluaran, nota kuitansi asli, dan realisasi anggaran kegiatan{' '}
              <strong className="text-zinc-900 dark:text-zinc-100">{app.title}</strong>.
            </p>

            {app.lpj && (
              <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-1.5">
                <div className="font-mono text-zinc-900 dark:text-zinc-100 font-medium">
                  📄 {app.lpj.file_name} ({((app.lpj.file_size || 0) / 1024).toFixed(0)} KB)
                </div>
                {app.lpj.notes && (
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 italic">
                    Catatan Pengantar Mahasiswa: &ldquo;{app.lpj.notes}&rdquo;
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1">Keputusan Pemeriksaan LPJ:</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="verLpjActionDetail"
                    value="approved"
                    checked={verifyLpjAction === 'approved'}
                    onChange={() => setVerifyLpjAction('approved')}
                  />
                  <span className="font-semibold text-emerald-600">Sahkan & Tuntaskan LPJ</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="verLpjActionDetail"
                    value="revision_needed"
                    checked={verifyLpjAction === 'revision_needed'}
                    onChange={() => setVerifyLpjAction('revision_needed')}
                  />
                  <span className="font-semibold text-amber-600">Minta Perbaikan LPJ</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Catatan / Arahan Verifikator:</label>
              <textarea
                rows={3}
                required
                value={verifyLpjNotes}
                onChange={(e) => setVerifyLpjNotes(e.target.value)}
                placeholder={
                  verifyLpjAction === 'approved'
                    ? 'LPJ telah diperiksa dan dinyatakan sah serta lengkap...'
                    : 'Tuliskan rincian kuitansi atau bagian berkas LPJ yang perlu diperbaiki...'
                }
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setVerifyLpjModalOpen(false)}>
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmVerifyLPJ}
                className={verifyLpjAction === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'}
              >
                {verifyLpjAction === 'approved' ? 'Sahkan & Selesaikan Usulan' : 'Kirim Catatan Revisi'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

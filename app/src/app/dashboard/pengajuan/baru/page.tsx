'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { useAppState } from '@/lib/app-state';
import { ActivityCategory } from '@/lib/types';
import { EMISSION_FACTORS } from '@/lib/emission-data';

export default function BuatPengajuanBaruPage() {
  const router = useRouter();
  const { currentUser, addApplication } = useAppState();

  const [title, setTitle] = useState('');
  const [organizationName, setOrganizationName] = useState(
    currentUser.organization || 'Himpunan Mahasiswa FILKOM'
  );
  const [category, setCategory] = useState<ActivityCategory>('Kompetisi & Lomba');
  const [amount, setAmount] = useState<string>('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedSheets, setEstimatedSheets] = useState(20);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paperPreventedGram = estimatedSheets * EMISSION_FACTORS.paperProductionGramCO2PerSheet;
  const fileSizeMB = uploadedFile ? uploadedFile.size / (1024 * 1024) : 1.0;
  const digitalTransferKwh = (fileSizeMB / 1024) * EMISSION_FACTORS.swdmTotalEnergyKwhPerGB;
  const digitalGramCO2e = digitalTransferKwh * EMISSION_FACTORS.swdmGlobalCarbonIntensityGCO2ePerKwh;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!numericAmount || numericAmount <= 0) {
      setError('Nominal dana yang diajukan harus berupa angka lebih besar dari 0.');
      return;
    }

    if (!uploadedFile) {
      setError('Harap lampirkan berkas proposal kegiatan (PDF/DOCX).');
      return;
    }

    setLoading(true);

    const newApp = addApplication({
      title,
      organization_name: organizationName,
      activity_category: category,
      amount_requested: numericAmount,
      target_date: targetDate || new Date().toISOString().split('T')[0],
      description,
      applicant_id: currentUser.id,
      applicant_name: currentUser.full_name,
      applicant_nim: currentUser.nim || '235150401111058',
      status: 'submitted',
      estimated_paper_sheets: estimatedSheets,
      documents: [
        {
          id: `doc-${Date.now()}`,
          application_id: '',
          file_name: uploadedFile.name,
          file_size: uploadedFile.size,
          file_type: uploadedFile.type || 'application/pdf',
          document_type: 'proposal',
          uploaded_by: currentUser.id,
          uploaded_at: new Date().toISOString(),
          url: '#',
        },
      ],
    });

    setTimeout(() => {
      setLoading(false);
      router.push(`/dashboard/pengajuan/${newApp.id}`);
    }, 400);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Formulir Usulan Pendanaan Kegiatan
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Pengajuan proposal digital bebas kertas di Fakultas Ilmu Komputer Universitas Brawijaya
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-xs text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card title="1. Informasi Kegiatan">
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Judul Kegiatan / Nama Proposal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hackathon Nasional Green Tech FILKOM 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Ormawa / Lembaga Pengusul *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BEM FILKOM / KBMDSI"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Kategori Kegiatan *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                    className="w-full text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  >
                    <option value="Kompetisi & Lomba">Kompetisi & Lomba</option>
                    <option value="Seminar & Workshop">Seminar & Workshop</option>
                    <option value="Program Kerja Ormawa">Program Kerja Ormawa</option>
                    <option value="Pengabdian Masyarakat">Pengabdian Masyarakat</option>
                    <option value="Karya Inovasi & Riset">Karya Inovasi & Riset</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Nominal Dana yang Diajukan (Rp) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 8500000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 font-mono"
                  />
                  {amount && !isNaN(Number(amount)) && (
                    <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                      Rp {Number(amount).toLocaleString('id-ID')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Tanggal Pelaksanaan Acara *
                  </label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Deskripsi & Tujuan Ringkas *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan secara ringkas sasaran peserta dan output kegiatan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </div>
            </div>
          </Card>

          <Card title="2. Dokumen Proposal & Estimasi Penghematan">
            <div className="space-y-4">
              <FileUpload
                onFileSelect={(file) => setUploadedFile(file)}
                label="Unggah Berkas Proposal & RAB (PDF/DOCX)"
                hint="Maksimal 5 MB. Dioptimasi untuk transfer data hemat energi."
              />

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Estimasi Lembar Fisik Jika Dicetak:
                  </span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                    {estimatedSheets} lembar A4
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  value={estimatedSheets}
                  onChange={(e) => setEstimatedSheets(Number(e.target.value))}
                  className="w-full accent-zinc-900 dark:accent-zinc-100"
                />
              </div>

              {/* Minimal Eco Box */}
              <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Dampak Lingkungan Pengajuan Ini
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-zinc-400 text-[10px]">Kertas Terhindar</div>
                    <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {estimatedSheets} lembar
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[10px]">Emisi Dicegah</div>
                    <div className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {paperPreventedGram}g CO₂
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[10px]">Jejak Digital Transfer</div>
                    <div className="font-mono font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                      {digitalGramCO2e.toFixed(4)}g CO₂e
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
            >
              Kirimkan Usulan
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

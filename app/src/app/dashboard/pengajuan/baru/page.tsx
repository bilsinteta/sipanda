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

  // Carbon metrics preview
  const paperPreventedGram = estimatedSheets * EMISSION_FACTORS.paperProductionGramCO2PerSheet; // e.g. 20 * 34g = 680g CO2
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
      setError('Harap unggah berkas proposal kegiatan (PDF/DOCX).');
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
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Formulir Usulan Pendanaan Kegiatan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pengajuan proposal digital bebas kertas di Fakultas Ilmu Komputer Universitas Brawijaya
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card title="1. Informasi Utama Kegiatan">
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Kegiatan / Judul Proposal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hackathon Nasional Green Tech FILKOM 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Ormawa / Lembaga Pemohon *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BEM FILKOM / KBMDSI"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Kegiatan *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Kompetisi & Lomba">Kompetisi & Lomba</option>
                    <option value="Seminar & Workshop">Seminar & Workshop</option>
                    <option value="Program Kerja Ormawa">Program Kerja Ormawa</option>
                    <option value="Pengabdian Masyarakat">Pengabdian Masyarakat</option>
                    <option value="Karya Inovasi & Riset">Karya Inovasi & Riset</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah Dana yang Diajukan (Rupiah) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 8500000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    {amount && !isNaN(Number(amount)) && (
                      <span>Terbilang: Rp {Number(amount).toLocaleString('id-ID')}</span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimasi Tanggal Pelaksanaan Acara *
                  </label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi & Tujuan Kegiatan Singkat *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan secara ringkas maksud dan tujuan kegiatan, sasaran peserta, serta output yang diharapkan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </Card>

          {/* Document Upload & Green Impact Preview */}
          <Card title="2. Unggah Dokumen Proposal Digital">
            <div className="space-y-4">
              <FileUpload
                onFileSelect={(file) => setUploadedFile(file)}
                label="Unggah Berkas Proposal Lengkap & RAB"
                hint="Format: PDF diutamakan. Harap kompres berkas di bawah 5 MB untuk efisiensi jaringan."
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimasi Jumlah Lembar Fisik Jika Dicetak Secara Konvensional:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={5}
                    max={60}
                    value={estimatedSheets}
                    onChange={(e) => setEstimatedSheets(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <span className="text-xs font-bold w-20 text-right text-emerald-600 dark:text-emerald-400">
                    {estimatedSheets} lembar
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Standar rata-rata usulan fakultas adalah 20 lembar A4 (proposal + lembar pengesahan + lampiran RAB).
                </p>
              </div>

              {/* Live Eco Impact Box */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                <div className="font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                  <span>🌱</span>
                  <span>Dampak Keberlanjutan Pengajuan Digital Ini:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900">
                    <div className="text-slate-500 text-[11px]">Kertas Terhindar</div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {estimatedSheets} lembar A4
                    </div>
                    <div className="text-[10px] text-emerald-600">Hemat ~Rp {(estimatedSheets * 500).toLocaleString('id-ID')}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900">
                    <div className="text-slate-500 text-[11px]">Emisi Kertas Dicegah</div>
                    <div className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      {paperPreventedGram} gram CO₂
                    </div>
                    <div className="text-[10px] text-slate-400">(Faktor: 34g CO₂/lembar)</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900">
                    <div className="text-slate-500 text-[11px]">Jejak Digital Transfer</div>
                    <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                      {digitalGramCO2e.toFixed(4)} g CO₂e
                    </div>
                    <div className="text-[10px] text-slate-400">SWDM v4 operasional</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              size="lg"
            >
              Kirimkan Pengajuan Usulan
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}


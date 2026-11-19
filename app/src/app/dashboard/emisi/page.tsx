'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CarbonBadge } from '@/components/ui/CarbonBadge';
import {
  EMISSION_FACTORS,
  DEFAULT_SIMULATION_INPUTS,
  MONTHLY_DISTRIBUTION_SIMULATION,
  PAGE_TRANSFER_BENCHMARKS,
  calculateSipandaEmissions,
} from '@/lib/emission-data';

export default function KalkulatorEmisiPage() {
  const [appsPerYear, setAppsPerYear] = useState<number>(
    DEFAULT_SIMULATION_INPUTS.applicationsPerYear
  );
  const [sheetsPerApp, setSheetsPerApp] = useState<number>(
    DEFAULT_SIMULATION_INPUTS.sheetsPerApplication
  );
  const [printerKwh, setPrinterKwh] = useState<number>(
    DEFAULT_SIMULATION_INPUTS.annualPrinterElectricityKwh
  );
  const [accessPerApp, setAccessPerApp] = useState<number>(
    DEFAULT_SIMULATION_INPUTS.digitalAccessCyclesPerApplication
  );
  const [mbPerAccess, setMbPerAccess] = useState<number>(
    DEFAULT_SIMULATION_INPUTS.dataTransferMBPerAccess
  );

  const resetToDefault = () => {
    setAppsPerYear(DEFAULT_SIMULATION_INPUTS.applicationsPerYear);
    setSheetsPerApp(DEFAULT_SIMULATION_INPUTS.sheetsPerApplication);
    setPrinterKwh(DEFAULT_SIMULATION_INPUTS.annualPrinterElectricityKwh);
    setAccessPerApp(DEFAULT_SIMULATION_INPUTS.digitalAccessCyclesPerApplication);
    setMbPerAccess(DEFAULT_SIMULATION_INPUTS.dataTransferMBPerAccess);
  };

  const results = calculateSipandaEmissions(
    appsPerYear,
    sheetsPerApp,
    printerKwh,
    accessPerApp,
    mbPerAccess
  );

  // Scaled monthly distribution
  const ratio = appsPerYear / 100;
  const scaledMonthly = MONTHLY_DISTRIBUTION_SIMULATION.map((m) => {
    const monthApps = Math.round(m.applications * ratio);
    const monthSheets = monthApps * sheetsPerApp;
    const monthPaperKg = Number(
      ((monthSheets * EMISSION_FACTORS.paperProductionGramCO2PerSheet) / 1000).toFixed(2)
    );
    const monthTransferGB = Number(
      ((monthApps * accessPerApp * mbPerAccess) / 1024).toFixed(4)
    );
    const monthDigitalKg = Number(
      (
        (monthTransferGB *
          EMISSION_FACTORS.swdmTotalEnergyKwhPerGB *
          EMISSION_FACTORS.swdmGlobalCarbonIntensityGCO2ePerKwh) /
        1000
      ).toFixed(4)
    );

    return {
      month: m.month,
      applications: monthApps,
      sheets: monthSheets,
      paperKg: monthPaperKg,
      transferGB: monthTransferGB,
      digitalKg: monthDigitalKg,
    };
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Kalkulator Estimasi Jejak Karbon (CO₂e)
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Model komparasi matematis antara proses administrasi fisik konvensional dan operasional digital SWDM v4
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CarbonBadge gramsCO2={0.02} cleanerThanPercent={96} />
            <Button variant="outline" size="sm" onClick={resetToDefault}>
              Reset Default
            </Button>
          </div>
        </div>

        {/* Methodological Warning Alert from PRD & Spreadsheet */}
        <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">
          <div>
            <strong className="block font-semibold mb-1 text-zinc-900 dark:text-zinc-100">
              Catatan Metodologis (GHG Protocol & PRD Bab 2.3):
            </strong>
            <p className="leading-relaxed text-zinc-500 dark:text-zinc-400">
              Emisi produksi kertas (<strong>kg CO₂</strong>) dan emisi operasional listrik/digital (<strong>kg CO₂e</strong>) memiliki cakupan gas dan batas sistem yang berbeda.
              Perhitungan ini merupakan estimasi berbasis asumsi kerja simulasi. Angka selisih persentase disajikan sebagai ilustrasi komparatif numerik, bukan klaim reduksi mutlak sebelum batas sistem diseragamkan.
            </p>
          </div>
        </div>

        {/* Interactive Parameter Controls */}
        <Card
          title="1. Parameter Input Skenario (Dapat Disesuaikan)"
          subtitle="Ubah nilai variabel di bawah untuk melihat kalkulasi emisi secara real-time"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* Input 1: Apps / year */}
            <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Jumlah Pengajuan per Tahun:
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={appsPerYear}
                  onChange={(e) => setAppsPerYear(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white"
                />
                <span className="text-zinc-500">pengajuan/tahun</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">Default simulasi: 100 pengajuan FILKOM</p>
            </div>

            {/* Input 2: Sheets / app */}
            <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Lembar Kertas per Pengajuan:
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={sheetsPerApp}
                  onChange={(e) => setSheetsPerApp(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white"
                />
                <span className="text-zinc-500">lembar A4/usulan</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">Proposal, RAB, & lembar pengesahan (default: 20)</p>
            </div>

            {/* Input 3: Printer Electricity */}
            <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Konsumsi Listrik Printer:
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  step="0.1"
                  min={0.1}
                  max={50}
                  value={printerKwh}
                  onChange={(e) => setPrinterKwh(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-24 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white"
                />
                <span className="text-zinc-500">kWh/tahun</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">Faktor Jamali: 1,06 kg CO₂e/kWh (Nugroho 2022)</p>
            </div>

            {/* Input 4: Digital Access / app */}
            <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Siklus Akses Digital per Usulan:
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={accessPerApp}
                  onChange={(e) => setAccessPerApp(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white"
                />
                <span className="text-zinc-500">siklus akses</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">Ajukan, verifikasi, keputusan, & LPJ (default: 4)</p>
            </div>

            {/* Input 5: Data Transfer / access */}
            <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Transfer Data per Akses (MB):
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  step="0.5"
                  min={0.5}
                  max={50}
                  value={mbPerAccess}
                  onChange={(e) => setMbPerAccess(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  className="w-24 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white"
                />
                <span className="text-zinc-500">MB/siklus</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">Hasil ukur DevTools Network (default: 4 MB)</p>
            </div>

            {/* Quick Summary Box */}
            <div className="p-3.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 flex flex-col justify-between">
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-300">Total Kertas Diganti:</span>
                <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                  {results.conventional.totalSheets.toLocaleString('id-ID')} Lembar
                </div>
              </div>
              <div className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-2">
                Penghematan cetak: ~Rp {results.conventional.totalCostSavedIdr.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </Card>

        {/* Comparison Result Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skenario Konvensional */}
          <Card title="Skenario Konvensional (Sebelum SIPANDA)">
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <div className="text-zinc-500 text-[11px] font-semibold uppercase">
                  1. Emisi Produksi Kertas A4
                </div>
                <div className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
                  {results.conventional.paperEmissionKg} <span className="text-base font-normal text-zinc-500">kg CO₂/tahun</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-2 font-mono bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                  Rumus: {results.conventional.totalSheets} lembar × 34 g CO₂/lembar ÷ 1.000 = {results.conventional.paperEmissionKg} kg CO₂
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Referensi: Ekin & Elitok (2024), Global Energy.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <div className="text-zinc-500 text-[11px] font-semibold uppercase">
                  2. Emisi Listrik Printer
                </div>
                <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                  {results.conventional.printerEmissionKg} <span className="text-base font-normal text-zinc-500">kg CO₂e/tahun</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-2 font-mono bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                  Rumus: {results.conventional.printerElectricityKwh} kWh × 1,06 kg CO₂e/kWh = {results.conventional.printerEmissionKg} kg CO₂e
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Referensi: Nugroho dkk. (2022), Studi LCA Jaringan Jamali.
                </p>
              </div>
            </div>
          </Card>

          {/* Skenario Digital SIPANDA */}
          <Card title="Skenario Digital SIPANDA (Setelah Implementasi)">
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold uppercase">
                  Operasional Aplikasi Web (SWDM v4)
                </div>
                <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                  {results.digital.emissionKg} <span className="text-base font-normal text-zinc-500">kg CO₂e/tahun</span>
                </div>
                <div className="text-[11px] text-zinc-700 dark:text-zinc-300 mt-2 font-mono bg-white dark:bg-zinc-900 p-2 rounded border border-emerald-200 dark:border-emerald-800">
                  Transfer Data: {results.digital.totalTransferGB} GB • Energi: {results.digital.energyKwh} kWh
                </div>
                <div className="text-[11px] text-zinc-500 mt-2 space-y-1">
                  <p>• Data Center (0,055) + Network (0,059) + Device (0,080) = <strong>0,194 kWh/GB</strong></p>
                  <p>• Intensitas Karbon Global SWDM: <strong>494 g CO₂e/kWh</strong></p>
                  <p>• Emisi per satu siklus akses: <strong>{results.digital.emissionPerAccessKg.toFixed(6)} kg CO₂e</strong></p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-700 dark:text-zinc-300">Selisih Numerik Emisi Kertas vs Digital:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">
                    {results.comparison.differencePercentage}%
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed mt-1">
                  Jika emisi produksi kertas ({results.conventional.paperEmissionKg} kg CO₂) dibandingkan langsung terhadap operasional digital ({results.digital.emissionKg} kg CO₂e), terdapat selisih sekitar 99,8%.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Monthly Projection Table (Replicating Sheet 'Proyeksi Bulanan') */}
        <Card
          title="2. Proyeksi Distribusi Emisi Bulanan"
          subtitle="Distribusi beban administrasi pengajuan dan kalkulasi emisi dari Januari hingga Desember (Sheet Proyeksi Bulanan)"
        >
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Bulan</th>
                  <th className="py-2.5 px-3">Pengajuan</th>
                  <th className="py-2.5 px-3">Lembar Kertas</th>
                  <th className="py-2.5 px-3">Emisi Kertas (kg CO₂)</th>
                  <th className="py-2.5 px-3">Transfer Data (GB)</th>
                  <th className="py-2.5 px-3 text-right">Emisi Digital (kg CO₂e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {scaledMonthly.map((m) => (
                  <tr key={m.month} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-2.5 px-3 font-semibold text-zinc-800 dark:text-zinc-200">
                      {m.month}
                    </td>
                    <td className="py-2.5 px-3">{m.applications} usulan</td>
                    <td className="py-2.5 px-3">{m.sheets} lembar</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-900 dark:text-white">
                      {m.paperKg}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-600 dark:text-zinc-400">
                      {m.transferGB}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {m.digitalKg}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-zinc-300 dark:border-zinc-700 font-bold bg-zinc-50/60 dark:bg-zinc-800/40">
                  <td className="py-3 px-3">TOTAL TAHUNAN</td>
                  <td className="py-3 px-3">{appsPerYear} pengajuan</td>
                  <td className="py-3 px-3">{results.conventional.totalSheets.toLocaleString('id-ID')} lembar</td>
                  <td className="py-3 px-3 font-mono text-zinc-900 dark:text-white">
                    {results.conventional.paperEmissionKg} kg CO₂
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-600 dark:text-zinc-400">
                    {results.digital.totalTransferGB} GB
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                    {results.digital.emissionKg} kg CO₂e
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* Data Transfer Benchmark Table (Replicating Sheet 'Pengukuran Data') */}
        <Card
          title="3. Hasil Pengukuran Transfer Data per Halaman"
          subtitle="Hasil pencatatan ukuran transfer jaringan saat pengguna mengakses setiap antarmuka (Sheet Pengukuran Data)"
        >
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Halaman / Aktivitas</th>
                  <th className="py-2.5 px-3">Rata-rata Transfer Data</th>
                  <th className="py-2.5 px-3">Catatan Karakteristik Beban</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {PAGE_TRANSFER_BENCHMARKS.map((p) => (
                  <tr key={p.page} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-2.5 px-3 font-semibold text-zinc-800 dark:text-zinc-200">
                      {p.page}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {p.transferMB} MB
                    </td>
                    <td className="py-2.5 px-3 text-zinc-500">
                      {p.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-zinc-200 dark:border-zinc-800 font-bold">
                  <td className="py-3 px-3">Total Transfer Satu Siklus Penuh:</td>
                  <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                    4,0 MB
                  </td>
                  <td className="py-3 px-3 text-zinc-500">
                    Siklus lengkap: Login → Pengajuan → Verifikasi → Persetujuan → LPJ
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* External Audit & Website Carbon Integration */}
        <Card
          title="4. Hasil Audit Empiris Website Carbon (Terverifikasi)"
          subtitle="Bukti pengujian independen terhadap intensitas karbon dan efisiensi halaman live SIPANDA"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800">
                    Sertifikasi Rating A+
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    sipanda-filkom.vercel.app
                  </span>
                </div>
                <div className="text-zinc-500 space-y-0.5 mt-2">
                  <p>• Emisi riil terukur: <strong className="text-zinc-900 dark:text-zinc-100 font-mono">0,02 gram CO₂ per kunjungan</strong></p>
                  <p>• Tolok ukur global: <strong className="text-emerald-700 dark:text-emerald-400">Lebih bersih dari 96% seluruh website di dunia</strong></p>
                  <p>• Proyeksi tahunan (10.000 kunjungan/bulan): <strong className="font-mono text-zinc-900 dark:text-zinc-100">2,85 kg CO₂e / tahun (6 kWh energi)</strong></p>
                  <p>• Penyerapan alam: Cukup diserap oleh <strong className="text-zinc-900 dark:text-zinc-100">1 batang pohon</strong> dalam setahun</p>
                </div>
              </div>

              <a
                href="https://www.websitecarbon.com/website/sipanda-filkom-vercel-app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  Lihat Sertifikat Asli ↗
                </Button>
              </a>
            </div>
          </div>
        </Card>

        {/* Section 5: Academic Literature & Reference Justification */}
        <Card
          title="5. Landasan Teori & Rujukan Ilmiah Parameter Emisi"
          subtitle="Daftar sitasi akademik yang mendasari seluruh angka konstanta dan formula kalkulator"
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  1. Faktor Emisi Produksi Kertas Fisik (34 g CO₂ / lembar A4)
                </span>
                <span className="font-mono text-[10px] text-zinc-400">Scope 3 Upstream</span>
              </div>
              <p className="font-serif italic text-zinc-600 dark:text-zinc-400 mb-1">
                Ekin, M., &amp; Elitok, Y. (2024). &ldquo;Evaluation of Electronic Document Management System (EDMS) usage in terms of environmental sustainability.&rdquo; Global Energy Law and Sustainability, 1(2), 11–15.
              </p>
              <p className="text-[11px] text-zinc-500">
                <strong>Justifikasi Ilmiah:</strong> Angka 34 gram CO₂ per lembar diperoleh dari analisis siklus hidup (LCA) proses pembuatan kertas fotokopi A4 standar 80 gsm, mencakup pemanenan serat kayu, konsumsi bahan kimia pemutih (bleaching), dan energi termal pabrik bubur kertas.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  2. Faktor Emisi Jaringan Interkoneksi Listrik Jamali (1,06 kg CO₂e / kWh)
                </span>
                <span className="font-mono text-[10px] text-zinc-400">Scope 2 Electricity</span>
              </div>
              <p className="font-serif italic text-zinc-600 dark:text-zinc-400 mb-1">
                Nugroho, R., et al. (2022). &ldquo;Life cycle inventories and life cycle assessment for an electricity grid network: case study of the Jamali grid, Indonesia.&rdquo; International Journal of Life Cycle Assessment, 27(8), 1081–1091.
              </p>
              <p className="text-[11px] text-zinc-500">
                <strong>Justifikasi Ilmiah:</strong> Universitas Brawijaya berlokasi di Malang (Jawa Timur), berada dalam sistem interkoneksi Jawa-Madura-Bali (Jamali) yang didominasi oleh PLTU batubara dengan faktor intensitas karbon 1,06 kg CO₂e/kWh sesuai laporan resmi Kementerian ESDM dan publikasi LCA independen.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  3. Model Efisiensi Energi Web (SWDM v4 — 0,194 kWh / GB)
                </span>
                <span className="font-mono text-[10px] text-zinc-400">Standar Konsensus W3C</span>
              </div>
              <p className="font-serif italic text-zinc-600 dark:text-zinc-400 mb-1">
                Wholegrain Digital, Green Web Foundation, &amp; W3C Sustainable Web Interest Group (2023/2024). &ldquo;Sustainable Web Design Model (SWDM v4).&rdquo;
              </p>
              <p className="text-[11px] text-zinc-500">
                <strong>Justifikasi Ilmiah:</strong> Model pembagian segmen energi: Data Center (0,055 kWh/GB) + Jaringan Transmisi (0,059 kWh/GB) + Perangkat Klien (0,080 kWh/GB) = total 0,194 kWh/GB, dikalikan intensitas karbon global 494 g CO₂e/kWh untuk menghitung jejak karbon transfer data dokumen usulan secara presisi.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  4. Batas Sistem Akuntansi Karbon (GHG Protocol Corporate Standard)
                </span>
                <span className="font-mono text-[10px] text-zinc-400">Prinsip Non-Bias</span>
              </div>
              <p className="font-serif italic text-zinc-600 dark:text-zinc-400 mb-1">
                World Resources Institute (WRI) &amp; World Business Council for Sustainable Development (WBCSD). &ldquo;The Greenhouse Gas Protocol.&rdquo;
              </p>
              <p className="text-[11px] text-zinc-500">
                <strong>Justifikasi Ilmiah:</strong> Mencegah kerancuan perbandingan (*false equivalency*). Emisi produksi kertas dilaporkan dalam satuan massa fisik <strong>kg CO₂</strong>, sementara emisi listrik dilaporkan dalam <strong>kg CO₂e</strong> (termasuk metana dan N₂O). Keduanya disajikan berdampingan secara transparan untuk menggambarkan dampak dekarbonisasi administrasi digital kampus.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}


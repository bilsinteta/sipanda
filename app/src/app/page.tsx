import Link from 'next/link';
import { CarbonBadge } from '@/components/ui/CarbonBadge';
import { EMISSION_FACTORS, DEFAULT_SIMULATION_INPUTS } from '@/lib/emission-data';

export default function HomePage() {
  const annualPaperSheets =
    DEFAULT_SIMULATION_INPUTS.applicationsPerYear *
    DEFAULT_SIMULATION_INPUTS.sheetsPerApplication; // 2,000 lembar
  const conventionalPaperCO2Kg = (annualPaperSheets * EMISSION_FACTORS.paperProductionGramCO2PerSheet) / 1000; // 68 kg CO2
  const conventionalPrinterCO2eKg =
    DEFAULT_SIMULATION_INPUTS.annualPrinterElectricityKwh * EMISSION_FACTORS.jamaliGridKgCO2ePerKwh; // 0.53 kg CO2e
  const digitalOperationalCO2eKg = 0.115; // kg CO2e based on SWDM v4

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-emerald-900 text-emerald-100 px-4 py-2 text-xs text-center flex items-center justify-center gap-2">
        <span>🌿</span>
        <span>
          <strong>Proyek SIPANDA FILKOM UB:</strong> Rancang Bangun Sistem Informasi Pengajuan Dana Berbasis Green Software Engineering.
        </span>
      </div>

      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl shadow-xs">
              🐼
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight flex items-center gap-1.5">
                SIPANDA
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  FILKOM UB
                </span>
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Sustainable Student Funding Information System
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#fitur" className="hover:text-emerald-600 dark:hover:text-emerald-400">Fitur Sistem</a>
            <a href="#green-it" className="hover:text-emerald-600 dark:hover:text-emerald-400">Green IT & TBL</a>
            <a href="#emisi" className="hover:text-emerald-600 dark:hover:text-emerald-400">Kalkulasi CO₂e</a>
            <a href="#tim" className="hover:text-emerald-600 dark:hover:text-emerald-400">Tim Pengembang</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Buka Demo</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="mb-4">
          <CarbonBadge gramsCO2={0.08} cleanerThanPercent={91} />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl text-slate-900 dark:text-white leading-tight">
          Digitalisasi Pengajuan Dana Mahasiswa{' '}
          <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-300 dark:decoration-emerald-700 underline-offset-8">
            Bebas Kertas & Rendah Emisi
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Mengalihkan administrasi cetak proposal dan LPJ di Fakultas Ilmu Komputer Universitas Brawijaya
          ke platform digital yang dirancang dengan prinsip <strong>Green Software Engineering</strong>,
          mengurangi hingga <strong>2.000 lembar kertas/tahun</strong> dan menekan estimasi jejak karbon secara signifikan.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard/pengajuan/baru"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>📝 Buat Pengajuan Dana</span>
          </Link>
          <Link
            href="/dashboard/emisi"
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base transition-colors flex items-center gap-2"
          >
            <span>📊 Simulasi Kalkulator CO₂e</span>
          </Link>
        </div>

        {/* Quick Role Simulation Pills */}
        <div className="mt-10 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl w-full text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center justify-between">
            <span>Akses Cepat Pengujian (4 Aktor Sistem)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">1-Click Demo</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <Link
              href="/dashboard?role=mahasiswa"
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              <div className="font-semibold text-slate-800 dark:text-slate-200">👨‍🎓 Mahasiswa</div>
              <div className="text-[10px] text-slate-500">Ajukan dana & LPJ</div>
            </Link>
            <Link
              href="/dashboard?role=verifikator"
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
            >
              <div className="font-semibold text-slate-800 dark:text-slate-200">📋 Verifikator</div>
              <div className="text-[10px] text-slate-500">Periksa & catat revisi</div>
            </Link>
            <Link
              href="/dashboard?role=approver"
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              <div className="font-semibold text-slate-800 dark:text-slate-200">⚖️ Approver</div>
              <div className="text-[10px] text-slate-500">Wakil Dekan III</div>
            </Link>
            <Link
              href="/dashboard?role=admin"
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
            >
              <div className="font-semibold text-slate-800 dark:text-slate-200">⚙️ Admin</div>
              <div className="text-[10px] text-slate-500">Kelola pengguna</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparative Emission Metric Cards (Spreadsheet Data) */}
      <section id="emisi" className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Hasil Estimasi Emisi & Jejak Karbon
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">
              Skenario Konvensional vs. Digital SIPANDA
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Berdasarkan model perhitungan dari studi Ekin & Elitok (2024), Nugroho dkk. (2022), dan Sustainable Web Design Model (SWDM v4).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Kertas Konvensional */}
            <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
                  <span>PROSES KONVENSIONAL</span>
                  <span className="text-rose-600 dark:text-rose-400">Sebelum SIPANDA</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {conventionalPaperCO2Kg} <span className="text-sm font-normal text-slate-500">kg CO₂/tahun</span>
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p>• <strong>{annualPaperSheets.toLocaleString('id-ID')} lembar A4</strong> (100 pengajuan × 20 lembar)</p>
                  <p>• Faktor emisi kertas: 34 g CO₂/lembar</p>
                  <p>• Ditambah emisi listrik printer: <strong>{conventionalPrinterCO2eKg} kg CO₂e</strong> (0,5 kWh × 1,06 kg/kWh)</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
                Biaya cetak terbuang: ± Rp 1.000.000 / tahun
              </div>
            </div>

            {/* Card 2: Digital SIPANDA */}
            <div className="rounded-2xl p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-2">
                  <span>OPERASIONAL DIGITAL</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">SIPANDA</span>
                </div>
                <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
                  {digitalOperationalCO2eKg} <span className="text-sm font-normal text-slate-500">kg CO₂e/tahun</span>
                </div>
                <div className="mt-2 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <p>• <strong>400 akses digital/tahun</strong> (4 siklus/pengajuan)</p>
                  <p>• Transfer data teroptimasi: <strong>1,2 - 1,56 GB/tahun</strong></p>
                  <p>• Energi digital SWDM v4: <strong>0,23 - 0,30 kWh/tahun</strong></p>
                  <p>• Emisi per akses: hanya <strong>~0,00037 kg CO₂e</strong></p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                Kertas dieliminasi: 100% berkas digital
              </div>
            </div>

            {/* Card 3: Selisih & Prinsip Metodologi */}
            <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
                  <span>POTENSI PENGHEMATAN</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Komparasi</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  99,83% <span className="text-sm font-normal text-slate-500">selisih numerik</span>
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Perbandingan numerik emisi produksi kertas terhadap operasional digital menunjukkan potensi reduksi substansial dalam administrasi fakultas.
                </div>
              </div>
              <div className="mt-4 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                <strong>Catatan Metodologi:</strong> Batas sistem emisi produksi kertas (kg CO₂) dan listrik/digital (kg CO₂e) dilaporkan terpisah sesuai standar GHG Protocol.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Triple Bottom Line (TBL) Section */}
      <section id="green-it" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Analisis Dampak Berkelanjutan
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">
            Pendekatan Triple Bottom Line (TBL)
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Evaluasi menyeluruh terhadap aspek Lingkungan (Planet), Sosial (People), dan Ekonomi (Profit) sesuai PRD Bab 3.2.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-2xl mb-4">
              🌍
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Planet (Lingkungan)</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Mengeliminasi penggunaan rata-rata 20 lembar kertas cetak per proposal. Berpotensi mencegah pelepasan 68 kg CO₂ dari produksi kertas serta limbah fisik dokumen proposal dan LPJ setiap tahunnya di FILKOM.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-2xl mb-4">
              👥
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">People (Sosial)</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Memudahkan mahasiswa dan pengurus Ormawa dalam mengajukan permohonan tanpa harus bolak-balik ke gedung dekanat. Status verifikasi dan revisi dapat dipantau transparan secara real-time.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center text-2xl mb-4">
              💼
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Profit (Ekonomi)</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Menghilangkan pengeluaran biaya cetak, jilid proposal, dan tinta printer mahasiswa. Menghemat waktu kerja staf administrasi fakultas dalam menyortir berkas manual dan pengarsipan fisik.
            </p>
          </div>
        </div>
      </section>

      {/* Green Software Engineering Implementation Highlights */}
      <section id="fitur" className="py-16 bg-slate-100/60 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Arsitektur & Bukti Green Coding
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">
              Penerapan Green Software Engineering (GSE)
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Dibangun sesuai standar laporan proyek: efisiensi energi, minimalisasi transfer data, dan hardware efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-base mb-1">01. System Fonts</div>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                Menggunakan font bawaan OS (system-ui). Menghilangkan 100% request HTTP ke Google Fonts / CDN, menghemat bandwidth jaringan.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-base mb-1">02. Dark Mode Native</div>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                Mendukung tema gelap otomatis & manual, menghemat hingga 30-50% konsumsi daya layar berteknologi OLED/AMOLED.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-base mb-1">03. Minimal Payload</div>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                Bebas library UI berat. Ukuran transfer seluruh halaman hanya berkisar 0,5 - 1,0 MB, ramah untuk koneksi mobile.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-base mb-1">04. Reduced Motion</div>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                CSS menghormati prefers-reduced-motion untuk memangkas siklus komputasi GPU dan rendering loop yang boros daya baterai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Team Section */}
      <section id="tim" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Tim Pengembang Mahasiswa
        </h2>
        <h3 className="text-2xl font-extrabold mt-1 text-slate-900 dark:text-white">
          Program Studi Sistem Informasi FILKOM UB
        </h3>
        <p className="mt-1 text-xs text-slate-500">Mata Kuliah: Sistem Informasi Berkelanjutan • Dosen: Riswan Septriayadi Sianturi, Ph.D.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white text-sm">Fayyadh Radhwa Ferdia</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">NIM: 235150401111058</div>
            <div className="text-xs text-slate-500 mt-2">Sistem Informasi, Angkatan 2023</div>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white text-sm">Muhammad Nabil Fatahilah</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">NIM: 235150401111063</div>
            <div className="text-xs text-slate-500 mt-2">Sistem Informasi, Angkatan 2023</div>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white text-sm">Muhammad Zaidan Rabbani</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">NIM: 245150407111040</div>
            <div className="text-xs text-slate-500 mt-2">Sistem Informasi, Angkatan 2024</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 SIPANDA — Fakultas Ilmu Komputer, Universitas Brawijaya Malang.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.websitecarbon.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 underline"
            >
              Uji Website Carbon
            </a>
            <span>•</span>
            <Link href="/dashboard/emisi" className="hover:text-emerald-600 dark:hover:text-emerald-400 underline">
              Kalkulator CO₂e
            </Link>
            <span>•</span>
            <Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 underline">
              Dashboard Sistem
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from 'next/link';
import { CarbonBadge } from '@/components/ui/CarbonBadge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SipandaLogo } from '@/components/ui/SipandaLogo';
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
      {/* Top Banner */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 px-4 py-2 text-center text-xs text-zinc-600 dark:text-zinc-400">
        <span className="font-medium text-zinc-900 dark:text-zinc-100">Proyek Riset Green Software Engineering</span>
        <span className="mx-2 text-zinc-300 dark:text-zinc-700">·</span>
        <span>Fakultas Ilmu Komputer, Universitas Brawijaya</span>
      </div>

      {/* Navigation */}
      <nav className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <SipandaLogo showText size="sm" />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs text-zinc-600 dark:text-zinc-400">
            <a href="#komparasi" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Estimasi Emisi</a>
            <a href="#tbl" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Dampak TBL</a>
            <a href="#prinsip" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Prinsip GSE</a>
            <a href="#pustaka" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Rujukan Ilmiah</a>
            <a href="#tim" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Tim Peneliti</a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-xs font-medium px-3 py-1.5 rounded-md text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-medium px-3.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 transition-colors"
            >
              Buka Sistem →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-16 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="mb-6">
          <CarbonBadge gramsCO2={0.02} cleanerThanPercent={96} />
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-3xl leading-[1.15]">
          Digitalisasi Pengajuan Dana Mahasiswa Bebas Kertas & Rendah Emisi
        </h1>

        <p className="mt-5 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Mengalihkan administrasi cetak proposal dan LPJ di Fakultas Ilmu Komputer Universitas Brawijaya ke platform digital berstandar <strong>Green Software Engineering</strong>, mengeliminasi hingga <strong>2.000 lembar kertas/tahun</strong>.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard/pengajuan/baru"
            className="px-4.5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs sm:text-sm font-medium transition-colors"
          >
            Buat Usulan Baru
          </Link>
          <Link
            href="/dashboard/emisi"
            className="px-4.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-medium transition-colors"
          >
            Simulasi Kalkulator CO₂e
          </Link>
        </div>

        {/* 1-Click Interactive Role Cards */}
        <div className="mt-12 w-full p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-left">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800/80">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Akses Simulasi Peran (Demo 1-Klik)
            </span>
            <span className="text-[11px] text-zinc-400">Pilih peran untuk menguji alur</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <Link
              href="/dashboard?role=mahasiswa"
              className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900 transition-colors"
            >
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">Mahasiswa</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Ajukan proposal & LPJ</div>
            </Link>
            <Link
              href="/dashboard?role=verifikator"
              className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900 transition-colors"
            >
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">Verifikator</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Periksa berkas & revisi</div>
            </Link>
            <Link
              href="/dashboard?role=approver"
              className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900 transition-colors"
            >
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">Wakil Dekan III</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Persetujuan alokasi dana</div>
            </Link>
            <Link
              href="/dashboard?role=admin"
              className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900 transition-colors"
            >
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">Admin Sistem</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Audit & manajemen akun</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="komparasi" className="py-16 bg-white dark:bg-zinc-900/40 border-y border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400">
              HASIL ESTIMASI RISET
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
              Skenario Konvensional vs. Digital SIPANDA
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
              Mengacu pada model emisi Ekin & Elitok (2024), Nugroho dkk. (2022), dan Sustainable Web Design Model (SWDM v4).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Conventional Card */}
            <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Sebelum SIPANDA
                </div>
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Proses Kertas Fisik
                </div>
                <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-3">
                  {conventionalPaperCO2Kg} <span className="text-xs font-normal text-zinc-500">kg CO₂/thn</span>
                </div>
                <ul className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 border-t border-zinc-200/60 dark:border-zinc-800/80 pt-3">
                  <li>· {annualPaperSheets.toLocaleString('id-ID')} lembar A4 per tahun</li>
                  <li>· Faktor kertas: 34 g CO₂/lembar</li>
                  <li>· Listrik printer: {conventionalPrinterCO2eKg} kg CO₂e</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/80 text-[11px] text-zinc-400">
                Biaya cetak terbuang: ± Rp 1.000.000/thn
              </div>
            </div>

            {/* Digital Card */}
            <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  Platform SIPANDA
                </div>
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Operasional Digital
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-3">
                  {digitalOperationalCO2eKg} <span className="text-xs font-normal text-zinc-500">kg CO₂e/thn</span>
                </div>
                <ul className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 border-t border-zinc-200/60 dark:border-zinc-800/80 pt-3">
                  <li>· 400 akses digital per tahun</li>
                  <li>· Transfer data teroptimasi: 1,2–1,56 GB</li>
                  <li>· Energi sistem SWDM v4: 0,23–0,30 kWh</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/80 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                100% berkas digital bebas kertas
              </div>
            </div>

            {/* Savings Card */}
            <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Komparasi Numerik
                </div>
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Potensi Pengurangan
                </div>
                <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-3">
                  99,83% <span className="text-xs font-normal text-zinc-500">penurunan</span>
                </div>
                <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-200/60 dark:border-zinc-800/80 pt-3 leading-relaxed">
                  Perbandingan numerik emisi produksi kertas terhadap jejak energi digital menunjukkan reduksi substansial.
                </p>
              </div>
              <div className="mt-4 pt-2 text-[10px] text-zinc-400 leading-tight">
                * Batas sistem emisi produksi kertas (kg CO₂) dan listrik/digital (kg CO₂e) dilaporkan terpisah sesuai GHG Protocol.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Triple Bottom Line */}
      <section id="tbl" className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-mono font-medium text-zinc-400 uppercase">
            Analisis Berkelanjutan
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            Pendekatan Triple Bottom Line (TBL)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            Evaluasi menyeluruh pada pilar Lingkungan, Sosial, dan Ekonomi sesuai PRD Bab 3.2.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Planet (Lingkungan)
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Mengeliminasi rata-rata 20 lembar kertas cetak per usulan kegiatan. Berpotensi mencegah pelepasan 68 kg CO₂ dari manufaktur kertas dan limbah fisik proposal di FILKOM.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              People (Sosial)
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Mahasiswa dan pengurus Ormawa dapat memantau status validasi dan catatan revisi secara transparan tanpa bolak-balik ke gedung dekanat.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Profit (Ekonomi)
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Menghilangkan pengeluaran biaya cetak, jilid proposal, dan tinta mahasiswa, serta memangkas waktu kerja administrasi fakultas dalam penyortiran berkas fisik.
            </p>
          </div>
        </div>
      </section>

      {/* GSE Principles */}
      <section id="prinsip" className="py-16 bg-white dark:bg-zinc-900/40 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono font-medium text-zinc-400 uppercase">
              Arsitektur Sistem
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
              Penerapan Green Software Engineering
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">01. System Fonts</div>
              <p className="text-zinc-500 leading-relaxed">
                Font bawaan OS tanpa unduhan CDN font eksternal, memangkas request jaringan secara total.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">02. OLED Native Theme</div>
              <p className="text-zinc-500 leading-relaxed">
                Mode gelap sejati menghemat hingga 30–50% konsumsi energi layar berteknologi OLED/AMOLED.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">03. Minimal Payload</div>
              <p className="text-zinc-500 leading-relaxed">
                Bebas library UI pihak ketiga yang berat. Total transfer seluruh halaman di bawah 1,0 MB.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">04. Reduced Motion</div>
              <p className="text-zinc-500 leading-relaxed">
                Menghormati preferensi komputasi rendah guna menekan siklus daya render GPU pada perangkat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodological Literature & Academic Justification */}
      <section id="pustaka" className="py-16 max-w-5xl mx-auto px-4 sm:px-6 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 uppercase">
            Rujukan Ilmiah & Batas Sistem
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            Transparansi Metodologi & Landasan Teori
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
            Seluruh angka, faktor emisi, dan rumus perhitungan dalam SIPANDA merujuk pada literatur ilmiah bereputasi dan standar audit emisi global (tanpa angka asumsi sepihak).
          </p>
        </div>

        <div className="space-y-4 text-xs">
          {/* Citation 1: Ekin & Elitok (2024) */}
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                1. Emisi Manufaktur Kertas Fisik (34 g CO₂ / lembar A4)
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 w-fit border border-zinc-200 dark:border-zinc-700">
                Scope 3 (Upstream)
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-serif italic mb-1.5">
              Ekin, M., &amp; Elitok, Y. (2024). &ldquo;Evaluation of Electronic Document Management System (EDMS) usage in terms of environmental sustainability.&rdquo; Global Energy Law and Sustainability, 1(2), 11–15.
            </p>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              <strong>Aplikasi di SIPANDA:</strong> Digunakan untuk menghitung baseline proses konvensional. Setiap proposal (rata-rata 20 lembar A4) menghasilkan 680 gram CO₂ dari penebangan kayu, pengolahan pulp, bleaching, dan manufaktur pabrik kertas.
            </p>
          </div>

          {/* Citation 2: Nugroho dkk. (2022) Jamali Grid */}
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                2. Intensitas Jaringan Listrik Jamali (1,06 kg CO₂e / kWh)
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 w-fit border border-zinc-200 dark:border-zinc-700">
                Scope 2 (Electricity)
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-serif italic mb-1.5">
              Nugroho, R., et al. (2022). &ldquo;Life cycle inventories and life cycle assessment for an electricity grid network: case study of the Jamali grid, Indonesia.&rdquo; International Journal of Life Cycle Assessment, 27(8), 1081–1091.
            </p>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              <strong>Aplikasi di SIPANDA:</strong> Menghitung konsumsi listrik printer konvensional dan operasional server di lingkungan Universitas Brawijaya Malang yang dialiri oleh interkoneksi jaringan Jawa-Madura-Bali (faktor bauran pembangkit termal/batu bara).
            </p>
          </div>

          {/* Citation 3: SWDM v4 */}
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                3. Model Desain Web Berkelanjutan (SWDM v4 — 0,194 kWh / GB)
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 w-fit border border-zinc-200 dark:border-zinc-700">
                Konsensus W3C &amp; Wholegrain
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-serif italic mb-1.5">
              Wholegrain Digital, The Green Web Foundation, &amp; W3C Sustainable Web Interest Group (2023/2024). &ldquo;Sustainable Web Design Model (Version 4).&rdquo;
            </p>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              <strong>Aplikasi di SIPANDA:</strong> Menghitung konsumsi energi transmisi digital: Data Center (0,055 kWh/GB) + Jaringan Transmisi (0,059 kWh/GB) + Perangkat Pengguna (0,080 kWh/GB) = total 0,194 kWh/GB, dikonversi dengan faktor intensitas karbon global 494 g CO₂e/kWh.
            </p>
          </div>

          {/* Citation 4: GHG Protocol */}
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                4. Batas Sistem &amp; Transparansi Metodologi (GHG Protocol Standard)
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 w-fit border border-zinc-200 dark:border-zinc-700">
                WRI &amp; WBCSD
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-serif italic mb-1.5">
              World Resources Institute (WRI) &amp; World Business Council for Sustainable Development (WBCSD). &ldquo;The Greenhouse Gas Protocol: A Corporate Accounting and Reporting Standard.&rdquo;
            </p>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              <strong>Aplikasi di SIPANDA:</strong> Memastikan tidak terjadi <em>false equivalence</em> (klaim bias). Emisi manufaktur kertas fisik dilaporkan dalam satuan <strong>kg CO₂</strong>, sedangkan emisi kelistrikan dilaporkan dalam <strong>kg CO₂e</strong>. Selisih 99,83% disajikan secara jujur sebagai komparasi numerik skenario administratif fakultas.
            </p>
          </div>
        </div>
      </section>

      {/* Research Team */}
      <section id="tim" className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-mono font-medium text-zinc-400 uppercase">
            Tim Pengembang
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            Program Studi Sistem Informasi FILKOM UB
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Mata Kuliah: Sistem Informasi Berkelanjutan · Dosen Pengampu: Riswan Septriayadi Sianturi, Ph.D.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">Fayyadh Radhwa Ferdia</div>
            <div className="font-mono text-zinc-500 mt-0.5">NIM: 235150401111058</div>
            <div className="text-zinc-400 mt-1">Sistem Informasi, 2023</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">Muhammad Nabil Fatahilah</div>
            <div className="font-mono text-zinc-500 mt-0.5">NIM: 235150401111063</div>
            <div className="text-zinc-400 mt-1">Sistem Informasi, 2023</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">Muhammad Zaidan Rabbani</div>
            <div className="font-mono text-zinc-500 mt-0.5">NIM: 245150407111040</div>
            <div className="text-zinc-400 mt-1">Sistem Informasi, 2024</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-6 px-4 sm:px-6 text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 SIPANDA · Fakultas Ilmu Komputer, Universitas Brawijaya Malang.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://www.websitecarbon.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Uji Website Carbon ↗
            </a>
            <Link href="/dashboard/emisi" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Kalkulator CO₂e
            </Link>
            <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

# 🐼 SIPANDA — Sistem Informasi Pengajuan Dana Berbasis Green Software Engineering

> **Fakultas Ilmu Komputer, Universitas Brawijaya (FILKOM UB)**  
> Mata Kuliah: **Sistem Informasi Berkelanjutan**  
> Dosen Pengampu: **Riswan Septriayadi Sianturi, Ph.D.**  
> Tahun Akademik: **2026**

---

## 👥 Tim Pengembang

| Nama Mahasiswa | NIM | Program Studi |
| :--- | :--- | :--- |
| **Fayyadh Radhwa Ferdia** | `235150401111058` | S1 Sistem Informasi |
| **Muhammad Nabil Fatahilah** | `235150401111063` | S1 Sistem Informasi |
| **Muhammad Zaidan Rabbani** | `245150407111040` | S1 Sistem Informasi |

---

## 📖 Ringkasan Proyek

**SIPANDA** (*Sistem Informasi Pengajuan Dana*) adalah solusi perangkat lunak berbasis web fungsional yang dirancang untuk mendigitalkan dan mengoptimalkan seluruh siklus administrasi pengajuan pendanaan kegiatan mahasiswa di lingkungan Fakultas Ilmu Komputer Universitas Brawijaya.

Sebelumnya, pengajuan proposal kegiatan dan Laporan Pertanggungjawaban (LPJ) mahasiswa dilakukan secara konvensional menggunakan dokumen fisik cetak. Berdasarkan kajian awal:
- Terdapat rata-rata **100 usulan kegiatan per tahun**.
- Setiap usulan membutuhkan rata-rata **20 lembar kertas A4** (proposal, RAB, lembar pengesahan, dan lampiran).
- Proses ini menghabiskan sedikitnya **2.000 lembar kertas A4/tahun**, menghasilkan estimasi emisi produksi kertas sebesar **68 kg CO₂** (Ekin & Elitok, 2024), serta emisi listrik printer sebesar **0,53 kg CO₂e** (Nugroho dkk., 2022).

Dengan penerapan **SIPANDA**, seluruh alur dialihkan ke sistem digital yang dibangun dengan prinsip **Green Software Engineering (GSE)**. Berdasarkan pengukuran transfer data operasional menggunakan model *Sustainable Web Design Model* (SWDM v4), estimasi emisi operasional digital SIPANDA hanya sekitar **0,115 kg CO₂e per tahun**.

---

## 🌿 Penerapan Green Software Engineering (GSE)

SIPANDA mengimplementasikan prinsip-prinsip efisiensi energi dan perangkat lunak berkelanjutan:

1. **System Fonts (Zero Network Font Requests):**
   - Menggunakan font sistem native (`system-ui, -apple-system, Roboto, sans-serif`).
   - Meniadakan seluruh *request HTTP external* ke Google Fonts / Typekit / CDN font, menghemat transfer data sebesar ~150-300 KB per kunjungan pertama.
2. **Dark Mode Default & Toggle (OLED/AMOLED Efficiency):**
   - Mendukung tema gelap secara otomatis dan manual.
   - Menghemat hingga **30–50% konsumsi energi layar** berbasis OLED pada perangkat pengguna.
3. **Minimal Data Transfer (< 1 MB Payload):**
   - Rata-rata beban transfer halaman sistem teruji antara **0,5 MB hingga 1,0 MB** (jauh di bawah batas rata-rata web global ~2,5 MB).
   - Bebas library CSS/UI eksternal yang berat (dibangun murni dengan Tailwind CSS v4).
4. **Respek terhadap `prefers-reduced-motion`:**
   - Mematikan animasi berat dan siklus komputasi GPU berlebih bagi pengguna yang mengaktifkan hemat daya atau pengurangan animasi.
5. **Arsitektur Static & Server-Side Rendering (Next.js Turbopack):**
   - Mengoptimalkan TTFB (*Time to First Byte*) dan mengurangi durasi komputasi CPU server.
6. **Integrasi Website Carbon Calculator:**
   - Halaman siap diuji langsung di [WebsiteCarbon.com](https://www.websitecarbon.com/) dengan proyeksi emisi **< 0,10g CO₂ per kunjungan** (kategori rating A+ / Lebih bersih dari 90%+ situs web).

---

## 📊 Analisis Triple Bottom Line (TBL)

| Dimensi | Permasalahan Awal | Solusi SIPANDA | Indikator Dampak |
| :--- | :--- | :--- | :--- |
| **Planet (Lingkungan)** | Penggunaan dokumen cetak (~2.000 lembar A4/tahun) dan limbah jilid proposal/LPJ. | Pengelolaan dokumen 100% paperless secara digital di cloud. | Mengeliminasi 2.000 lembar kertas; mencegah potensi emisi produksi 68 kg CO₂. |
| **People (Sosial)** | Mahasiswa harus datang berulang kali ke dekanat; status revisi tidak transparan. | Pengajuan online terpusat dengan notifikasi status dan catatan revisi real-time. | Kemudahan akses, transparansi proses, efisiensi waktu mahasiswa & staf. |
| **Profit (Ekonomi)** | Biaya cetak & jilid proposal mandiri mahasiswa (~Rp 500/lembar = Rp 1 Jt/tahun). | Tidak memerlukan biaya pencetakan sama sekali. | Penghematan anggaran operasional mahasiswa dan efisiensi waktu kerja staf. |

---

## 👥 Aktor & Hak Akses Pengguna

| Aktor | Peran & Hak Akses di SIPANDA |
| :--- | :--- |
| **Mahasiswa / Ormawa** | Mengajukan usulan pendanaan, mengunggah dokumen proposal & RAB, memantau linimasa status verifikasi, dan mengunggah LPJ kegiatan. |
| **Verifikator Kemahasiswaan** | Memeriksa kelengkapan administrasi usulan, memberikan catatan revisi, atau meloloskan berkas ke tahap persetujuan. |
| **Pemberi Persetujuan (Wadek III)** | Meninjau proposal yang telah lolos verifikasi, memutuskan persetujuan pendanaan, dan menerbitkan catatan persetujuan DIPA. |
| **Administrator Sistem** | Mengelola akun pengguna, hak akses aktor, rekapitulasi audit trail, dan data arsip digital. |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (Pure CSS Variables, zero external bloat)
- **Database, Auth & Storage:** Supabase (PostgreSQL with Row Level Security & Storage Bucket)
- **Deployment Platform:** Vercel Global Edge Network (100% Renewable Energy)
- **Tooling:** pnpm

---

## 🚀 Panduan Menjalankan Aplikasi Secara Lokal

### 1. Kloning Repositori
```bash
git clone https://github.com/<username>/sipanda.git
cd sipanda/app
```

### 2. Pasang Dependencies
```bash
pnpm install
```

### 3. Konfigurasi Lingkungan (Opsional)
Salin `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```
*(Catatan: Aplikasi telah dilengkapi **in-memory mock fallback** sehingga seluruh fitur, simulasi 4 aktor, formulir pengajuan, verifikasi, dan kalkulator emisi dapat langsung diuji secara interaktif meskipun belum menghubungkan kredensial Supabase live).*

### 4. Jalankan Server Development
```bash
pnpm dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

### 5. Build Produksi
```bash
pnpm build
pnpm start
```

---

## ☁️ Panduan Deployment (Vercel + Supabase)

Untuk panduan langkah-demi-langkah setup Supabase dan integrasi deployment Vercel, silakan baca:
👉 [**DEPLOYMENT_GUIDE.md**](./DEPLOYMENT_GUIDE.md)

---

## 📚 Dokumen Pendukung dalam Repositori

1. `Product Requirements Document SIPANDA.docx` & `.pdf` (PRD Lengkap)
2. `Spreadsheet CO2e SIPANDA.xlsx` (Formula & dataset mentah perhitungan CO₂e)
3. `Tugas Proyek Akhir.docx` (Panduan instruksi tugas proyek akhir)
4. `GREEN_SOFTWARE_GUIDELINES.md` (Aturan & pedoman Green Software Engineering)
5. `DEPLOYMENT_GUIDE.md` (Panduan setup Supabase dan Vercel)


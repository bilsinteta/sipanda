# ☁️ Panduan Deployment SIPANDA (GitHub + Supabase + Vercel)

Panduan praktis ini menjelaskan cara mempublikasikan web app SIPANDA ke **GitHub**, menghubungkan **Supabase Database & Auth**, dan melakukan *live deployment* di **Vercel**.

---

## Tahap 1: Hubungkan & Push ke Repositori GitHub

1. Buka akun GitHub Anda ([github.com](https://github.com)).
2. Buat repositori baru (misal dengan nama `sipanda` atau `sipanda-filkom-ub`). Pilih opsi **Public** atau **Private** (bebas) dan biarkan kosong tanpa inisialisasi README (karena kita sudah memiliki repositori lokal).
3. Di terminal komputer Anda (folder `C:\bejana\sipanda`), jalankan:
   ```bash
   git add .
   git commit -m "feat: inisialisasi lengkap SIPANDA berbasis Green Software Engineering"
   git branch -M main
   git remote add origin https://github.com/<username-github-anda>/sipanda.git
   git push -u origin main
   ```

---

## Tahap 2: Menyiapkan Proyek Supabase

1. Kunjungi [supabase.com](https://supabase.com) dan masuk dengan akun GitHub Anda.
2. Klik **New Project**, pilih organisasi Anda, beri nama (misal: `sipanda-db`), dan tentukan database password yang aman.
3. Pilih Region terdekat (misal: **Singapore / Southeast Asia**).
4. Setelah database siap, buka menu **SQL Editor** pada sidebar kiri Supabase.
5. Buka berkas `app/supabase/schema.sql` pada proyek ini, salin seluruh isinya, tempelkan ke SQL Editor Supabase, lalu klik **Run**.
   - Skrip ini akan otomatis membuat tabel `users`, `funding_applications`, `documents`, `verifications`, `approvals`, `accountability_reports`, mengaktifkan Row Level Security (RLS), dan membuat Storage Bucket `sipanda-docs`.
6. Buka menu **Project Settings** > **API**. Catat dua kredensial berikut:
   - **Project URL:** `https://xxxxxxxx.supabase.co`
   - **anon / public key:** `eyJhbGciOi...`

---

## Tahap 3: Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **Add New...** > **Project**.
3. Pilih repositori `sipanda` yang telah di-push di Tahap 1, lalu klik **Import**.
4. **PENTING (Root Directory):**
   - Pada bagian **Root Directory**, klik **Edit** dan pilih folder `app`.
   - Vercel akan otomatis mengenali framework sebagai **Next.js**.
5. Pada bagian **Environment Variables**, tambahkan dua variabel dari Tahap 2:
   - `NEXT_PUBLIC_SUPABASE_URL` = Nilai Project URL Supabase Anda
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Nilai anon key Supabase Anda
6. Klik tombol **Deploy**!
7. Dalam waktu ~1-2 menit, situs Anda akan aktif dengan domain publik (contoh: `https://sipanda.vercel.app`).

---

## Tahap 4: Pengujian di Website Carbon Calculator

1. Salin URL publik Vercel Anda (contoh: `https://sipanda.vercel.app`).
2. Kunjungi [https://www.websitecarbon.com/](https://www.websitecarbon.com/).
3. Masukkan URL tersebut dan klik **Calculate**.
4. Simpan tangkapan layar (screenshot) hasil pengujian untuk dilampirkan pada **Bab 4.2.2 Laporan Proyek Akhir** dan **Slide Pitch Deck**.
   - *Target hasil:* **Rating A+** dengan emisi karbon di bawah **0,10g CO₂ per kunjungan**.

# 🌿 Panduan & Aturan Green Software Engineering (GSE) — SIPANDA

Dokumen ini mendokumentasikan prinsip, rumus perhitungan emisi, dan pedoman arsitektur hemat energi yang diterapkan dalam pengembangan sistem informasi SIPANDA di FILKOM Universitas Brawijaya.

---

## 1. Rumus Baku Perhitungan Emisi Karbon

### A. Skenario Konvensional (Kertas & Listrik Printer)
1. **Emisi Produksi Kertas A4:**
   $$\text{Emisi Kertas (kg CO}_2\text{)} = \frac{\text{Jumlah Pengajuan} \times \text{Lembar/Pengajuan} \times 34\text{ g CO}_2}{1.000}$$
   *Referensi:* Ekin, M., & Elitok, Y. (2024). *"Evaluation of EDMS usage in terms of environmental sustainability."* Global Energy, 1(2), 11–15.
   *(Nilai default: $100 \times 20 \times 34 \div 1.000 = 68\text{ kg CO}_2$)*

2. **Emisi Listrik Printer:**
   $$\text{Emisi Listrik Printer (kg CO}_2\text{e)} = \text{Konsumsi Listrik (kWh)} \times 1,06\text{ kg CO}_2\text{e/kWh}$$
   *Referensi:* Nugroho, R., et al. (2022). *"Life cycle inventories and life cycle assessment for an electricity grid network: case study of the Jamali grid, Indonesia."* Int J LCA.
   *(Nilai default: $0,5\text{ kWh} \times 1,06 = 0,53\text{ kg CO}_2\text{e}$)*

### B. Skenario Digital (Sustainable Web Design Model v4)
Model SWDM v4 membagi intensitas energi operasional menjadi tiga komponen utama:
- **Pusat Data (Data Center):** $0,055\text{ kWh/GB}$
- **Jaringan Transmisi (Network):** $0,059\text{ kWh/GB}$
- **Perangkat Pengguna (User Device):** $0,080\text{ kWh/GB}$
- **Total Intensitas Energi Operasional:** $0,194\text{ kWh/GB}$
- **Intensitas Karbon Global Bawaan:** $494\text{ g CO}_2\text{e/kWh}$

**Perhitungan:**
$$\text{Total Transfer (GB)} = \frac{\text{Total Pengajuan} \times \text{Siklus Akses/Pengajuan} \times \text{MB/Akses}}{1.024}$$
$$\text{Energi Operasional (kWh)} = \text{Total Transfer (GB)} \times 0,194\text{ kWh/GB}$$
$$\text{Emisi Operasional (kg CO}_2\text{e)} = \frac{\text{Energi (kWh)} \times 494\text{ g CO}_2\text{e/kWh}}{1.000}$$

*(Pada simulasi default 100 pengajuan, 4 siklus akses, dan 4 MB transfer = 1,5625 GB, energi 0,303 kWh, emisi operasional sekitar 0,115 - 0,149 kg CO₂e/tahun)*.

---

## 2. Aturan Penting Metodologi (Peringatan GHG Protocol)
- **Jangan menjumlahkan langsung** $\text{kg CO}_2$ (produksi kertas) dengan $\text{kg CO}_2\text{e}$ (listrik printer atau operasional web digital) sebagai satu total emisi tanpa batasan sistem yang disetarakan.
- Laporkan emisi produksi kertas dan emisi listrik/digital secara **terpisah**.
- Selisih numerik (misal 99,83%) adalah **perbandingan komparatif ilustratif**, bukan klaim pengurangan mutlak.

---

## 3. Checklist Aturan Green Coding untuk Pengembang
- [x] **Zero Web Fonts:** Wajib menggunakan font native sistem (`system-ui`). Dilarang memuat `@font-face` eksternal dari Google Fonts / Adobe Typekit.
- [x] **OLED Dark Mode:** Menyediakan tema gelap berdaya rendah yang memanfaatkan pemadaman pixel hitam pada layar OLED.
- [x] **Ukuran Payload Terbatas:** Seluruh aset gambar dan dokumen harus dikompresi. Payload halaman maksimal 1 MB.
- [x] **Reduced Motion:** Menghormati pengaturan OS pengguna (`prefers-reduced-motion`) untuk menonaktifkan loop animasi GPU.
- [x] **Tanpa Polling Berlebih:** Gunakan caching client-side dan server rendering untuk meminimalkan beban komputasi CPU.
- [x] **Audit Website Carbon:** Lakukan benchmark berkala di [WebsiteCarbon.com](https://www.websitecarbon.com/) dengan target rating A+.


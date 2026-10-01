# DESIGN.md - Sistem Antrian Poliklinik Terpadu

## 1. Identitas & Visi Produk
Sistem informasi antrean dan operasional loket poliklinik pratama yang humanis, teratur, dan andal. Dibangun khusus untuk kebutuhan operasional klinik nyata di Indonesia:
- **Pasien**: Mendapatkan nomor tiket dengan mudah di mesin kiosk mandiri, memantau nomor antrean dengan jelas di Display TV ruang tunggu dengan panggilan suara bahasa Indonesia.
- **Operator Loket / Petugas Poli**: Memanggil pasien dengan cepat, memantau antrean berikutnya, menggunakan pintasan keyboard (Space, R, S), dan melihat durasi pelayanan secara akurat.
- **Administrator Klinik**: Memantau beban antrean antar-poliklinik secara terpadu, status keaktifan loket, distribusi pasien, dan mengelola hak akses/role petugas.

## 2. Dials (Tingkat Energi, Ritme, dan Gerak)
- **ENERGY: 1 (Calm)**: Karakter pelayanan kesehatan yang tenang, meyakinkan, dan profesional. Menghindari warna mencolok berlebih, glow sintetis, atau efek visual berisik.
- **RHYTHM: 2 (Balanced)**: Struktur konsisten dan terorganisir rapi dengan pemisah visual yang fungsional untuk status antrean, meja loket, dan data operasional.
- **MOTION: 1 (Hover & State Feedback)**: Gerakan hanya untuk respons interaksi pengguna dan status nyata (misalnya: indikator gelombang suara saat audio panggilan nomor aktif). Tanpa animasi melayang tanpa henti (no endless pulses/floating orbs).

## 3. Palet Warna (Healthcare Palette Terkurasi)
- **Neutral Base**:
  - Light Mode: Background `#f8fafc` (slate-50), Surface/Card `#ffffff`, Border `#e2e8f0`, Teks Utama `#0f172a` (slate-900), Teks Sekunder `#475569` (slate-600).
  - Dark Mode: Background `#0b1120` (slate-950), Surface/Card `#111827` (slate-900), Border `#1e293b`, Teks Utama `#f8fafc`, Teks Sekunder `#94a3b8`.
- **Core Primary (Teal Medis)**:
  - Light Mode: `#0f766e` (teal-700) & `#0d9488` (teal-600).
  - Dark Mode: `#2dd4bf` (teal-400).
- **Core Accent (Amber Panggilan)**:
  - `#d97706` / `#f59e0b` untuk menyorot nomor yang sedang dipanggil ke loket.
- **Indikator Status Fungsional**:
  - Hijau (`#16a34a`): Loket aktif melayani / antrean selesai.
  - Biru (`#0284c7`): Menunggu giliran.
  - Merah (`#dc2626`): Batal / loket tutup.

## 4. Tipografi & Skala
- Font: `Inter`, system-ui, sans-serif.
- Nomor Antrean & Timer: `font-mono tabular-nums tracking-wide` untuk keterbacaan angka instan dari kejauhan (Display TV) dan kejelasan tiket cetak thermal.
- Rasio Kontras: Seluruh teks memenuhi standar WCAG AA (minimal 4.5:1 untuk teks normal, minimal 3:1 untuk teks besar).

## 5. Keputusan Anti-Slop (R-XX Compliance)
- **Tanpa Em Dash**: Seluruh salinan bahasa Indonesia menggunakan koma, titik dua, tanda kurung, atau titik.
- **Tanpa Buzzwords AI**: Tidak menggunakan kata seperti "Revolusioner", "Kecerdasan Buatan Canggih", "Next-gen", "Seamless". Gunakan deskripsi fakta operasional poliklinik.
- **Tanpa Ambient Glow Blobs**: Hapus radial orbs blur di latar belakang hero section.
- **Navigasi Nyata**: Semua link dan tombol terhubung ke aksi atau rute yang benar-benar ada.
- **Tampilan Role yang Jelas**: Setiap peran pengguna (Administrator, Operator Loket, Staf) teridentifikasi secara visual dan memiliki area kerja yang sesuai tanggung jawabnya.

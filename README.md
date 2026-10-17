# 🏥 Sistem Antrian & Manajemen Loket Klinik Modern

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Aplikasi Sistem Antrian Klinik dan Puskesmas modern berbasis web yang dirancang untuk mengoptimalkan alur pelayanan pasien, mempercepat proses administrasi loket, mengurangi antrean fisik, dan memberikan transparansi informasi secara real-time.

Dibangun menggunakan kombinasi **Laravel 12** sebagai backend yang handal, **Inertia.js v2** dengan **React 19** & **TypeScript** untuk antarmuka pengguna yang reaktif tanpa reload, serta sistem **Panggilan Suara Otomatis (Text-to-Speech)** berbahasa Indonesia.

---

## 🌟 Fitur Utama

### 1. 📺 Display TV Antrian Ruang Tunggu (`/queue/display`)
- **Tampilan Khusus Layar TV / Monitor**: Desain clean, kontras tinggi, dan responsif untuk berbagai ukuran layar ruang tunggu.
- **Panggilan Suara Otomatis (Audio Chime & Indonesian TTS)**: Membunyikan bel notifikasi dan melafalkan nomor antrean beserta loket tujuan dalam Bahasa Indonesia (contoh: *"Nomor antrian A-004, layanan Poli Umum, silakan menuju Loket 1"*).
- **Status Real-time Seluruh Layanan**: Menampilkan nomor yang sedang dilayani, loket aktif, dan nomor antrean berikutnya untuk setiap poli/layanan secara serentak.
- **Statistik Global**: Ringkasan pasien selesai, sedang dilayani, dan sisa pasien menunggu hari ini.

### 2. 🎫 Kiosk Pengambilan Tiket Mandiri (`/queue/ticket`)
- **Antarmuka Kiosk Mandiri**: Pasien dapat memilih poli tujuan hanya dengan satu sentuhan layar.
- **Dukungan Beragam Poliklinik & Layanan**:
  - 🩺 Poli Umum (Prefix `A`)
  - 🦷 Poli Gigi (Prefix `B`)
  - 💊 Farmasi / Apotek (Prefix `C`)
  - 👶 Poli KIA - Kesehatan Ibu & Anak (Prefix `D`)
  - 🔬 Laboratorium (Prefix `E`)
- **Penerbitan Nomor Otomatis**: Penomoran berurutan per layanan dengan format kode unik (misal: `A-001`, `B-002`) dan estimasi waktu tunggu.

### 3. 🖥️ Meja Operasional Loket (`/queue/management`)
- **Kendali Panggilan Penuh**:
  - 📢 **Panggil Berikutnya (Call Next)**: Mengambil antrean berikutnya secara otomatis dan memicu suara panggilan di display.
  - 🔁 **Panggil Ulang (Recall)**: Memanggil kembali pasien yang belum hadir di loket.
  - ✅ **Selesai Dilayani (Finish)**: Menandai pelayanan selesai dan menghitung durasi layanan.
- **Pilih Loket & Layanan Fleksibel**: Operator dapat memilih loket dan poli yang ditugaskan.
- **Pengaturan Suara Lokal**: Dilengkapi toggle on/off suara serta pengatur volume suara panggilan langsung dari panel operator.

### 4. 📊 Dashboard Analitik & Manajemen (`/dashboard`)
- **Statistik Pelayanan Hari Ini**: Total kunjungan, pasien selesai, antrean berjalan, dan sisa pasien menunggu.
- **Rata-rata Waktu Pelayanan**: Menghitung estimasi rata-rata waktu konsultasi/pelayanan per pasien.
- **Monitoring Kinerja Poli & Loket**: Memantau beban kerja masing-masing poli dan produktivitas operator loket.
- **Manajemen Role**: Pengelolaan hak akses Administrator dan Operator dengan fitur switch-role instan.

### 5. ⚡ Performa Tinggi & Efisiensi Jaringan
- **Database Indexing**: Indeks teroptimasi pada kolom `status`, `served_date`, `service_id`, dan `counter_id`.
- **Client-Side Caching & Instant Hydration**: Navigasi halaman seketika tanpa jeda loading putih.
- **Visibility-Aware Polling**: Otomatis menghentikan polling latar belakang saat tab tidak aktif untuk menghemat bandwidth dan beban server.

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
|---|---|
| **Backend Framework** | [Laravel 12](https://laravel.com) (PHP 8.2+) |
| **Frontend Framework** | [React 19](https://react.dev) via [Inertia.js v2](https://inertiajs.com) |
| **Bahasa Pemrograman** | [PHP](https://www.php.net) & [TypeScript](https://www.typescriptlang.org) |
| **Styling & UI Components** | [Tailwind CSS v4](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev) |
| **Build Tool** | [Vite 7](https://vitejs.dev) |
| **Sistem Suara** | Web Speech API (Synthesis) & HTML5 Audio Chime |
| **Database** | SQLite (Default) / MySQL / PostgreSQL |

---

## 📋 Prasyarat Sistem

Pastikan perangkat Anda telah terpasang:
- **PHP** >= 8.2 (dengan ekstensi `pdo`, `sqlite3` / `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `curl`)
- **Composer** >= 2.x
- **Node.js** >= 18.x & **NPM** >= 9.x
- **Git**

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Clone Repositori
```bash
git clone https://github.com/rayyanbabab/Loket-klinik.git
cd Loket-klinik
```

### 2. Install Dependensi Backend
```bash
composer install
```

### 3. Install Dependensi Frontend
```bash
npm install
```

### 4. Konfigurasi Lingkungan (`.env`)
Salin file contoh konfigurasi dan buat database SQLite:
```bash
cp .env.example .env
php artisan key:generate
```

*Jika menggunakan SQLite, pastikan file database tersedia:*
```bash
# Windows PowerShell
if (!(Test-Path "database/database.sqlite")) { New-Item -ItemType File -Path "database/database.sqlite" }

# Linux / macOS
touch database/database.sqlite
```

### 5. Migrasi & Seed Database
Jalankan migrasi tabel beserta data demo layanan, loket, dan akun awal:
```bash
php artisan migrate:fresh --seed
```

### 6. Build Aset Frontend
```bash
# Untuk mode pengembangan (hot reload):
npm run dev

# Atau untuk build berkas produksi:
npm run build
```

### 7. Jalankan Server Aplikasi
Jalankan perintah berikut pada terminal terpisah atau gunakan artisan serve:
```bash
php artisan serve
```

Aplikasi siap diakses melalui browser di: `http://127.0.0.1:8000`

---

## 🔑 Akun Bawaan (Default Credentials)

Setelah menjalankan `php artisan migrate --seed`, Anda dapat menggunakan akun berikut untuk masuk:

| Role | Email | Password | Hak Akses |
|---|---|---|---|
| **Administrator** | `admin@puskesmas.com` | `password` | Akses penuh (Dashboard, Statistik, Switch Role, Manajemen Loket) |
| **Operator Poli Umum** | `operator1@puskesmas.com` | `password` | Panel Panggilan Loket & Antrian |
| **Operator Poli Gigi** | `operator2@puskesmas.com` | `password` | Panel Panggilan Loket & Antrian |

---

## 🗺️ Peta Halaman & Navigasi

| Rute URL | Nama Rute | Deskripsi Halaman |
|---|---|---|
| `/` | `home` | Halaman Depan / Landing page informasi klinik & navigasi cepat |
| `/queue/display` | `queue.display` | Tampilan Layar TV ruang tunggu (dilengkapi audio & Indonesian TTS) |
| `/queue/ticket` | `queue.ticket` | Kiosk mandiri pengambilan nomor tiket antrian |
| `/queue/management` | `queue.management` | Panel operasional pemanggilan antrean bagi petugas loket (Perlu Login) |
| `/dashboard` | `dashboard` | Dashboard analitik dan pemantauan statistik pelayanan (Perlu Login) |
| `/login` | `login` | Halaman login petugas / pengguna |

---

## 🔌 Dokumentasi REST API

Aplikasi menyediakan REST API untuk integrasi sistem perangkat keras display atau kiosk eksternal:

### Layanan Publik & Display
- `GET /api/status` : Mengambil status antrean seluruh layanan saat ini (nomor aktif, loket, antrian berikutnya).
- `GET /api/status/{service}` : Mengambil status antrean untuk poli spesifik.
- `GET /api/services` : Daftar seluruh poli/layanan aktif beserta kode prefix.
- `GET /api/counters` : Daftar loket aktif beserta pemetaan layanannya.
- `GET /api/counter/{id}/current` : Mengambil tiket yang sedang aktif dilayani pada loket tertentu.
- `GET /api/counter/{id}/stats` : Statistik tiket selesai, sedang dilayani, dan sisa antrean loket.
- `GET /api/dashboard/stats` : Rekap statistik komprehensif untuk dashboard admin.
- `GET /api/global/stats` : Rekap cepat (selesai, melayani, menunggu) untuk display TV.

### Operasional Loket & Tiket
- `POST /api/tickets` : Membuat tiket baru (`{ service_id: number }`).
- `POST /api/call/next` : Memanggil nomor berikutnya pada loket (`{ counter_id: number }`).
- `POST /api/call/{ticket}/recall` : Memanggil ulang nomor tiket yang sedang dilayani.
- `POST /api/call/{ticket}/finish` : Menyelesaikan pelayanan tiket saat ini.

---

## 📁 Struktur Direktori Utama

```
aplikasi-loket-klinik/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── QueueController.php       # Logika antrian, panggilan, & statistik
│   │       ├── DisplayController.php     # Controller display
│   │       └── UserRoleController.php    # Manajemen role operator & admin
│   └── Models/                           # Model Eloquent (Ticket, Service, Counter, Call, User)
├── database/
│   ├── migrations/                       # Skema tabel antrian & indeks performa
│   └── seeders/DatabaseSeeder.php        # Data demo (layanan, loket, tiket sampel)
├── resources/
│   ├── js/
│   │   ├── components/                   # Komponen UI (Navbar, Logo, Buttons, Audio Controls)
│   │   ├── hooks/
│   │   │   └── useQueue.ts               # Hook state antrian, caching, sound system & TTS
│   │   ├── pages/
│   │   │   ├── welcome.tsx               # Halaman utama
│   │   │   ├── dashboard.tsx             # Dashboard ringkasan klinik
│   │   │   └── queue/
│   │   │       ├── display.tsx           # Layar Display TV
│   │   │       ├── ticket.tsx            # Mesin Kiosk Tiket
│   │   │       └── management.tsx        # Panel Petugas Loket
│   │   └── types/                        # Definisi tipe TypeScript
│   └── css/                              # Pengaturan Tailwind CSS v4
├── routes/
│   ├── web.php                           # Routing web & halaman Inertia
│   └── api.php                           # Endpoint REST API antrian
└── README.md                             # Dokumentasi proyek
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi terbuka [MIT License](LICENSE). Bebas digunakan, dimodifikasi, dan didistribusikan untuk keperluan operasional klinik, puskesmas, rumah sakit, maupun pengembangan lebih lanjut.

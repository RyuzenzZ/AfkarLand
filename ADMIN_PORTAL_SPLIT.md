# Rencana Pemisahan Admin Web dan Portal Internal

Dokumen ini menjadi acuan awal untuk memisahkan admin website utama AFKAR LAND dari portal internal karyawan lintas divisi.

## Prinsip Pemisahan

Admin web utama hanya dipakai untuk mengelola tampilan, konten, SEO, tracking, dan konfigurasi website publik.

Portal internal atau subdomain baru dipakai untuk proses kerja karyawan: HRD, marketing, keuangan, operasional proyek, manajemen proyek, direksi, dan direktur utama.

Rekomendasi subdomain:

- `admin.afkarland.com` untuk admin website utama.
- `portal.afkarland.com` atau `internal.afkarland.com` untuk akses karyawan semua divisi.

## Tetap di Admin Website Utama

| Modul Saat Ini | Route | Alasan |
| --- | --- | --- |
| Dashboard | `/admin/dashboard` | Ringkasan kesehatan website dan notifikasi admin web. |
| Notifikasi | `/admin/notifications` | Tetap sementara untuk notifikasi dari form publik. Bisa dipindah jika portal sudah menangani inbox terpusat. |
| Homepage | `/admin/homepage` | CMS halaman utama website publik. |
| Proyek Website | `/admin/projects` | Konten proyek yang tampil di website, bukan manajemen proyek internal. |
| Layanan | `/admin/services` | Konten layanan perusahaan di website publik. |
| Artikel / Blog | `/admin/articles` | CMS artikel dan publikasi. |
| Galeri Media | `/admin/gallery` | Media publik untuk website. |
| Testimoni | `/admin/testimonials` | Konten testimoni publik. |
| SEO Manager | `/admin/seo` | Meta tag, canonical, Search Console, Analytics, GTM. |
| Analytics Website | `/admin/analytics` | Analitik website publik. |
| Pengaturan Web | `/admin/settings` | Kontak publik, WhatsApp umum, maintenance, konfigurasi website. |

## Dipindahkan ke Portal Internal

| Modul Saat Ini | Route Saat Ini | Target Portal | Alasan |
| --- | --- | --- | --- |
| Leads & CRM | `/admin/leads` | Marketing / CRM | Berhubungan dengan pipeline prospek, follow-up, closing, dan tools marketing. |
| Pesan Kontak | `/admin/messages` | Marketing / Customer Service | Inbox operasional, bukan konfigurasi website. |
| Lamaran HRD | `/admin/applications` | HRD | HRD perlu pantau lamaran, kandidat, dan status rekrutmen lintas divisi. |
| Siteplan Proyek | `/admin/siteplan` | Operasional / Manajemen Proyek | Berhubungan dengan stok unit, booking, kavling, dan kontrol proyek. |
| Laporan Keuangan | `/admin/finance` | Finance / Direksi | Data keuangan internal tidak ideal berada di admin website publik. |
| Performa Tim | `/admin/performance` | Marketing / HRD / Direksi | KPI tim dan leaderboard lebih cocok untuk portal karyawan. |

## Role Portal Internal yang Disarankan

| Role | Akses Utama |
| --- | --- |
| Karyawan | Dashboard personal, tugas, data sesuai divisi. |
| Marketing | Leads, follow-up, pipeline, performa pribadi, tools Google/marketing yang relevan. |
| HRD | Lamaran, data karyawan, absensi, KPI lintas divisi, rekrutmen. |
| Keuangan | Transaksi, laporan, budget, approval pembayaran. |
| Operasional Proyek | Siteplan, status unit, progres proyek, dokumentasi lapangan. |
| Manajemen Proyek | Monitoring proyek, progress, risiko, issue, approval operasional. |
| Direksi | Ringkasan semua divisi, performa perusahaan, laporan keuangan, laporan proyek. |
| Direktur Utama | Executive dashboard lintas bisnis dengan akses final approval. |

## Catatan Implementasi Bertahap

1. Tahap 1: Sidebar admin website menyisakan modul web utama dan menyediakan satu akses eksternal ke Portal Tim Afkar Land.
2. Tahap 2: Buat portal internal dengan auth role-based access control.
3. Tahap 3: Pindahkan Firestore service dan halaman internal satu per satu ke portal.
4. Tahap 4: Setelah portal stabil, route internal di admin website utama diarahkan ke subdomain baru.
5. Tahap 5: Admin website utama hanya menyisakan CMS, SEO, Analytics website, dan pengaturan publik.

## Menu Portal di Admin Website

Menu portal internal di admin website utama tidak ditampilkan sebagai banyak submenu.

Gunakan satu menu:

- Label: `Portal Tim Afkar Land`
- Target default: `https://portal.afkarland.com`
- Konfigurasi env opsional: `VITE_TEAM_PORTAL_URL`

Dengan pola ini, admin website utama tetap bersih dan tidak mencampur kerja internal divisi dengan CMS website publik.

## Ide Subdomain Portal Admin dan Internal

Rekomendasi struktur subdomain:

| Subdomain | Fungsi | Pengguna Utama |
| --- | --- | --- |
| `admin.afkarland.com` | Admin website publik: CMS, SEO, analytics, homepage, artikel, proyek publik. | Admin website / digital marketing. |
| `portal.afkarland.com` | Portal internal utama untuk semua divisi. | Karyawan, HRD, marketing, operasional, finance, direksi. |
| `hrd.afkarland.com` | Bisa menjadi alias atau route khusus HRD di dalam portal. | HRD dan manajemen. |
| `sales.afkarland.com` | Bisa menjadi alias atau route khusus CRM/marketing di dalam portal. | Marketing, sales leader, CS. |
| `direksi.afkarland.com` | Bisa menjadi alias atau route executive dashboard. | Direksi dan direktur utama. |

Prioritas yang disarankan adalah tetap membuat satu aplikasi utama di `portal.afkarland.com`, lalu memisahkan akses berdasarkan role. Subdomain tambahan seperti `hrd`, `sales`, dan `direksi` bisa diarahkan ke route yang sama dengan guard role, misalnya `/hrd`, `/sales`, dan `/executive`.

## Konsep Portal Tim Afkar Land

Halaman awal portal:

- Ringkasan tugas personal.
- Pengumuman internal.
- Shortcut sesuai divisi.
- Notifikasi approval dan follow-up.
- Profil user, role, dan divisi.

Modul tahap awal:

| Modul | Isi |
| --- | --- |
| Dashboard Personal | Agenda, tugas, notifikasi, aktivitas terbaru. |
| CRM Marketing | Leads, pipeline, follow-up, assignment, histori prospek. |
| HRD | Lamaran, kandidat, data karyawan, absensi, dokumen HR. |
| Project Operations | Siteplan, status unit, progres proyek, dokumentasi lapangan. |
| Finance | Rekap pemasukan/pengeluaran, approval, laporan per proyek. |
| Executive Dashboard | KPI lintas divisi, performa proyek, ringkasan finance, approval final. |

Role access control minimal:

- `operator`: akses semua modul dan konfigurasi.
- `directur`: executive dashboard, finance summary, project summary, approval.
- `manager`: modul divisi dan laporan tim.
- `hrd`: HRD, kandidat, karyawan, KPI SDM.
- `marketing`: CRM, leads, follow-up, campaign tools.
- `admin keuangan`: finance, transaksi, laporan, approval pembayaran.
- `teknik`: siteplan, unit, progres proyek, dokumentasi.
- `team`: dashboard personal dan data sesuai divisi.

Catatan teknis awal:

- Gunakan Firebase Auth custom claims atau koleksi `users` untuk mapping role.
- Pisahkan koleksi Firestore internal dari koleksi CMS publik.
- Semua route internal wajib dilindungi role guard.
- Audit log diperlukan untuk perubahan data sensitif seperti finance, status unit, dan approval.
- Admin website publik cukup menyediakan satu tombol/menu menuju `portal.afkarland.com`.

## Modul Google Tools Marketing

Google tools untuk marketing sebaiknya tidak dicampur dengan SEO teknis website utama.

Tetap di admin web utama:

- Google Search Console verification.
- Google Analytics Measurement ID untuk website publik.
- Google Tag Manager container untuk website publik.
- SEO meta tag, canonical, robots, OG image.

Pindah ke portal marketing:

- Tracking campaign marketing.
- UTM builder.
- Integrasi Google Sheets untuk lead pipeline.
- Dashboard performa iklan.
- Export/import data leads.
- Follow-up automation dan assignment marketing.

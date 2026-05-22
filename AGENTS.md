# AGENTS.md — AfkarGroupIndonesia
<!-- version: 1.0.0 -->
<!-- Last updated: 2026-05-22 -->

Last reviewed: 2026-05-22

**Project:** AfkarGroupIndonesia · **App:** AFKAR LAND · **Environment:** dev · **Maintainer:** repository maintainers (see GitHub)

---

## Scope

| Boundary | Rule |
|----------|------|
| **Reads** | `src/`, `public/`, `src/components/`, `src/pages/`, `src/hooks/`, `src/context/`, `src/services/`, `src/utils/`, `src/config/`, `.env.example` |
| **Writes** | Hanya path yang dibutuhkan oleh perubahan yang sedang dikerjakan; jaga diff tetap minimal. Update `package.json` dan lockfile ketika dependensi berubah. |
| **Executes** | `npm`, `npx`, `node` di root project; `vite`, `firebase` CLI untuk keperluan dev/build/deploy. |
| **Off-limits** | File `.env` asli / Firebase credentials, production Firestore rules langsung dari terminal, destructive Firestore ops tanpa konfirmasi eksplisit, penghapusan rute admin yang masih aktif. |

---

## Stack Teknologi

| Layer | Teknologi |
|-------|-----------|
| **UI Framework** | React 18 (functional components, hooks) |
| **Styling** | Tailwind CSS v3 (utility-first, class-based) |
| **Router** | React Router DOM v6 (`Link`, `useNavigate`, `Outlet`) |
| **Backend/DB** | Firebase Firestore (realtime `onSnapshot`, `writeBatch`, `updateDoc`) |
| **Auth** | Firebase Authentication |
| **Icons** | `react-icons/fi` (Feather Icons) + `lucide-react` |
| **Toast** | `react-hot-toast` |
| **Animasi** | GSAP via internal adapter `src/lib/gsapMotion.jsx` *(lihat DESIGN.md)* |
| **Build Tool** | Vite |

---

## Model Configuration

- **Primary:** Gunakan named model (contoh: `claude-sonnet-4-20250514`). Hindari `Auto` atau unversioned `latest` ketika reproducibility penting.
- **Catatan:** Semua data real-time diambil langsung dari Firestore via `onSnapshot` — tidak ada LLM di pipeline data.

---

## Execution Sequence (complex tasks)

Untuk pekerjaan multi-step, nyatakan di awal:

1. Rules mana dalam file ini yang berlaku (dan Sign terkait jika ada).
2. Batas **Scope** yang aktif saat ini.
3. **Validation commands** yang akan dijalankan:
   - `npm run dev` — pastikan dev server berjalan tanpa error
   - `npm run build` — pastikan build produksi clean (tidak ada TypeScript/ESLint error jika dikonfigurasi)
   - Uji manual di browser untuk komponen baru

Pada thread panjang, *"Remember: apply all AGENTS.md rules"* me-refresh instruksi ini.

---

## Context Budget

Gunakan referensi berikut untuk navigasi cepat:

- Komponen UI baru → baca `src/components/ui/` dulu sebelum membuat yang baru (hindari duplikasi).
- Semua akses Firestore → hanya lewat `src/services/` atau `src/hooks/`, **bukan** langsung di dalam komponen halaman.
- Routing → semua route didefinisikan terpusat (cek `App.jsx` atau file router utama).
- Animasi & Parallax → baca **DESIGN.md § Sistem Animasi** sebelum mengimplementasikan efek baru.

---

## Konvensi Kode

### Struktur Komponen

```jsx
// Urutan import yang benar:
// 1. React & hooks
// 2. Firebase imports
// 3. React Router
// 4. Komponen UI internal
// 5. Icons (react-icons/fi, lucide-react)
// 6. Utilities & services
// 7. Toast
```

### Naming Conventions

| Entitas | Konvensi | Contoh |
|---------|----------|--------|
| Komponen | PascalCase | `NotifItem`, `ManageLeads` |
| Hooks custom | `use` + PascalCase | `useNotifications`, `useAuth` |
| Service functions | camelCase | `getLeads`, `updateBookingStatus` |
| Firestore collections | lowercase plural | `leads`, `messages`, `bookings` |
| Tailwind class groups | urut: layout → spacing → color → effect | `flex items-center gap-3 px-4 py-2 bg-gray-900 rounded-xl` |

### Firestore Rules

- Setiap koleksi Firestore yang diakses **harus** memiliki field `createdAt` (timestamp) untuk ordering.
- Field `notifRead` dan `notifHidden` adalah soft-delete pattern — **jangan** hardDelete data notifikasi, gunakan `notifHidden: true`.
- Semua write batch harus menggunakan `writeBatch` dari Firestore untuk atomisitas.

---

## Always Do

- **WAJIB cek komponen yang sudah ada** di `src/components/ui/` sebelum membuat komponen baru yang serupa. DRY principle.
- **WAJIB gunakan `react-hot-toast`** untuk semua feedback aksi user (success/error), konsisten dengan pola yang ada.
- **WAJIB wrap Firestore listeners** dalam `useEffect` dengan cleanup `unsubscribe` untuk mencegah memory leak.
- **WAJIB gunakan Tailwind utility classes** — jangan inline styles kecuali untuk nilai dinamis yang tidak bisa dicapai dengan Tailwind (contoh: `style={{ height: scrollProgress + '%' }}`).
- **Sebelum menambah animasi baru**, baca `DESIGN.md § Sistem Animasi` untuk memastikan konsistensi dengan design system.
- **Sebelum menghapus atau mengubah route admin**, konfirmasi ke maintainer karena ada cross-link antar halaman (contoh: booking redirect ke siteplan).

## Never Do

- **JANGAN** akses Firestore langsung dari komponen halaman — selalu lewat hooks atau services.
- **JANGAN** hardcode Firebase credentials di luar `src/config/firebaseConfig.js`.
- **JANGAN** gunakan `deleteDoc` untuk notifikasi — gunakan soft-delete (`notifHidden: true`).
- **JANGAN** buat komponen baru dengan nama yang sama tapi path berbeda — cek dulu seluruh `src/components/`.
- **JANGAN** gunakan `import *` dari Firebase — selalu named imports untuk tree-shaking optimal.
- **JANGAN** tambah library animasi baru selain GSAP tanpa diskusi — lihat DESIGN.md untuk daftar resmi.

---

## Firestore Collections

| Collection | Keterangan | Field Utama |
|------------|------------|-------------|
| `leads` | Calon pembeli/penyewa yang tertarik | `nama`, `proyek`, `createdAt`, `notifRead`, `notifHidden` |
| `messages` | Pesan dari form kontak publik | `nama`, `pesan`, `createdAt`, `notifRead`, `notifHidden` |
| `applications` | Lamaran kerja dari halaman karir | `nama`, `posisi`, `createdAt`, `notifRead`, `notifHidden` |
| `bookings` | Booking unit properti | `nama`, `unit`, `blok`, `createdAt`, `notifRead`, `notifHidden` |

---

## Admin Routes

| Path | Halaman | Catatan |
|------|---------|---------|
| `/admin/leads` | Kelola lead masuk | — |
| `/admin/messages` | Kelola pesan masuk | — |
| `/admin/applications` | Kelola lamaran kerja | — |
| `/admin/siteplan` | Kelola siteplan & booking unit | Route `/admin/bookings` dihapus → redirect ke sini |
| `/admin/notifications` | Pusat notifikasi realtime | File: `ManageNotifications.jsx` |

---

## Repo Reference

### Struktur Direktori

```
AfkarGroupIndonesia/
├── public/
│   └── images/              # Aset gambar statis (properti, hero, dll)
├── src/
│   ├── assets/              # Aset yang di-import langsung (logo, SVG, dll)
│   ├── components/
│   │   ├── layout/          # Sidebar, Navbar, Footer, Layout wrapper
│   │   └── ui/              # Komponen reusable (Button, Badge, Modal, Card, dll)
│   ├── config/
│   │   └── firebaseConfig.js  # Firebase init — JANGAN edit credentials di sini
│   ├── context/             # React Context (AuthContext, NotifContext, dll)
│   ├── hooks/               # Custom hooks (useAuth, useLeads, dll)
│   ├── pages/
│   │   ├── admin/           # Semua halaman admin panel
│   │   └── [public pages]   # Landing, About, Career, Contact, dll
│   ├── services/            # Fungsi Firestore abstracted (CRUD operations)
│   └── utils/               # Helper functions (formatWaktu, formatRupiah, dll)
├── .env                     # Credentials Firebase (OFF-LIMITS untuk agent)
├── .env.example             # Template variabel environment
├── package.json
└── vite.config.js
```

### Running Services

```bash
npm run dev          # Vite dev server (hot reload)
npm run build        # Build produksi
npm run preview      # Preview build produksi lokal
firebase deploy      # Deploy ke Firebase Hosting (perlu auth)
```

### Gotchas

- **Firestore `onSnapshot` + multiple collections**: gabungkan dengan pattern `allNotifs[src.id]` dan merge+sort setelah setiap update — lihat `ManageNotifications.jsx` sebagai referensi.
- **`writeBatch` limit**: Firestore batch maksimal 500 operasi per batch. Untuk operasi massal (contoh: mark all read), gunakan `Promise.all` untuk volume kecil (<50), atau pecah batch untuk volume besar.
- **Tailwind purge**: pastikan class dinamis yang dibangun dengan string concatenation di-safelist di `tailwind.config.js` — Tailwind purger tidak bisa mendeteksi class dari template literals.
- **react-icons vs lucide-react**: keduanya digunakan — `FiXxx` dari `react-icons/fi`, `CalendarCheck` dll dari `lucide-react`. Jangan mix-use untuk ikon yang sama.
- **Animasi Parallax**: gunakan `will-change: transform` dengan hati-hati — terlalu banyak elemen dengan property ini bisa menurunkan performa. Lihat DESIGN.md untuk panduan.
- **Firebase Auth guard**: semua route `/admin/*` harus dilindungi oleh auth guard — jangan deploy route admin baru tanpa proteksi auth.

---

## Changelog

| Tanggal | Versi | Perubahan |
|---------|-------|-----------|
| 2026-05-22 | 1.0.0 | Initial AGENTS.md — mendokumentasikan stack React+Firebase+Tailwind, konvensi kode, Firestore collections, admin routes, dan panduan animasi baru. |

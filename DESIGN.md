# DESIGN.md — AfkarGroupIndonesia / AFKAR LAND
<!-- version: 1.0.0 -->
<!-- Last updated: 2026-05-22 -->

Panduan desain visual dan sistem animasi untuk platform properti **AFKAR LAND**.
Dokumen ini menjadi sumber kebenaran tunggal untuk semua keputusan visual, animasi, dan interaksi.

---

## Daftar Isi

1. [Filosofi Desain](#1-filosofi-desain)
2. [Palet Warna](#2-palet-warna)
3. [Tipografi](#3-tipografi)
4. [Spacing & Layout](#4-spacing--layout)
5. [Komponen UI](#5-komponen-ui)
6. [Sistem Animasi](#6-sistem-animasi)
7. [Parallax & Scroll Effects *(Baru)*](#7-parallax--scroll-effects)
8. [Micro-interactions *(Baru)*](#8-micro-interactions)
9. [Page Transitions *(Baru)*](#9-page-transitions)
10. [Panduan Performa Animasi](#10-panduan-performa-animasi)
11. [Aksesibilitas Animasi](#11-aksesibilitas-animasi)
12. [Tools & Dependencies Resmi](#12-tools--dependencies-resmi)

---

## 1. Filosofi Desain

AFKAR LAND menampilkan properti premium Indonesia. Desain harus mencerminkan:

- **Kepercayaan** — tipografi tegas, whitespace luas, warna netral yang profesional.
- **Premium** — animasi halus dan proporsional, tidak berlebihan.
- **Lokalitas** — konten dalam Bahasa Indonesia, format angka Rupiah, format tanggal `id-ID`.
- **Kecepatan** — performa nomor satu; animasi tidak boleh memblokir interaksi utama.

> **Aturan Emas Animasi**: Jika sebuah animasi tidak membuat pengguna merasa lebih terarah atau lebih puas, hapus saja.

---

## 2. Palet Warna

### Warna Dasar (Tailwind Default)

| Token | Kelas Tailwind | Nilai Hex | Penggunaan |
|-------|---------------|-----------|------------|
| **Primary** | `bg-gray-900` / `text-gray-900` | `#111827` | CTA utama, header, aksen tegas |
| **Secondary** | `bg-gray-100` / `text-gray-500` | `#F3F4F6` / `#6B7280` | Background card, teks sekunder |
| **White** | `bg-white` | `#FFFFFF` | Card background, modal |
| **Border** | `border-gray-100` / `border-gray-200` | `#F3F4F6` / `#E5E7EB` | Outline elemen |

### Warna Aksen per Kategori

| Kategori | Background | Text | Badge/Dot | Penggunaan |
|----------|-----------|------|-----------|------------|
| **Lead** | `bg-blue-50` | `text-blue-600` | `bg-blue-500` | Notif lead baru |
| **Pesan** | `bg-amber-50` | `text-amber-600` | `bg-amber-500` | Notif pesan masuk |
| **Lamaran** | `bg-purple-50` | `text-purple-600` | `bg-purple-500` | Notif lamaran kerja |
| **Booking** | `bg-emerald-50` | `text-emerald-600` | `bg-emerald-500` | Notif booking unit |
| **Error/Hapus** | `bg-red-50` | `text-red-400` | `bg-red-500` | Aksi hapus, badge unread |
| **Success** | `bg-emerald-50` | `text-emerald-600` | — | Aksi berhasil |

### Warna Gradien (Untuk Hero & Section Besar)

```css
/* Gradien Premium — gunakan di hero section & parallax layer */
background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%);

/* Gradien Overlay Gambar */
background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%);

/* Gradien Aksen Gold (Properti Premium) */
background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
```

---

## 3. Tipografi

### Font Family

```css
/* Heading — serif premium untuk kesan properti mewah */
font-family: 'Playfair Display', Georgia, serif;    /* class: font-heading */

/* Body — sans-serif bersih dan mudah dibaca */
font-family: 'Inter', system-ui, sans-serif;        /* class: font-sans (default) */
```

### Skala Tipografi

| Elemen | Kelas Tailwind | Keterangan |
|--------|---------------|-----------|
| Page Title | `text-3xl font-heading font-bold` | H1 di setiap halaman admin |
| Section Title | `text-xl font-heading font-semibold` | Judul section/card |
| Card Title | `text-base font-bold text-gray-900` | Judul item di list/card |
| Body | `text-sm text-gray-700` | Teks utama konten |
| Caption | `text-xs text-gray-400` | Timestamp, metadata |
| Badge/Label | `text-[10px] font-extrabold uppercase tracking-wider` | Label kategori notif |

### Aturan Tipografi

- Gunakan `font-heading` (Playfair Display) **hanya** untuk judul, bukan body teks.
- Jaga line-height dengan `leading-snug` untuk teks pendek, `leading-relaxed` untuk paragraf panjang.
- Warna teks tidak lebih dari 3 level per halaman: `gray-900` (utama), `gray-600` (sekunder), `gray-400` (tersier).

---

## 4. Spacing & Layout

### Grid System

```jsx
// Admin panel — layout dengan sidebar
<div className="flex h-screen">
  <Sidebar />  {/* w-64 fixed */}
  <main className="flex-1 overflow-auto p-6 space-y-6">
    {/* konten */}
  </main>
</div>

// Grid stats — selalu gunakan responsive grid
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

// Grid properti — kartu properti
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Border Radius

| Ukuran | Kelas | Penggunaan |
|--------|-------|-----------|
| Small | `rounded-lg` | Button kecil, badge |
| Medium | `rounded-xl` | Card, icon wrapper, input |
| Large | `rounded-2xl` | Card besar, modal, panel |
| Full | `rounded-full` | Avatar, dot indicator |

### Shadow

| Level | Kelas | Penggunaan |
|-------|-------|-----------|
| Subtle | `shadow-sm` | Card default |
| Medium | `shadow-md` | Card hover state, dropdown |
| Elevated | `shadow-lg` | Modal, sidebar overlay |

---

## 5. Komponen UI

### Button

```jsx
// Primary — aksi utama
<button className="px-4 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors">
  Simpan

// Secondary — aksi sekunder
<button className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
  Batal

// Danger — aksi destruktif
<button className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-colors">
  <FiTrash2 size={13}/>
</button>
```

### Card

```jsx
// Card standar
<div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">

// Card dengan hover effect (untuk list yang bisa diklik)
<div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm
  hover:shadow-md hover:border-gray-200 transition-all cursor-pointer">

// Card notifikasi unread
<div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 transition-all">
```

### Badge / Indicator

```jsx
// Badge kategori
<span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
  Lead Baru
</span>

// Dot unread (merah, pulse)
<span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"/>

// Count badge (pada icon)
<span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white
  text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
  {count}
</span>
```

### Icon Wrapper

```jsx
// Icon dalam kotak
<div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
  <FiUsers size={18}/>
</div>

// Icon besar (page header)
<div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
  <FiBell size={22} className="text-white"/>
</div>
```

---

## 6. Sistem Animasi

### Prinsip Animasi

1. **Purposeful** — setiap animasi memiliki tujuan: mengarahkan perhatian, menunjukkan hierarki, atau memberi feedback.
2. **Subtle** — durasi 150–400ms untuk transisi UI, 600–1200ms untuk entrance animations.
3. **Consistent** — gunakan easing yang sama di seluruh aplikasi: `ease-out` untuk masuk, `ease-in-out` untuk loop.
4. **Performant** — hanya animasi `transform` dan `opacity` di GPU; hindari animasi `width`, `height`, `margin`.

### Tailwind Transitions (Built-in)

```jsx
// Transisi warna (hover states)
className="transition-colors duration-150"

// Transisi semua property
className="transition-all duration-200"

// Opacity (show/hide)
className="transition-opacity duration-300"

// Pulse (indicator aktif)
className="animate-pulse"

// Spin (loading)
className="animate-spin"
```

### Native Animation Adapter - Pola Standar

Animasi publik sekarang menggunakan CSS dan Web Animations API. Import lama `framer-motion` tetap diarahkan oleh `vite.config.js` ke adapter internal `src/lib/gsapMotion.jsx`, tetapi adapter tersebut tidak membawa runtime GSAP. Kode baru sebaiknya memakai CSS transition/keyframes atau adapter internal tersebut.

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// ── Fade In Up (entrance element) ──────────────────────────────
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

<motion.div {...fadeInUp}>
  <CardKomponen />
</motion.div>

// ── Stagger List (list item masuk berurutan) ────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

<motion.ul variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li key={item.id} variants={itemVariants}>
      <ItemKomponen data={item} />
    </motion.li>
  ))}
</motion.ul>

// ── AnimatePresence (mount/unmount) ────────────────────────────
<AnimatePresence mode="wait">
  {isOpen && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
    >
      <Modal />
    </motion.div>
  )}
</AnimatePresence>

// ── Hover Card ─────────────────────────────────────────────────
<motion.div
  whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
  transition={{ duration: 0.2 }}
>
  <PropertyCard />
</motion.div>
```

---

## 7. Parallax & Scroll Effects

### Instalasi

Tidak perlu dependency animasi tambahan untuk halaman publik.

### Setup

Tidak perlu provider parallax tambahan. Hindari scroll-scrub/parallax di first viewport; gunakan CSS transform/opacity kecil dan matikan efek berat di mobile atau `prefers-reduced-motion`.

### Pola Parallax Standar

#### Hero Section dengan Latar Bergerak

```jsx
// Gunakan CSS keyframes atau adapter native untuk reveal ringan.

// ── Hero Background Parallax ───────────────────────────────────
// Gambar latar bergerak lebih lambat dari konten (depth effect)
export function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Layer 1: Background statis dengan entrance ringan */}
      <div className="absolute inset-0 animate-[afkar-hero-image_900ms_cubic-bezier(.22,1,.36,1)_both]">
        <img
          src="/images/hero-bg.jpg"
          alt="AFKAR LAND"
          className="w-full h-[120%] object-cover"
        />
        {/* Overlay gradien */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
      </div>

      {/* Layer 2: Konten (kecepatan normal) */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
        <motion.h1
          className="text-5xl md:text-7xl font-heading font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          AFKAR LAND
        </motion.h1>
        <motion.p
          className="text-xl text-white/80 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Properti Premium di Jantung Indonesia
        </motion.p>
      </div>
    </section>
  );
}
```

#### Section Properti dengan Parallax Multi-Layer

```jsx
// ── Multi-layer parallax untuk section properti ────────────────
export function PropertySection() {
  return (
    <section className="relative py-24 overflow-hidden bg-gray-50">
      {/* Elemen dekoratif melayang */}
      <div data-parallax-speed="5" className="absolute top-10 right-10 opacity-10 pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-blue-500 blur-3xl" />
      </div>
      <div data-parallax-speed="-5" className="absolute bottom-10 left-10 opacity-10 pointer-events-none">
        <div className="w-48 h-48 rounded-full bg-amber-500 blur-3xl" />
      </div>

      {/* Konten utama */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionTitle />
        <PropertyGrid />
      </div>
    </section>
  );
}
```

#### Scroll-Triggered Reveal (CSS + IntersectionObserver)

```jsx
import { useRef } from 'react';

// ── Reveal saat elemen masuk viewport ─────────────────────────
function RevealOnScroll({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// Penggunaan
<RevealOnScroll delay={0.1}>
  <PropertyCard data={property} />
</RevealOnScroll>
```

#### Parallax Number Counter (Statistik)

```jsx
import { useMotionValue, useSpring, useInView, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

// ── Angka yang naik saat terlihat di viewport ──────────────────
function AnimatedCounter({ target, suffix = '', label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1500, bounce: 0 });

  useEffect(() => {
    if (isInView) motionValue.set(target);
  }, [isInView, motionValue, target]);

  return (
    <div ref={ref} className="text-center">
      <motion.span className="text-5xl font-heading font-bold text-gray-900">
        {springValue}
      </motion.span>
      <span className="text-5xl font-heading font-bold text-amber-500">{suffix}</span>
      <p className="text-sm text-gray-500 mt-2 font-medium">{label}</p>
    </div>
  );
}

// Penggunaan di section statistik
<AnimatedCounter target={500} suffix="+" label="Unit Terjual" />
<AnimatedCounter target={12} suffix=" Proyek" label="Proyek Aktif" />
<AnimatedCounter target={98} suffix="%" label="Kepuasan Pembeli" />
```

#### Horizontal Scroll Gallery (Properti)

```jsx
import { useRef } from 'react';
import { motion } from 'framer-motion';

// ── Gallery properti dengan scroll horizontal halus ────────────
export function PropertyGallery({ properties }) {
  const containerRef = useRef(null);

  return (
    <div className="overflow-hidden">
      <motion.div
        ref={containerRef}
        className="flex gap-6 px-6"
        drag="x"
        dragConstraints={containerRef}
        style={{ cursor: 'grab' }}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {properties.map((prop, i) => (
          <motion.div
            key={prop.id}
            className="min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm shrink-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6, shadow: 'lg' }}
          >
            <PropertyCard data={prop} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
```

---

## 8. Micro-interactions

### Loading Skeleton

```jsx
// ── Skeleton loader konsisten dengan pola ManageNotifications ──
function SkeletonCard() {
  return (
    <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
  );
}

// Skeleton dengan shimmer effect (lebih premium)
function ShimmerSkeleton({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-gray-100 rounded-2xl ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
```

### Button dengan Feedback

```jsx
// ── Button dengan loading state ────────────────────────────────
function ActionButton({ onClick, loading, children }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileTap={{ scale: 0.97 }}
      className="px-4 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl
        hover:bg-gray-800 transition-colors disabled:opacity-60"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
          Menyimpan...
        </span>
      ) : children}
    </motion.button>
  );
}
```

### Toast Notification dengan Animasi

```jsx
import toast from 'react-hot-toast';

// Konfigurasi toast global di App.jsx
import { Toaster } from 'react-hot-toast';

<Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      borderRadius: '12px',
      background: '#111827',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '600',
    },
    success: {
      iconTheme: { primary: '#10b981', secondary: '#fff' }
    },
    error: {
      iconTheme: { primary: '#ef4444', secondary: '#fff' }
    }
  }}
/>
```

### Notification Bell Shake

```jsx
// ── Animasi bell bergetar saat ada notif baru ──────────────────
const bellVariants = {
  idle: { rotate: 0 },
  ring: {
    rotate: [0, -15, 15, -10, 10, -5, 5, 0],
    transition: { duration: 0.6, ease: 'easeInOut' }
  }
};

function NotificationBell({ hasNew }) {
  return (
    <motion.div
      variants={bellVariants}
      animate={hasNew ? 'ring' : 'idle'}
      key={hasNew ? 'ring' : 'idle'}
    >
      <FiBell size={22} />
    </motion.div>
  );
}
```

---

## 9. Page Transitions

### Layout Wrapper dengan Transisi

```jsx
// ── Gunakan ini sebagai wrapper di setiap halaman ──────────────
import { motion } from 'framer-motion';

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.25, ease: 'easeOut' }
};

export function PageWrapper({ children }) {
  return (
    <motion.div
      {...pageTransition}
      className="space-y-6"
    >
      {children}
    </motion.div>
  );
}

// Penggunaan di setiap halaman admin
export default function ManageLeads() {
  return (
    <PageWrapper>
      {/* konten halaman */}
    </PageWrapper>
  );
}
```

### Route-level Transition (dengan AnimatePresence)

```jsx
// App.jsx — wrap outlet dengan AnimatePresence
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Outlet key={location.pathname} />
    </AnimatePresence>
  );
}
```

---

## 10. Panduan Performa Animasi

### Yang Boleh Dianimasikan (GPU-accelerated)

```css
/* ✅ Aman — dihandle GPU */
transform: translateX() translateY() scale() rotate()
opacity
filter: blur() brightness()
```

### Yang Harus Dihindari dalam Animasi

```css
/* ❌ Hindari — menyebabkan layout reflow */
width, height, padding, margin, top, left, right, bottom
font-size, border-width
```

### Batasan Penggunaan Parallax

| Situasi | Aturan |
|---------|--------|
| Jumlah elemen parallax per halaman | Maksimal 5 elemen aktif |
| Gambar dalam parallax | Gunakan `loading="lazy"` + `will-change: transform` |
| Mobile | Nonaktifkan parallax di layar < 768px melalui guard `matchMedia`/reduced-motion |
| Admin panel | **Tidak perlu parallax** — reserved untuk halaman publik saja |

```jsx
useEffect(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  if (reduceMotion || isMobile) return undefined;

  // Register lightweight IntersectionObserver here if needed.
  return undefined;
}, []);
```

### Reduced Motion

```jsx
// ── Respect prefers-reduced-motion ─────────────────────────────
import { useReducedMotion } from 'framer-motion';

function AnimatedCard({ children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 11. Aksesibilitas Animasi

- **Selalu** sertakan `useReducedMotion()` dari Framer Motion — pengguna dengan vestibular disorder bisa menyakiti oleh gerakan berlebih.
- Parallax **harus** memiliki fallback statis yang terlihat baik tanpa gerakan.
- Jangan gunakan animasi untuk menyampaikan informasi penting — selalu sertakan teks atau warna sebagai alternatif.
- `animate-pulse` pada badge unread sudah cukup — jangan tambah gerakan lebih pada elemen kecil.
- Durasi animasi halaman: tidak lebih dari 300ms agar tidak terasa lambat.

---

## 12. Tools & Dependencies Resmi

### Dependencies yang Sudah Ada

| Package | Versi | Penggunaan |
|---------|-------|-----------|
| `react` | 19.x | UI framework |
| `react-router-dom` | 7.x | Routing |
| `firebase` | 12.x | Backend & Auth |
| `tailwindcss` | 4.x | Styling |
| `react-icons` | latest | Feather Icons (`fi`) |
| `lucide-react` | latest | Icon tambahan |
| `react-hot-toast` | latest | Toast notifikasi |

### Dependencies Animasi Resmi

| Package | Versi | Penggunaan | Install |
|---------|-------|-----------|---------|
| CSS keyframes / Web Animations API | native | Animasi komponen, page transitions, micro-interactions ringan | bawaan browser |

### Dependencies yang Tidak Boleh Ditambahkan

| Package | Alasan |
|---------|--------|
| GSAP Club plugins berbayar | Hindari lisensi tertutup tanpa keputusan bisnis eksplisit |
| `anime.js` | Redundan untuk kebutuhan reveal/transition ringan |
| `AOS` (Animate On Scroll) | Gunakan CSS + IntersectionObserver jika perlu |
| Library CSS-in-JS (styled-components, emotion) | Proyek sudah full Tailwind — jangan mix |
| `react-spring` | Redundan dengan adapter native |

### Konfigurasi Vite untuk Performa Animasi

```js
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Adapter framer-motion diarahkan ke native Web Animations API lewat vite resolve.alias
          'firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
        }
      }
    }
  }
}
```

---

## Changelog

| Tanggal | Versi | Perubahan |
|---------|-------|-----------|
| 2026-05-22 | 1.0.0 | Initial DESIGN.md — mendokumentasikan design system existing (warna, tipografi, komponen) dan menambahkan sistem animasi baru: Framer Motion + react-scroll-parallax, parallax patterns, micro-interactions, page transitions, panduan performa & aksesibilitas. |

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

// ============================================================
// LOGIKA: Loader Premium AFKAR LAND — Cinematic Edition
// Fitur baru:
//   1. Animated counter (0% → 100%) smooth
//   2. Partikel melayang random di background
//   3. Rotating ring di belakang logo
//   4. Morphing shimmer text AFKAR LAND
//   5. Staggered status text ("Memuat data...", "Menghubungkan...", dst)
//   6. Cinematic blur+scale exit transition
// Built with Webapp GASP Builder Era v2.0 by @damarmahendra
// ============================================================

// LOGIKA: Data partikel — posisi & delay random, digenerate sekali saat mount
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x:     Math.random() * 100,
  y:     Math.random() * 100,
  size:  Math.random() * 3 + 1.5,
  dur:   Math.random() * 6 + 5,
  delay: Math.random() * 4,
  color: i % 3 === 0 ? '#DC2626' : i % 3 === 1 ? '#F59E0B' : '#e5e7eb',
  opacity: Math.random() * 0.35 + 0.08,
}));

// LOGIKA: Urutan teks status yang berganti otomatis
const STATUS_TEXTS = [
  'Menghubungkan server...',
  'Memuat data proyek...',
  'Menyiapkan dashboard...',
  'Hampir selesai...',
  'Selamat datang!',
];

// LOGIKA: Komponen counter angka smooth via framer-motion useMotionValue
function AnimatedCounter({ target }) {
  const count   = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.on('change', v => setDisplay(v));
    return unsub;
  }, [rounded]);

  useEffect(() => {
    const ctrl = animate(count, target, { duration: 2.2, ease: [0.16, 1, 0.3, 1] });
    return ctrl.stop;
  }, [target]);

  return <span>{display}</span>;
}

// LOGIKA: Komponen satu partikel melayang
function Particle({ p }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left:     `${p.x}%`,
        top:      `${p.y}%`,
        width:    p.size,
        height:   p.size,
        borderRadius: '50%',
        background: p.color,
        opacity:  p.opacity,
        pointerEvents: 'none',
      }}
      animate={{
        y:       [0, -28, 0, 18, 0],
        x:       [0, 12, -8, 4, 0],
        opacity: [p.opacity, p.opacity * 2.5, p.opacity, p.opacity * 1.8, p.opacity],
        scale:   [1, 1.4, 0.8, 1.2, 1],
      }}
      transition={{
        duration: p.dur,
        delay:    p.delay,
        repeat:   Infinity,
        ease:     'easeInOut',
      }}
    />
  );
}

export default function Loader() {
  const [progress,    setProgress]    = useState(0);
  const [phase,       setPhase]       = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  // LOGIKA: Fase loading:
  //   0 → logo masuk
  //   1 → tagline + ornamen
  //   2 → progress bar berjalan
  //   3 → selesai (exit trigger dari parent)
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => {
      let p = 0;
      const iv = setInterval(() => {
        p += Math.random() * 14 + 4;
        if (p >= 100) {
          p = 100;
          clearInterval(iv);
          setTimeout(() => setPhase(3), 300);
        }
        setProgress(Math.min(p, 100));
      }, 110);
    }, 1500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // LOGIKA: Ganti teks status setiap ~600ms seiring progress
  useEffect(() => {
    if (phase < 2) return;
    const idx = Math.min(
      Math.floor((progress / 100) * STATUS_TEXTS.length),
      STATUS_TEXTS.length - 1
    );
    setStatusIndex(idx);
  }, [progress, phase]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale:  1.06,
        filter: 'blur(16px)',
        transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
      }}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         9999,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        background:     '#ffffff',
        overflow:       'hidden',
      }}
    >

      {/* ══════════════════════════════════════════
          LAYER 1: PARTIKEL MELAYANG
      ══════════════════════════════════════════ */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {PARTICLES.map(p => <Particle key={p.id} p={p} />)}
      </div>

      {/* ══════════════════════════════════════════
          LAYER 2: GLOW AMBIENT
      ══════════════════════════════════════════ */}
      {/* Glow merah kiri bawah */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.14, scale: 1 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
        style={{
          position: 'absolute', bottom: -140, left: -140,
          width: 420, height: 420,
          background: '#DC2626',
          borderRadius: '50%',
          filter: 'blur(110px)',
          pointerEvents: 'none',
        }}
      />
      {/* Glow amber kanan atas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.10, scale: 1 }}
        transition={{ duration: 2.8, ease: 'easeOut', delay: 0.3 }}
        style={{
          position: 'absolute', top: -100, right: -100,
          width: 360, height: 360,
          background: '#F59E0B',
          borderRadius: '50%',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />
      {/* Glow merah muda pusat — halus */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.04, 0.10, 0.04] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: 280, height: 280,
          background: '#DC2626',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* ══════════════════════════════════════════
          LAYER 3: GRID PATTERN LATAR
      ══════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute', inset: 0,
          opacity: 0.022,
          backgroundImage:
            'linear-gradient(#DC2626 1px, transparent 1px), linear-gradient(90deg, #DC2626 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          pointerEvents: 'none',
        }}
      />

      {/* ══════════════════════════════════════════
          KONTEN UTAMA
      ══════════════════════════════════════════ */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* ── ROTATING RING DI BELAKANG LOGO ── */}
        <div style={{ position: 'relative', marginBottom: 8 }}>

          {/* Ring 1 — merah, lambat */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: -18,
              borderRadius: '50%',
              border: '1.5px dashed rgba(220,38,38,0.25)',
            }}
          />

          {/* Ring 2 — amber, berlawanan arah, lebih cepat */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: -32,
              borderRadius: '50%',
              border: '1px dashed rgba(245,158,11,0.18)',
            }}
          />

          {/* Ring 3 — solid tipis, berputar medium */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: -48,
              borderRadius: '50%',
              border: '0.5px solid rgba(220,38,38,0.08)',
            }}
          />

          {/* Glow pulse di belakang logo */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.07, 0.2] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0,
              margin: 'auto',
              width: 120, height: 120,
              background: '#DC2626',
              borderRadius: '50%',
              filter: 'blur(28px)',
            }}
          />

          {/* ── LOGO ── */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.75 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <img
              src="/images/LogoAfkar1.png"
              alt="AFKAR LAND"
              style={{ width: 140, height: 140, objectFit: 'contain', position: 'relative', zIndex: 1 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </motion.div>
        </div>

        {/* ── NAMA BRAND — stagger per huruf ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginTop: 8 }}
        >
          {/* LOGIKA: Tiap karakter muncul dengan stagger halus */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
            {'AFKAR'.split('').map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                style={{
                  fontSize: 42, fontWeight: 900,
                  letterSpacing: '0.18em', color: '#111827',
                  lineHeight: 1, fontFamily: 'inherit',
                }}
              >
                {ch}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              style={{ display: 'inline-block', width: 10 }}
            />
            {'LAND'.split('').map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.82 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                style={{
                  fontSize: 42, fontWeight: 900,
                  letterSpacing: '0.18em', color: '#DC2626',
                  lineHeight: 1, fontFamily: 'inherit',
                }}
              >
                {ch}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* ── TAGLINE ── */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 8 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            marginTop: 10, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.42em', color: '#9ca3af',
            textTransform: 'uppercase',
          }}
        >
          Developer Properti Syariah
        </motion.p>

        {/* ── ORNAMEN GARIS + DIAMOND ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
          style={{
            marginTop: 18,
            display: 'flex', alignItems: 'center', gap: 10,
            transformOrigin: 'center',
          }}
        >
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to right, transparent, #fca5a5)' }} />
          {/* Diamond merah */}
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            style={{
              width: 6, height: 6,
              background: '#DC2626',
              transform: 'rotate(45deg)',
              flexShrink: 0,
            }}
          />
          <div style={{ width: 56, height: 1, background: '#fecaca' }} />
          {/* Diamond amber */}
          <motion.div
            animate={{ rotate: [0, -180, -360] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            style={{
              width: 5, height: 5,
              background: '#F59E0B',
              transform: 'rotate(45deg)',
              flexShrink: 0,
            }}
          />
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to left, transparent, #fde68a)' }} />
        </motion.div>

        {/* ── PROGRESS BAR + COUNTER ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 10 }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: 28, width: 240 }}
        >
          {/* Track */}
          <div style={{
            width: '100%', height: 3,
            background: '#f3f4f6',
            borderRadius: 999, overflow: 'hidden',
          }}>
            {/* LOGIKA: Fill bergerak smooth via CSS transition */}
            <motion.div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #DC2626 0%, #F59E0B 60%, #DC2626 100%)',
                backgroundSize: '200% 100%',
                borderRadius: 999,
                transition: 'width 0.15s ease-out',
              }}
              animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            />
          </div>

          {/* Counter + label status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>

            {/* LOGIKA: Teks status berganti smooth */}
            <AnimatePresence mode="wait">
              <motion.span
                key={statusIndex}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500, letterSpacing: '0.06em' }}
              >
                {STATUS_TEXTS[statusIndex]}
              </motion.span>
            </AnimatePresence>

            {/* Counter smooth */}
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280' }}>
              <AnimatedCounter target={Math.round(progress)} />%
            </span>
          </div>
        </motion.div>

        {/* ── TITIK ANIMASI — muncul sebelum progress bar ── */}
        <AnimatePresence>
          {phase < 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {[0, 1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{
                    scale:   [1, 1.8, 1],
                    opacity: [0.25, 1, 0.25],
                    y:       [0, -5, 0],
                  }}
                  transition={{
                    repeat: Infinity, duration: 1.3,
                    delay: i * 0.18, ease: 'easeInOut',
                  }}
                  style={{
                    width: 6, height: 6,
                    borderRadius: '50%',
                    background: i % 2 === 0 ? '#DC2626' : '#F59E0B',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 0.45 : 0 }}
        transition={{ duration: 1 }}
        style={{
          position: 'absolute', bottom: 28,
          textAlign: 'center',
        }}
      >
        <p style={{
          fontSize: 9, color: '#9ca3af',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}>
          AFKAR GROUP INDONESIA · Sulawesi Selatan
        </p>
      </motion.div>

    </motion.div>
  );
}
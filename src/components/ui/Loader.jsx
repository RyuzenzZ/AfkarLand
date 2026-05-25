import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const BRAND_TEXT = 'AFKAR LAND';
const TAGLINE = 'Developer Property syariah terbaik di Sulawesi';

export default function Loader() {
  const rootRef = useRef(null);
  const logoShellRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const haloRef = useRef(null);
  const sweepRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    const context = gsap.context(() => {
      if (reduceMotion) {
        gsap.set([logoRef.current, titleRef.current, taglineRef.current], {
          autoAlpha: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      const letters = titleRef.current?.querySelectorAll('[data-letter]');
      const whiteLetters = titleRef.current?.querySelectorAll('[data-tone="white"]');
      const redLetters = titleRef.current?.querySelectorAll('[data-tone="red"]');

      gsap.set(rootRef.current, { autoAlpha: 1 });
      gsap.set(logoRef.current, {
        autoAlpha: 0,
        scale: 0.72,
        y: 28,
        filter: 'blur(18px)',
      });
      gsap.set(logoShellRef.current, {
        autoAlpha: 0,
        scale: 0.86,
        boxShadow: '0 0 0 rgba(216,13,13,0)',
      });
      gsap.set(letters, {
        autoAlpha: 0,
        yPercent: 70,
        rotateX: -35,
        filter: 'blur(10px)',
      });
      gsap.set(taglineRef.current, {
        autoAlpha: 0,
        y: 18,
        filter: 'blur(8px)',
      });
      gsap.set(sweepRef.current, { xPercent: -120, opacity: 0 });
      gsap.set(haloRef.current, { scale: 0.82, opacity: 0 });

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      timeline
        .to(haloRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power2.out',
        })
        .to(sweepRef.current, {
          xPercent: 120,
          opacity: 1,
          duration: 1.15,
          ease: 'power4.inOut',
        }, '<')
        .to(logoShellRef.current, {
          autoAlpha: 1,
          scale: 1,
          boxShadow: '0 24px 90px rgba(216,13,13,0.30)',
          duration: 0.75,
        }, '-=0.75')
        .to(logoRef.current, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px) drop-shadow(0 18px 34px rgba(216,13,13,0.38))',
          duration: 0.85,
          ease: 'back.out(1.35)',
        }, '-=0.7')
        .to(letters, {
          autoAlpha: 1,
          yPercent: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.72,
          stagger: 0.045,
        }, '-=0.35')
        .to(taglineRef.current, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.7,
        }, '-=0.2')
        .to(haloRef.current, {
          scale: isMobile ? 1.02 : 1.08,
          opacity: isMobile ? 0.56 : 0.72,
          duration: 1.2,
          ease: 'sine.inOut',
        });

      if (isMobile) return;

      gsap.to(logoShellRef.current, {
        boxShadow: '0 30px 110px rgba(216,13,13,0.44)',
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.4,
      });
      gsap.to(whiteLetters, {
        textShadow: '0 0 28px rgba(255,255,255,0.34)',
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.7,
      });
      gsap.to(redLetters, {
        textShadow: '0 0 34px rgba(216,13,13,0.72)',
        color: '#D80D0D',
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.7,
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.025,
        filter: 'blur(16px)',
        transition: { duration: 0.58, ease: 'easeInOut' },
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#090909] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(216,13,13,0.24),transparent_32%),radial-gradient(circle_at_55%_52%,rgba(255,255,255,0.12),transparent_30%),linear-gradient(135deg,#070707_0%,#111111_48%,#050505_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.32)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.32)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div
        ref={sweepRef}
        className="absolute inset-y-0 left-1/2 w-[42rem] -translate-x-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/18 to-transparent blur-2xl"
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center px-6 text-center">
        <div className="relative mb-8 flex h-40 w-40 items-center justify-center sm:h-44 sm:w-44">
          <div
            ref={haloRef}
            className="absolute inset-0 rounded-full bg-[#D80D0D]/20 blur-3xl"
          />
          <div
            ref={logoShellRef}
            className="absolute inset-4 rounded-full border border-white/10 bg-white/[0.035] backdrop-blur-md"
          />
          <img
            ref={logoRef}
            src="/images/LogoAfkar1.png"
            alt="AFKAR LAND"
            className="relative h-28 w-28 object-contain sm:h-32 sm:w-32"
          />
        </div>

        <h1
          ref={titleRef}
          className="mb-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-4xl font-black leading-none sm:text-6xl"
          aria-label={BRAND_TEXT}
        >
          {BRAND_TEXT.split('').map((char, index) => (
            <span
              key={`${char}-${index}`}
              data-letter
              data-tone={index >= 6 ? 'red' : 'white'}
              className={
                char === ' '
                  ? 'w-2 sm:w-4'
                  : `inline-block ${index >= 6 ? 'text-[#D80D0D]' : 'text-white'}`
              }
              aria-hidden="true"
            >
              {char}
            </span>
          ))}
        </h1>

        <p
          ref={taglineRef}
          className="max-w-md text-sm font-semibold leading-relaxed text-white/80 sm:text-base"
        >
          {TAGLINE}
        </p>
      </div>
    </motion.div>
  );
}

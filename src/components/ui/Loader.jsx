const BRAND_TEXT = 'AFKAR LAND';
const TAGLINE = 'Developer Property syariah terbaik di Sulawesi';

export default function Loader() {
  return (
    <div className="afkar-loader fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#090909] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(216,13,13,0.22),transparent_30%),linear-gradient(135deg,#070707_0%,#111111_48%,#050505_100%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="afkar-loader-sweep absolute inset-y-0 left-1/2 w-[34rem] -translate-x-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/16 to-transparent" />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center px-6 text-center">
        <div className="relative mb-7 flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40">
          <div className="afkar-loader-halo absolute inset-0 rounded-full bg-[#D80D0D]/18" />
          <div className="afkar-loader-shell absolute inset-4 rounded-full border border-white/10 bg-white/[0.04]" />
          <picture>
            <source srcSet="/images/LogoAfkar1.avif" type="image/avif" />
            <source srcSet="/images/LogoAfkar1.webp" type="image/webp" />
            <img
              src="/images/LogoAfkar1.png"
              alt="AFKAR LAND"
              className="afkar-loader-logo relative h-24 w-24 object-contain sm:h-28 sm:w-28"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
        </div>

        <h1 className="afkar-loader-title mb-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-4xl font-black leading-none sm:text-6xl" aria-label={BRAND_TEXT}>
          {BRAND_TEXT.split('').map((char, index) => (
            <span
              key={`${char}-${index}`}
              className={char === ' ' ? 'w-2 sm:w-4' : `inline-block ${index >= 6 ? 'text-[#D80D0D]' : 'text-white'}`}
              aria-hidden="true"
              style={{ animationDelay: `${120 + index * 22}ms` }}
            >
              {char}
            </span>
          ))}
        </h1>

        <p className="afkar-loader-tagline max-w-md text-sm font-semibold leading-relaxed text-white/80 sm:text-base">
          {TAGLINE}
        </p>
      </div>
    </div>
  );
}

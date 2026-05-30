import { SITE_NAME, TAGLINE } from '../../utils/constants';

export default function Loader() {
  return (
    <div className="afkar-loader fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#080808] text-white">
      <picture className="afkar-loader-bg absolute inset-0">
        <source srcSet="/images/MasagenaParallax.avif" type="image/avif" />
        <source srcSet="/images/MasagenaParallax.webp" type="image/webp" />
        <img
          src="/images/MasagenaParallax.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          decoding="async"
          fetchPriority="high"
        />
      </picture>

      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/78 via-[#080808]/54 to-[#080808]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/52 via-transparent to-[#080808]/30" />
      <div className="absolute inset-0 bg-[#D80D0D]/10 mix-blend-multiply" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#080808] to-transparent" />
      <div className="afkar-loader-glow absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D80D0D]/18 blur-3xl sm:h-96 sm:w-96" />

      <div className="afkar-loader-content relative z-10 flex flex-col items-center px-6 text-center">
        <div className="afkar-loader-logo-wrap relative mb-6 flex h-32 w-32 items-center justify-center rounded-full border border-white/15 bg-[#080808]/42 shadow-2xl backdrop-blur-md sm:h-36 sm:w-36">
          <picture>
            <source srcSet="/images/LogoAfkar1.avif" type="image/avif" />
            <source srcSet="/images/LogoAfkar1.webp" type="image/webp" />
            <img
              src="/images/LogoAfkar1.png"
              alt={SITE_NAME}
              className="afkar-loader-logo h-24 w-24 object-contain sm:h-28 sm:w-28"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
        </div>

        <h1 className="afkar-loader-title text-4xl font-black leading-none tracking-normal sm:text-6xl">
          {SITE_NAME.split(' ')[0]} <span className="text-[#D80D0D]">{SITE_NAME.split(' ')[1]}</span>
        </h1>
        <div className="afkar-loader-line mt-5 h-px w-28 bg-gradient-to-r from-transparent via-[#D80D0D] to-transparent" />
        <p className="afkar-loader-text mt-4 max-w-sm text-xs font-semibold uppercase tracking-[0.18em] text-white/72 sm:text-sm">
          {TAGLINE}
        </p>
      </div>
    </div>
  );
}

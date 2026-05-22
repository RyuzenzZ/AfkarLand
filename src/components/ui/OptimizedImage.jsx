import { forwardRef } from 'react';

const LOCAL_IMAGE_RE = /^\/images\/(.+)\.(jpe?g|png)$/i;

function buildSource(src, ext) {
  const match = src?.match?.(LOCAL_IMAGE_RE);
  if (!match) return '';
  return `/images/${match[1]}.${ext}`;
}

const OptimizedImage = forwardRef(function OptimizedImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  sizes = '100vw',
  ...props
}, ref) {
  const avifSrc = buildSource(src, 'avif');
  const webpSrc = buildSource(src, 'webp');

  if (!avifSrc || !webpSrc) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        sizes={sizes}
        {...props}
      />
    );
  }

  return (
    <picture>
      <source srcSet={avifSrc} type="image/avif" sizes={sizes} />
      <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        sizes={sizes}
        {...props}
      />
    </picture>
  );
});

export default OptimizedImage;

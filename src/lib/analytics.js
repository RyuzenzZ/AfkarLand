const EVENT_PREFIX = 'afkar_';

function normalizeEventName(name) {
  return `${EVENT_PREFIX}${String(name || 'event').replace(/^afkar_/, '').replace(/[^a-zA-Z0-9_]/g, '_')}`;
}

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return;

  const eventName = normalizeEventName(name);
  const payload = {
    event_category: params.category || 'engagement',
    event_label: params.label,
    value: params.value,
    ...params,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });

  if (window.gtag && window.__afkarTrackingProvider === 'ga') {
    window.gtag('event', eventName, payload);
  }
}

export function trackWhatsappClick(label, extra = {}) {
  trackEvent('whatsapp_click', {
    category: 'contact',
    label,
    ...extra,
  });
}

export function trackLeadSubmit(label, extra = {}) {
  trackEvent('lead_submit', {
    category: 'lead',
    label,
    ...extra,
  });
}

export function trackCtaClick(label, extra = {}) {
  trackEvent('cta_click', {
    category: 'cta',
    label,
    ...extra,
  });
}

export function initWebVitalsTracking() {
  if (typeof window === 'undefined' || window.__afkarWebVitalsStarted) return;
  window.__afkarWebVitalsStarted = true;
  const firestoreSampleRate = Number(
    import.meta.env.VITE_WEB_VITALS_FIRESTORE_SAMPLE_RATE ?? (import.meta.env.PROD ? 0.2 : 1)
  );
  const shouldWriteToFirestore = Math.random() < Math.min(Math.max(firestoreSampleRate, 0), 1);

  import('web-vitals')
    .then(({ onCLS, onINP, onLCP }) => {
      const report = (metric) => {
        const metricValue = Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value);
        const metricDelta = Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta);
        trackEvent('web_vital', {
          category: 'performance',
          label: metric.name,
          metric_id: metric.id,
          metric_name: metric.name,
          metric_value: metricValue,
          metric_delta: metricDelta,
          metric_rating: metric.rating,
          navigation_type: metric.navigationType,
          page_path: window.location.pathname,
        });
        if (!shouldWriteToFirestore) return;
        Promise.all([
          import('../config/firebaseConfig'),
          import('firebase/firestore'),
        ]).then(([{ db }, { addDoc, collection, serverTimestamp }]) => addDoc(collection(db, 'web_vitals'), {
          metricId: metric.id,
          name: metric.name,
          value: metricValue,
          rawValue: metric.value,
          delta: metricDelta,
          rating: metric.rating,
          navigationType: metric.navigationType,
          pagePath: window.location.pathname,
          pageUrl: window.location.href,
          userAgent: window.navigator.userAgent,
          createdAt: serverTimestamp(),
        })).catch(() => {});
      };

      onLCP(report);
      onCLS(report);
      onINP(report);
    })
    .catch(() => {
      window.__afkarWebVitalsStarted = false;
    });
}

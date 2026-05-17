import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// ─── Helper: format Firestore Timestamp ke string tanggal ─────────────────
export function formatArticleDate(ts) {
  if (!ts) return '';
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Hook: semua artikel Published, sort terbaru dulu ─────────────────────
// Konfirmasi dari ManageArticles.jsx: field = status, nilai = 'Published' (string kapital P)
// Tidak pakai orderBy agar tidak butuh composite index — sort dilakukan di client.
export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'articles'),
      where('status', '==', 'Published')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const sorted = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
        setArticles(sorted);
        setLoading(false);
      },
      (err) => {
        console.error('[useArticles]', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { articles, loading, error };
}

// ─── Hook: satu artikel berdasarkan slug ──────────────────────────────────
export function useArticleBySlug(slug) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'articles'),
      where('slug', '==', slug)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setArticle(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() });
        setLoading(false);
      },
      (err) => {
        console.error('[useArticleBySlug]', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [slug]);

  return { article, loading, error };
}
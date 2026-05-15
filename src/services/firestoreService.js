import { db } from '../config/firebaseConfig';
import { 
  collection, doc, getDocs, getDoc, addDoc, 
  updateDoc, deleteDoc, query, where, orderBy, serverTimestamp 
} from 'firebase/firestore';

// ==========================================
// ARTICLES (BLOG)
// ==========================================
export const getAllArticles = async () => {
  try {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[VIBE ARCHITECT ERROR]: Gagal mengambil artikel', error);
    throw error;
  }
};

export const getPublishedArticles = async () => {
  try {
    const q = query(
      collection(db, 'articles'), 
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[VIBE ARCHITECT ERROR]: Gagal mengambil artikel publik', error);
    throw error;
  }
};

// ==========================================
// LEADS & KONSULTASI PROYEK
// ==========================================
export const createLead = async (leadData) => {
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...leadData,
      status: 'baru', // Status default
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('[VIBE ARCHITECT ERROR]: Gagal mengirim lead', error);
    throw error;
  }
};

export const getAllLeads = async () => {
  try {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[VIBE ARCHITECT ERROR]: Gagal mengambil data lead', error);
    throw error;
  }
};

// ==========================================
// LAMARAN KERJA (CAREER)
// ==========================================
export const createApplication = async (appData) => {
  try {
    const docRef = await addDoc(collection(db, 'applications'), {
      ...appData,
      status: 'review', // Status default lamaran baru
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('[VIBE ARCHITECT ERROR]: Gagal mengirim lamaran', error);
    throw error;
  }
};
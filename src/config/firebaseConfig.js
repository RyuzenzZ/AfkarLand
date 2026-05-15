import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// KONFIGURASI: Semua nilai diambil dari environment variable (.env)
// KEAMANAN: Jangan pernah hardcode nilai ini langsung di file produksi publik
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// INISIALISASI: Firebase app diinisialisasi sekali untuk seluruh aplikasi
const app = initializeApp(firebaseConfig);

// EKSPOR: Instance yang bisa digunakan di seluruh aplikasi (Database, Auth, Storage)
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
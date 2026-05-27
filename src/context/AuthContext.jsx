import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // KUNCI: State loading ini menahan website agar tidak menendang user 
  // sebelum Firebase selesai mengecek sesi login.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    let mounted = true;

    Promise.all([
      import('../config/firebaseConfig'),
      import('firebase/auth'),
    ]).then(([{ auth }, { onAuthStateChanged }]) => {
      if (!mounted) return;
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false); // Matikan loading HANYA setelah Firebase merespon
      });
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const [{ auth }, { signInWithEmailAndPassword }] = await Promise.all([
      import('../config/firebaseConfig'),
      import('firebase/auth'),
    ]);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    const [{ auth }, { signOut }] = await Promise.all([
      import('../config/firebaseConfig'),
      import('firebase/auth'),
    ]);
    return signOut(auth);
  };

  // WAJIB mengekspor 'loading' agar bisa dibaca oleh AdminLayout
  const value = { 
    user, 
    login, 
    logout, 
    loading 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

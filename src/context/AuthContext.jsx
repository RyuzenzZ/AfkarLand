import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

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
    // Listener ini akan terus memantau apakah ada user yang login/logout
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Matikan loading HANYA setelah Firebase merespon
    });
    
    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
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
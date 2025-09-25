"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { 
  Auth, 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { useFirebase } from '@/firebase'; // Using the main hook to get auth instance

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  signInWithApple: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, isUserLoading } = useFirebase(); // Get auth instance and its loading state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect now combines the app's loading state with Firebase's auth state loading
    setLoading(isUserLoading);
    if (!isUserLoading && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else if (!auth) {
      setLoading(false);
    }
  }, [isUserLoading, auth]);
  
  const login = (email: string, pass: string) => {
    if (!auth) throw new Error("Auth service not available");
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = (email: string, pass: string) => {
    if (!auth) throw new Error("Auth service not available");
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => {
    if (!auth) throw new Error("Auth service not available");
    return signOut(auth);
  };

  const signInWithGoogle = () => {
    if (!auth) throw new Error("Auth service not available");
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signInWithApple = () => {
    if (!auth) throw new Error("Auth service not available");
    const provider = new OAuthProvider('apple.com');
    return signInWithPopup(auth, provider);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, signInWithGoogle, signInWithApple }}>
      {children}
    </AuthContext.Provider>
  );
};

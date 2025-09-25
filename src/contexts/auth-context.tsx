'use client';

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
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  UserCredential,
  signInAnonymously,
} from 'firebase/auth';
import { useFirebase } from '@/firebase'; // Using the main hook to get auth instance
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface AuthContextType {
  user: (User & { role?: 'professional' | 'patient' }) | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserCredential>;
  signup: (name: string, email: string, pass: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<UserCredential>;
  loginWithMicrosoft: () => Promise<UserCredential>;
  loginWithApple: () => Promise<UserCredential>;
  loginAnonymously: () => Promise<UserCredential>;
  setUserRoleAndRefresh: (
    user: User,
    role: 'professional' | 'patient'
  ) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, firestore, isUserLoading } = useFirebase();
  const [user, setUser] = useState<
    (User & { role?: 'professional' | 'patient' }) | null
  >(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (firebaseUser: User | null) => {
    if (firebaseUser && firestore) {
      const userDocRef = doc(firestore, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({ ...firebaseUser, role: userData.role });
      } else {
        setUser(firebaseUser); // No role yet
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const freshUser = auth.currentUser;
      await fetchUserRole(freshUser);
    }
  };

  useEffect(() => {
    setLoading(isUserLoading);
    if (!isUserLoading && auth) {
      const unsubscribe = onAuthStateChanged(auth, firebaseUser =>
        fetchUserRole(firebaseUser)
      );
      return () => unsubscribe();
    } else if (!auth) {
      setLoading(false);
    }
  }, [isUserLoading, auth, firestore]);

  const login = (email: string, pass: string) => {
    if (!auth) throw new Error('Auth service not available');
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (name: string, email: string, pass: string) => {
    if (!auth) throw new Error('Auth service not available');
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass
    );
    await updateProfile(userCredential.user, { displayName: name });
    await sendEmailVerification(userCredential.user);
    return userCredential;
  };

  const logout = () => {
    if (!auth) throw new Error('Auth service not available');
    return signOut(auth);
  };

  const socialLogin = (provider: GoogleAuthProvider | OAuthProvider) => {
    if (!auth) throw new Error('Auth service not available');
    return signInWithPopup(auth, provider);
  };

  const loginWithGoogle = () => socialLogin(new GoogleAuthProvider());
  const loginWithMicrosoft = () =>
    socialLogin(new OAuthProvider('microsoft.com'));
  const loginWithApple = () => socialLogin(new OAuthProvider('apple.com'));
  const loginAnonymously = () => {
    if (!auth) throw new Error('Auth service not available');
    return signInAnonymously(auth);
  };

  const setUserRoleAndRefresh = async (
    userToUpdate: User,
    role: 'professional' | 'patient'
  ) => {
    if (!firestore) throw new Error('Firestore not available');
    const userDocRef = doc(firestore, 'users', userToUpdate.uid);
    const userData = {
      uid: userToUpdate.uid,
      email: userToUpdate.email,
      name: userToUpdate.displayName,
      role: role,
      createdAt: new Date().toISOString(),
    };

    // Use non-blocking write with contextual error handling
    setDoc(userDocRef, userData, { merge: true })
      .then(async () => {
        // Only refresh user and proceed on successful write
        await refreshUser();
      })
      .catch(serverError => {
        // Construct and emit the detailed permission error
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'write',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
        
        // We can also re-throw a more generic error for local handling if needed
        // For instance, to show a toast message to the user.
        // But we must not console.error the permissionError itself.
        throw new Error("Não foi possível definir o seu perfil de usuário.");
      });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        loginWithGoogle,
        loginWithMicrosoft,
        loginWithApple,
        loginAnonymously,
        setUserRoleAndRefresh,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

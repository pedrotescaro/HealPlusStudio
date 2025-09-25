'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics, isSupported } from "firebase/analytics";

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length) {
    return getSdks(getApp());
  }

  // Important! initializeApp() is called without any arguments because Firebase App Hosting
  // integrates with the initializeApp() function to provide the environment variables needed to
  // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
  // without arguments.
  let firebaseApp;
  try {
    // Attempt to initialize via Firebase App Hosting environment variables
    firebaseApp = initializeApp();
    console.log('Firebase initialized with App Hosting environment variables');
    console.log('App Hosting config:', {
      projectId: firebaseApp.options.projectId,
      databaseURL: firebaseApp.options.databaseURL,
      authDomain: firebaseApp.options.authDomain
    });
  } catch (e) {
    // Only warn in production because it's normal to use the firebaseConfig to initialize
    // during development
    if (process.env.NODE_ENV === "production") {
      console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
    }
    firebaseApp = initializeApp(firebaseConfig);
    console.log('Firebase initialized with config object');
    console.log('Config object:', {
      projectId: firebaseApp.options.projectId,
      databaseURL: firebaseApp.options.databaseURL,
      authDomain: firebaseApp.options.authDomain
    });
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  let database = null;
  let analytics = null;

  // Skip Realtime Database initialization for now to avoid errors
  console.log('Skipping Realtime Database initialization to avoid URL parsing errors');
  
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(firebaseApp);
        console.log('Firebase Analytics initialized.');
      } else {
        console.log('Firebase Analytics is not supported in this environment.');
      }
    });
  }
  
  console.log('Firebase SDKs initialized:', {
    auth: !!auth,
    firestore: !!firestore,
    database: false, // Disabled temporarily
    analytics: 'pending', // Analytics initializes asynchronously
    appOptions: {
      projectId: firebaseApp.options.projectId,
      databaseURL: firebaseApp.options.databaseURL,
      authDomain: firebaseApp.options.authDomain
    }
  });
  
  return {
    firebaseApp,
    auth,
    firestore,
    database, // Realtime Database SDK (disabled temporarily)
    analytics,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
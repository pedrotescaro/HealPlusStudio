"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBCNHtTKi9k_JiN9W-sUImLpGQqVtO1Zz8",
  authDomain: "studio-7562309280-b21b5.firebaseapp.com",
  projectId: "studio-7562309280-b21b5",
  storageBucket: "studio-7562309280-b21b5.appspot.com",
  messagingSenderId: "228714600401",
  appId: "1:228714600401:web:d548983b35c97975c072f0",
  measurementId: "G-569R50D0R3",
  databaseURL: "https://studio-7562309280-b21b5-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const realtimeDb = getDatabase(app);

export { app, db, auth, realtimeDb };

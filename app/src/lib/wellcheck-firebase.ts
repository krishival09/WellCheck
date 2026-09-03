import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Environment variables or fallback client config
const getEnv = (key: string, fallback: string): string => {
  try {
    if (typeof process !== 'undefined' && process?.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch {}
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnv("EXPO_PUBLIC_FIREBASE_API_KEY", "AIzaSy_WELLCHECK_CLIENT_KEY"),
  authDomain: getEnv("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN", "YOUR_PROJECT.firebaseapp.com"),
  projectId: getEnv("EXPO_PUBLIC_FIREBASE_PROJECT_ID", "YOUR_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET", "YOUR_PROJECT.appspot.com"),
  messagingSenderId: getEnv("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "YOUR_MESSAGING_SENDER_ID"),
  appId: getEnv("EXPO_PUBLIC_FIREBASE_APP_ID", "YOUR_FIREBASE_APP_ID")
};

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore instance (supporting standard 'wellcheck' named database and default)
let firestoreDb: Firestore;
try {
  firestoreDb = getFirestore(app, 'wellcheck');
} catch {
  try {
    firestoreDb = getFirestore(app);
  } catch (err) {
    console.warn('Firestore initialization notice:', err);
    firestoreDb = getFirestore(app);
  }
}

export const db = firestoreDb;

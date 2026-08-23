import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSy_WELLCHECK_CLIENT_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
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

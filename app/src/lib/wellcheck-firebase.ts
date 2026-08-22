import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration. 
// REPLACE WITH YOUR FULL API KEY FROM FIREBASE CONSOLE IF IT SHOWS AS MASKED.
const firebaseConfig = {
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  appId: "YOUR_FIREBASE_APP_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  apiKey: "AIzaSy-REPLACE-ME-WITH-FULL-KEY", 
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  measurementId: "G-7Q4MNTBK5N",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

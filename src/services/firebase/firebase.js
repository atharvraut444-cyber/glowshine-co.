import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyForGlowShineCommerce',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'glowshine-co.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'glowshine-co',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'glowshine-co.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '100000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:100000000000:web:glowshine12345',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://glowshine-co-default-rtdb.firebaseio.com',
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to Emulators if configured
const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true';

if (useEmulators && typeof window !== 'undefined' && !window.__FIREBASE_EMULATORS_CONNECTED__) {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    window.__FIREBASE_EMULATORS_CONNECTED__ = true;
    console.info('[GlowShine] Connected to Firebase Local Emulator Suite.');
  } catch (err) {
    console.warn('[GlowShine] Emulator connection warning:', err.message);
  }
}

export default app;

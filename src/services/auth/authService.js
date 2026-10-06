import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { mapAuthError } from '../../utils/errorMapping';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  /**
   * Register a new customer
   */
  async register(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (name) {
        await updateProfile(user, { displayName: name });
      }

      // Create initial Firestore user document
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: name || user.email.split('@')[0],
        role: 'customer',
        createdAt: serverTimestamp(),
        beautyProfile: null,
      });

      return { user, error: null };
    } catch (err) {
      console.error('[AuthService.register]', err);
      return { user: null, error: mapAuthError(err) };
    }
  },

  /**
   * Log in existing user
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (err) {
      console.error('[AuthService.login]', err);
      return { user: null, error: mapAuthError(err) };
    }
  },

  /**
   * Log in with Google
   */
  async loginWithGoogle() {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Ensure user profile document exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          role: 'customer',
          createdAt: serverTimestamp(),
          beautyProfile: null,
        });
      }

      return { user, error: null };
    } catch (err) {
      console.error('[AuthService.loginWithGoogle]', err);
      const msg = mapAuthError(err);
      return { user: null, error: msg || null };
    }
  },

  /**
   * Sign out current user
   */
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (err) {
      console.error('[AuthService.logout]', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Fetch Firestore user profile including beauty profile and role
   */
  async getUserProfile(uid) {
    try {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (err) {
      console.error('[AuthService.getUserProfile]', err);
      return null;
    }
  },

  /**
   * Update Beauty Profile (skin type, concerns, sensitivities, routine)
   */
  async updateBeautyProfile(uid, profileData) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        beautyProfile: profileData,
      });
      return { success: true };
    } catch (err) {
      console.error('[AuthService.updateBeautyProfile]', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Update User display name
   */
  async updateName(uid, name) {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { name });
      return { success: true };
    } catch (err) {
      console.error('[AuthService.updateName]', err);
      return { success: false, error: err.message };
    }
  }
};

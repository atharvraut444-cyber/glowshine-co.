import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase/firebase';
import { authService } from '../services/auth/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firebase Auth state
  useEffect(() => {
    let unsubscribeProfile = null;

    const unsubscribeAuth = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Check custom claims
        try {
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const hasAdminClaim = Boolean(idTokenResult.claims.admin);
          setIsAdmin(hasAdminClaim);
        } catch (e) {
          console.warn('[AuthContext] Failed to get ID token result:', e);
        }

        // Real-time listener for user profile document
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        unsubscribeProfile = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setProfile(data);
              // Fallback admin check if custom claim is not yet propagated in emulator
              if (data.role === 'admin') {
                setIsAdmin(true);
              }
            } else {
              setProfile(null);
            }
            setLoading(false);
          },
          (error) => {
            console.warn('[AuthContext] Profile listener error:', error.message);
            setLoading(false);
          }
        );
      } else {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        if (unsubscribeProfile) {
          unsubscribeProfile();
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    return await authService.login(email, password);
  }, []);

  const register = useCallback(async (email, password, name) => {
    return await authService.register(email, password, name);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    return await authService.loginWithGoogle();
  }, []);

  const logout = useCallback(async () => {
    return await authService.logout();
  }, []);

  const updateBeautyProfile = useCallback(async (profileData) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    return await authService.updateBeautyProfile(user.uid, profileData);
  }, [user]);

  // Demo login helper for seamless testing and presentation
  const loginDemo = useCallback(async (role = 'customer') => {
    const demoUser = {
      uid: role === 'admin' ? 'demo-admin-uid-99' : 'demo-customer-uid-01',
      email: role === 'admin' ? 'admin@glowshine.demo' : 'priya@glowshine.demo',
      displayName: role === 'admin' ? 'Aria Vance (Admin)' : 'Priya Sharma',
    };

    const demoProfile = {
      uid: demoUser.uid,
      email: demoUser.email,
      name: demoUser.displayName,
      role: role,
      beautyProfile: {
        skinType: 'combination',
        primaryConcern: 'hydration',
        concerns: ['hydration', 'barrier_repair', 'glow'],
        sensitivities: ['fragrance-free preferred'],
        routineExperience: 'intermediate',
        quizCompletedAt: new Date().toISOString(),
      },
    };

    setUser(demoUser);
    setProfile(demoProfile);
    setIsAdmin(role === 'admin');
    return { success: true };
  }, []);

  const value = {
    user,
    profile,
    isAdmin,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateBeautyProfile,
    loginDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * GlowShine Co. — Set Admin Role Bootstrap Script
 * Usage: node scripts/set-admin.js <uid>
 * 
 * Sets the Firebase Auth custom claim { admin: true } on the specified user UID.
 * Updates the Firestore document users/{uid} with role: 'admin'.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

const uid = process.argv[2];

if (!uid) {
  console.error('\x1b[31mError: UID is required.\x1b[0m');
  console.log('Usage: node scripts/set-admin.js <uid>');
  process.exit(1);
}

// In Emulator mode, no service account key is needed if FIREBASE_AUTH_EMULATOR_HOST is set
if (process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.VITE_USE_EMULATORS === 'true') {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  console.log('\x1b[36mConnecting to Firebase Emulators...\x1b[0m');
}

let app;
if (getApps().length === 0) {
  const serviceAccountPath = path.resolve('serviceAccountKey.json');
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    app = initializeApp({ credential: cert(serviceAccount) });
  } else {
    // Emulator / Project default credentials
    app = initializeApp({ projectId: 'glowshine-co' });
  }
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

async function setAdminRole() {
  try {
    console.log(`Setting custom claim { admin: true } for UID: \x1b[33m${uid}\x1b[0m...`);

    // 1. Set Custom User Claim in Firebase Auth
    await auth.setCustomUserClaims(uid, { admin: true });

    // 2. Update role field in Firestore users/{uid}
    const userRef = db.collection('users').doc(uid);
    await userRef.set(
      {
        role: 'admin',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    console.log('\x1b[32m✔ Success! User custom claim { admin: true } set successfully.\x1b[0m');
    console.log('\x1b[32m✔ Firestore users/' + uid + ' updated with role: "admin".\x1b[0m');
    console.log('\x1b[33mNote: Customer must sign out and sign back in for the new token claim to take effect.\x1b[0m');
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31mFailed to set admin role:\x1b[0m', error.message);
    process.exit(1);
  }
}

setAdminRole();

// Super Admin Management Service for RPS Admin Panel
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, app as primaryApp } from '../../../firebaseConfig';
import { logAdminActivity } from './activityService';

const USERS_COL = 'users';

/**
 * Subscribes to real-time list of all administrators
 */
export function subscribeToAdmins(callback) {
  try {
    const q = query(collection(db, USERS_COL), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const admins = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        callback(admins);
      },
      (err) => {
        console.error('Error subscribing to admins:', err);
        callback([]);
      }
    );
  } catch (err) {
    console.error('Failed to set up admins listener:', err);
    callback([]);
    return () => {};
  }
}

/**
 * Creates a new administrator account using a secondary Firebase App instance
 * This preserves the active Super Admin's session without logging them out!
 */
export async function createAdminAccount({ name, email, password, role = 'admin' }) {
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const secondaryAppName = `RPSAdminCreator-${Date.now()}`;
  let secondaryApp = null;

  try {
    // 1. Initialize secondary Firebase instance with identical configuration
    secondaryApp = initializeApp(primaryApp.options, secondaryAppName);
    const secondaryAuth = getAuth(secondaryApp);

    // 2. Create the user in Firebase Authentication
    const cred = await createUserWithEmailAndPassword(secondaryAuth, cleanEmail, password);
    const newUid = cred.user.uid;

    // 3. Immediately sign out secondary auth instance so credentials don't linger
    await signOut(secondaryAuth);

    // 4. Create administrator document in Firestore 'users/{uid}'
    const adminData = {
      uid: newUid,
      name: name.trim(),
      email: cleanEmail,
      role: role === 'superadmin' ? 'superadmin' : 'admin',
      status: 'active',
      createdAt: serverTimestamp(),
      lastLoginAt: null,
    };

    await setDoc(doc(db, USERS_COL, newUid), adminData);

    // 5. Audit logging
    logAdminActivity({
      action: 'CREATE_ADMIN',
      module: 'Admins',
      description: `Created new ${adminData.role} account: ${adminData.name} (${cleanEmail})`,
    });

    return { uid: newUid, ...adminData };
  } catch (err) {
    console.error('Error in createAdminAccount:', err);
    throw err;
  } finally {
    if (secondaryApp) {
      try {
        await deleteApp(secondaryApp);
      } catch (cleanErr) {
        console.warn('Could not clean up secondary app:', cleanErr);
      }
    }
  }
}

/**
 * Revokes an administrator's access
 */
export async function revokeAdminAccess(uid, adminNameOrInfo = '', maybeEmail = '') {
  const nameStr = typeof adminNameOrInfo === 'object' ? (adminNameOrInfo?.name || adminNameOrInfo?.email || uid) : adminNameOrInfo;
  const docRef = doc(db, USERS_COL, uid);
  await updateDoc(docRef, {
    status: 'revoked',
    revokedAt: serverTimestamp(),
  });

  logAdminActivity({
    action: 'REVOKE_ADMIN',
    module: 'Admins',
    description: `Revoked administrative privileges for: ${nameStr || maybeEmail || uid}`,
  });

  return true;
}

/**
 * Restores an administrator's access
 */
export async function restoreAdminAccess(uid, adminNameOrInfo = '', maybeEmail = '') {
  const nameStr = typeof adminNameOrInfo === 'object' ? (adminNameOrInfo?.name || adminNameOrInfo?.email || uid) : adminNameOrInfo;
  const docRef = doc(db, USERS_COL, uid);
  await updateDoc(docRef, {
    status: 'active',
    restoredAt: serverTimestamp(),
  });

  logAdminActivity({
    action: 'RESTORE_ADMIN',
    module: 'Admins',
    description: `Restored administrative privileges for: ${nameStr || maybeEmail || uid}`,
  });

  return true;
}

// Aliases for compatibility
export const subscribeAllAdmins = subscribeToAdmins;
export const revokeAdminAccount = revokeAdminAccess;
export const restoreAdminAccount = restoreAdminAccess;

export default {
  subscribeToAdmins,
  subscribeAllAdmins,
  createAdminAccount,
  revokeAdminAccess,
  revokeAdminAccount,
  restoreAdminAccess,
  restoreAdminAccount,
};

// Authentication Service for RPS Admin & Super Admin Panel
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';

/**
 * Maps Firebase Auth error codes to user-friendly error messages
 */
export function getFriendlyAuthErrorMessage(error) {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact school administration.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few moments and try again.';
    case 'auth/network-request-failed':
      return 'Unable to connect. Please check your internet connection.';
    case 'auth/access-revoked':
      return 'Your admin access has been revoked.';
    case 'auth/unauthorized-role':
      return 'Access denied. Administrator privileges required.';
    default:
      return error.message || 'Login failed. Please try again.';
  }
}

/**
 * Fetches admin user profile from Firestore 'users/{uid}'
 * If user was just created in Firebase Auth and has no doc yet, initializes profile based on email/role.
 */
export async function getAdminProfile(uid, userFallback = null) {
  if (!uid) return null;

  try {
    const userDocRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userDocRef);

    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }

    // Auto-bootstrap profile if user exists in Firebase Auth but doc not yet created in Firestore
    if (userFallback && userFallback.email) {
      const emailLower = userFallback.email.toLowerCase();
      const isSuper = emailLower.includes('superadmin') || emailLower.startsWith('super');
      const initialRole = isSuper ? 'superadmin' : 'admin';

      const initialProfile = {
        uid,
        name: isSuper ? 'Super Administrator' : 'School Administrator',
        email: userFallback.email,
        role: initialRole,
        status: 'active',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };

      await setDoc(userDocRef, initialProfile);
      return initialProfile;
    }

    return null;
  } catch (err) {
    console.error('Error fetching admin profile from Firestore:', err);
    throw err;
  }
}

/**
 * Authenticates admin via Firebase Email & Password
 * Enforces role check ('admin' | 'superadmin') and status check ('active')
 */
export async function loginAdmin(email, password) {
  if (!email || !password) {
    throw new Error('Please provide both email and password.');
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Firebase Auth Sign In
  const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
  const user = userCredential.user;

  // 2. Fetch Firestore profile
  let profile = await getAdminProfile(user.uid, user);

  if (!profile) {
    await signOut(auth);
    const err = new Error('Administrator record not found.');
    err.code = 'auth/unauthorized-role';
    throw err;
  }

  // 3. Status validation: Must be active
  if (profile.status === 'revoked' || profile.status === 'inactive') {
    await signOut(auth);
    const err = new Error('Your admin access has been revoked.');
    err.code = 'auth/access-revoked';
    throw err;
  }

  // 4. Role validation: Must be admin or superadmin
  if (profile.role !== 'admin' && profile.role !== 'superadmin') {
    await signOut(auth);
    const err = new Error('Access denied. Administrator privileges required.');
    err.code = 'auth/unauthorized-role';
    throw err;
  }

  // 5. Update lastLoginAt timestamp in Firestore
  try {
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      lastLoginAt: serverTimestamp(),
    });
  } catch (updateErr) {
    console.warn('Could not update lastLoginAt timestamp:', updateErr);
  }

  return { user, profile };
}

/**
 * Signs out admin and terminates session
 */
export async function logoutAdmin() {
  await signOut(auth);
}

/**
 * Listens to Firebase Auth state changes
 */
export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export default {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  getFriendlyAuthErrorMessage,
  subscribeToAuthState,
};

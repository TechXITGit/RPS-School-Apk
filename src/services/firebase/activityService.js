// Admin Activity Audit Logging Service for RPS Super Admin Tracking
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from '../../../firebaseConfig';

const COLLECTION_NAME = 'admin_activity';

/**
 * Logs an administrative action to Firestore for audit tracking
 */
export async function logAdminActivity({ action, module, description, metadata = {} }) {
  try {
    const user = auth.currentUser;
    const adminId = user?.uid || 'system';
    const adminEmail = user?.email || 'admin@rudrapurpublicschool.com';
    const adminName = user?.displayName || adminEmail.split('@')[0];

    const activityData = {
      adminId,
      adminName,
      adminEmail,
      action: action || 'ACTION',
      module: module || 'General',
      description: description || '',
      metadata,
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, COLLECTION_NAME), activityData);
  } catch (err) {
    console.warn('Could not record admin activity:', err);
  }
}

/**
 * Subscribes to recent admin activity logs in real-time
 */
export function subscribeToAdminActivity(callback, maxLogs = 50) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('timestamp', 'desc'),
      limit(maxLogs)
    );

    return onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(activities);
    });
  } catch (err) {
    console.error('Error subscribing to admin activities:', err);
    callback([]);
    return () => {};
  }
}

/**
 * Fetches one-time admin activity logs
 */
export async function getAdminActivities(maxLogs = 50) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('timestamp', 'desc'),
      limit(maxLogs)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error('Error fetching admin activities:', err);
    return [];
  }
}

// Aliases
export const subscribeAdminActivity = subscribeToAdminActivity;

export default {
  logAdminActivity,
  subscribeToAdminActivity,
  subscribeAdminActivity,
  getAdminActivities,
};

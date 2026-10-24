// Persistent storage helper for guided tours across roles
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  user: '@rps_tour_user_completed_v5',
  admin: '@rps_tour_admin_completed_v5',
  superadmin: '@rps_tour_superadmin_completed_v5',
};

// In-memory fallback in case AsyncStorage encounters a platform permission issue
const memoryCache = {};

/**
 * Check if the tour of a given type has been completed or skipped
 * @param {'user' | 'admin' | 'superadmin'} tourType
 * @returns {Promise<boolean>}
 */
export async function hasTourCompleted(tourType = 'user') {
  const key = STORAGE_KEYS[tourType] || STORAGE_KEYS.user;
  try {
    const val = await AsyncStorage.getItem(key);
    if (val !== null) {
      return val === 'true';
    }
  } catch (error) {
    console.warn('[TourStorage] Error reading tour state:', error);
  }
  return memoryCache[key] === true;
}

/**
 * Set the completion/skipped state of a tour
 * @param {'user' | 'admin' | 'superadmin'} tourType
 * @param {boolean} completed
 */
export async function setTourCompleted(tourType = 'user', completed = true) {
  const key = STORAGE_KEYS[tourType] || STORAGE_KEYS.user;
  memoryCache[key] = completed;
  try {
    await AsyncStorage.setItem(key, completed ? 'true' : 'false');
  } catch (error) {
    console.warn('[TourStorage] Error saving tour state:', error);
  }
}

/**
 * Reset a tour so it can be replayed on demand
 * @param {'user' | 'admin' | 'superadmin'} tourType
 */
export async function resetTour(tourType = 'user') {
  const key = STORAGE_KEYS[tourType] || STORAGE_KEYS.user;
  delete memoryCache[key];
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn('[TourStorage] Error resetting tour state:', error);
  }
}

/**
 * Reset all tours across all roles
 */
export async function resetAllTours() {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.warn('[TourStorage] Error resetting all tours:', error);
  }
  Object.keys(memoryCache).forEach((k) => delete memoryCache[k]);
}

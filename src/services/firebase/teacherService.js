// Teacher Management Firestore Service for RPS Admin Panel
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { logAdminActivity } from './activityService';

const COLLECTION_NAME = 'teachers';

/**
 * Subscribes to real-time teachers directory
 */
export function subscribeToTeachers(callback) {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const teachers = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        callback(teachers);
      },
      (err) => {
        console.error('Error subscribing to teachers:', err);
        callback([]);
      }
    );
  } catch (err) {
    console.error('Failed to set up teachers listener:', err);
    callback([]);
    return () => {};
  }
}

/**
 * Fetches all teachers once
 */
export async function getAllTeachers() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (err) {
    console.error('Error fetching teachers:', err);
    return [];
  }
}

/**
 * Registers a new teacher
 */
export async function addTeacher(teacherData) {
  const newTeacher = {
    teacherId: teacherData.teacherId || `RPS-TCH-${Date.now().toString().slice(-4)}`,
    name: (teacherData.name || '').trim(),
    email: (teacherData.email || '').trim().toLowerCase(),
    phone: (teacherData.phone || '').trim(),
    subject: (teacherData.subject || '').trim(),
    qualification: (teacherData.qualification || '').trim(),
    joiningDate: teacherData.joiningDate || serverTimestamp(),
    basicSalary: parseFloat(teacherData.basicSalary) || 0,
    address: (teacherData.address || '').trim(),
    status: teacherData.status || 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), newTeacher);

  logAdminActivity({
    action: 'CREATE_TEACHER',
    module: 'Teachers',
    description: `Registered faculty member: ${newTeacher.name} (${newTeacher.teacherId}) - ${newTeacher.subject}`,
  });

  return { id: docRef.id, ...newTeacher };
}

/**
 * Updates an existing teacher profile
 */
export async function updateTeacher(id, updateData) {
  const docRef = doc(db, COLLECTION_NAME, id);
  const data = {
    ...updateData,
    basicSalary: updateData.basicSalary !== undefined ? parseFloat(updateData.basicSalary) : undefined,
    updatedAt: serverTimestamp(),
  };

  // Remove undefined fields
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

  await updateDoc(docRef, data);

  logAdminActivity({
    action: 'UPDATE_TEACHER',
    module: 'Teachers',
    description: `Updated profile for faculty ID: ${id}`,
  });

  return true;
}

/**
 * Deletes a teacher profile
 */
export async function deleteTeacher(id, name = '') {
  await deleteDoc(doc(db, COLLECTION_NAME, id));

  logAdminActivity({
    action: 'DELETE_TEACHER',
    module: 'Teachers',
    description: `Removed faculty member: ${name || id}`,
  });

  return true;
}

export default {
  subscribeToTeachers,
  getAllTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
};

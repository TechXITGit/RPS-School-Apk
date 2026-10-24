// Student Management Firestore Service for RPS Admin Panel
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { logAdminActivity } from './activityService';

const COLLECTION_NAME = 'students';

/**
 * Subscribes to real-time students list with optional class filter
 */
export function subscribeToStudents(callback, filterClass = null) {
  try {
    let q;
    if (filterClass && filterClass !== 'All') {
      q = query(
        collection(db, COLLECTION_NAME),
        where('class', '==', filterClass),
        orderBy('name', 'asc')
      );
    } else {
      q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const students = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(students);
      },
      (err) => {
        if (err.code !== 'permission-denied') {
          console.error('Error in subscribeToStudents:', err);
        }
        callback([]);
      }
    );
  } catch (err) {
    console.error('Failed to set up student listener:', err);
    callback([]);
    return () => {};
  }
}

/**
 * Fetches all students once
 */
export async function getAllStudents() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error('Error fetching students:', err);
    return [];
  }
}

/**
 * Adds a new student record
 */
export async function addStudent(studentData) {
  const total = parseFloat(studentData.totalFee) || 0;
  const paid = parseFloat(studentData.paidFee) || 0;
  const pending = Math.max(0, total - paid);

  const newStudent = {
    uid: studentData.uid ? studentData.uid.trim() : `RPS-${Date.now().toString().slice(-6)}`,
    name: studentData.name.trim(),
    parentName: (studentData.parentName || '').trim(),
    phone: (studentData.phone || '').trim(),
    email: (studentData.email || '').trim().toLowerCase(),
    class: studentData.class || '1-A',
    section: (studentData.section || 'A').trim().toUpperCase(),
    totalFee: total,
    paidFee: paid,
    pendingFee: pending,
    transportRequired: !!studentData.transportRequired,
    transportRoute: studentData.transportRoute || '',
    address: (studentData.address || '').trim(),
    admissionDate: studentData.admissionDate || serverTimestamp(),
    status: studentData.status || 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), newStudent);

  logAdminActivity({
    action: 'CREATE_STUDENT',
    module: 'Students',
    description: `Registered new student: ${newStudent.name} (${newStudent.uid}) in Class ${newStudent.class}`,
  });

  return { id: docRef.id, ...newStudent };
}

/**
 * Updates an existing student record
 */
export async function updateStudent(studentId, updateData) {
  const docRef = doc(db, COLLECTION_NAME, studentId);

  const cleanData = { ...updateData, updatedAt: serverTimestamp() };

  // Recalculate pending fee automatically if total or paid is updated
  if ('totalFee' in cleanData || 'paidFee' in cleanData) {
    const snap = await getDoc(docRef);
    const existing = snap.data() || {};
    const total = cleanData.totalFee !== undefined ? parseFloat(cleanData.totalFee) : existing.totalFee || 0;
    const paid = cleanData.paidFee !== undefined ? parseFloat(cleanData.paidFee) : existing.paidFee || 0;
    cleanData.pendingFee = Math.max(0, total - paid);
  }

  await updateDoc(docRef, cleanData);

  logAdminActivity({
    action: 'UPDATE_STUDENT',
    module: 'Students',
    description: `Updated student details for ID: ${studentId}`,
  });

  return true;
}

/**
 * Deletes a student record
 */
export async function deleteStudent(studentId, studentName = '') {
  const docRef = doc(db, COLLECTION_NAME, studentId);
  await deleteDoc(docRef);

  logAdminActivity({
    action: 'DELETE_STUDENT',
    module: 'Students',
    description: `Removed student: ${studentName || studentId}`,
  });

  return true;
}

/**
 * Batch imports multiple validated students
 */
export async function batchImportStudents(validStudents) {
  if (!validStudents || validStudents.length === 0) return { count: 0 };

  const batch = writeBatch(db);
  const studentsCol = collection(db, COLLECTION_NAME);

  validStudents.forEach((st) => {
    const docRef = doc(studentsCol);
    batch.set(docRef, {
      ...st,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();

  logAdminActivity({
    action: 'IMPORT_STUDENTS',
    module: 'Students',
    description: `Bulk imported ${validStudents.length} students via file upload`,
  });

  return { count: validStudents.length };
}

export default {
  subscribeToStudents,
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  batchImportStudents,
};

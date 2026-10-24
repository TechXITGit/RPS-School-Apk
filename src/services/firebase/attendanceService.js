// Attendance Service for Students & Teachers in RPS Admin Panel
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { logAdminActivity } from './activityService';

/**
 * Loads student attendance map for a specific date (format: YYYY-MM-DD)
 */
export async function getStudentAttendanceForDate(dateKey) {
  try {
    const docRef = doc(db, 'attendance', dateKey);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().records || {};
    }
    return {};
  } catch (err) {
    console.error('Error fetching student attendance:', err);
    return {};
  }
}

/**
 * Saves student attendance records for a specific date
 * records: { [studentId]: 'present' | 'absent' | 'late' }
 */
export async function saveStudentAttendance(dateKey, records) {
  const docRef = doc(db, 'attendance', dateKey);
  await setDoc(
    docRef,
    {
      date: dateKey,
      records,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  const totalMarked = Object.keys(records).length;
  logAdminActivity({
    action: 'SAVE_STUDENT_ATTENDANCE',
    module: 'Attendance',
    description: `Saved attendance for ${totalMarked} students on ${dateKey}`,
  });

  return true;
}

/**
 * Loads teacher attendance for a specific date
 */
export async function getTeacherAttendanceForDate(dateKey) {
  try {
    const docRef = doc(db, 'teacherAttendance', dateKey);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().records || {};
    }
    return {};
  } catch (err) {
    console.error('Error fetching teacher attendance:', err);
    return {};
  }
}

/**
 * Saves teacher attendance records for a specific date
 * records: { [teacherId]: 'present' | 'absent' | 'half_day' | 'leave' }
 */
export async function saveTeacherAttendance(dateKey, records) {
  const docRef = doc(db, 'teacherAttendance', dateKey);
  await setDoc(
    docRef,
    {
      date: dateKey,
      records,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  const totalMarked = Object.keys(records).length;
  logAdminActivity({
    action: 'SAVE_TEACHER_ATTENDANCE',
    module: 'Attendance',
    description: `Saved attendance for ${totalMarked} faculty mentors on ${dateKey}`,
  });

  return true;
}

/**
 * Fetches all attendance records across dates for reporting
 */
export async function getAllAttendanceRecords() {
  try {
    const snap = await getDocs(collection(db, 'attendance'));
    return snap.docs.map((d) => ({
      date: d.id,
      ...d.data(),
    }));
  } catch (err) {
    console.error('Error loading historical attendance:', err);
    return [];
  }
}

export default {
  getStudentAttendanceForDate,
  saveStudentAttendance,
  getTeacherAttendanceForDate,
  saveTeacherAttendance,
  getAllAttendanceRecords,
};

// Admission Enquiries & Conversion Firestore Service for RPS Admin Panel
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
import { addStudent } from './studentService';

const COLLECTION_NAME = 'enquiries';

/**
 * Subscribes to real-time admission enquiries
 */
export function subscribeToEnquiries(callback) {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const enquiries = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        callback(enquiries);
      },
      (err) => {
        console.error('Error subscribing to enquiries:', err);
        callback([]);
      }
    );
  } catch (err) {
    console.error('Failed to set up enquiries listener:', err);
    callback([]);
    return () => {};
  }
}

/**
 * Creates a new admission enquiry
 */
export async function addEnquiry(enquiryData) {
  const newEnquiry = {
    candidateName: (enquiryData.candidateName || '').trim(),
    parentName: (enquiryData.parentName || '').trim(),
    grade: enquiryData.grade || 'Nursery',
    contactNumber: (enquiryData.contactNumber || '').trim(),
    email: (enquiryData.email || '').trim().toLowerCase(),
    message: (enquiryData.message || '').trim(),
    status: enquiryData.status || 'New',
    date: enquiryData.date || serverTimestamp(),
    convertedToStudentId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), newEnquiry);

  logAdminActivity({
    action: 'CREATE_ENQUIRY',
    module: 'Enquiries',
    description: `Logged admission enquiry for candidate: ${newEnquiry.candidateName} (${newEnquiry.grade})`,
  });

  return { id: docRef.id, ...newEnquiry };
}

/**
 * Updates status or info of an enquiry
 */
export async function updateEnquiryStatus(id, newStatus, candidateName = '') {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });

  logAdminActivity({
    action: 'UPDATE_ENQUIRY_STATUS',
    module: 'Enquiries',
    description: `Updated enquiry status for ${candidateName || id} to "${newStatus}"`,
  });

  return true;
}

/**
 * Converts a qualified enquiry into a student record
 */
export async function convertEnquiryToStudent(enquiry, totalFee = 25000, paidFee = 5000) {
  if (!enquiry) throw new Error('Invalid enquiry data');

  const studentPayload = {
    uid: `RPS-AD-${Date.now().toString().slice(-4)}`,
    name: enquiry.candidateName,
    parentName: enquiry.parentName,
    phone: enquiry.contactNumber,
    email: enquiry.email || '',
    class: enquiry.grade || 'Nursery-A',
    section: 'A',
    totalFee: parseFloat(totalFee) || 25000,
    paidFee: parseFloat(paidFee) || 0,
    transportRequired: false,
    address: '',
    status: 'active',
  };

  // 1. Create student
  const createdStudent = await addStudent(studentPayload);

  // 2. Mark enquiry as Converted with link to student ID
  const docRef = doc(db, COLLECTION_NAME, enquiry.id);
  await updateDoc(docRef, {
    status: 'Converted',
    convertedToStudentId: createdStudent.id,
    updatedAt: serverTimestamp(),
  });

  logAdminActivity({
    action: 'CONVERT_ENQUIRY_TO_STUDENT',
    module: 'Enquiries',
    description: `Converted candidate ${enquiry.candidateName} to Student UID: ${createdStudent.uid}`,
  });

  return createdStudent;
}

/**
 * Deletes an enquiry
 */
export async function deleteEnquiry(id, candidateName = '') {
  await deleteDoc(doc(db, COLLECTION_NAME, id));

  logAdminActivity({
    action: 'DELETE_ENQUIRY',
    module: 'Enquiries',
    description: `Removed enquiry for ${candidateName || id}`,
  });

  return true;
}

export default {
  subscribeToEnquiries,
  addEnquiry,
  updateEnquiryStatus,
  convertEnquiryToStudent,
  deleteEnquiry,
};

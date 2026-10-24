// Fee Management Firestore Service for RPS Admin Panel
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
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { logAdminActivity } from './activityService';
import { isToday } from '../../utils/dateUtils';

const PAYMENTS_COL = 'feePayments';
const STRUCTURE_COL = 'feeStructures';

/**
 * Subscribes to recent fee payments for Dashboard and Ledger
 */
export function subscribeToRecentPayments(callback, maxCount = 20) {
  try {
    const q = query(
      collection(db, PAYMENTS_COL),
      orderBy('paymentDate', 'desc'),
      limit(maxCount)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const payments = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        callback(payments);
      },
      (err) => {
        if (err.code !== 'permission-denied') {
          console.error('Error in subscribeToRecentPayments:', err);
        }
        callback([]);
      }
    );
  } catch (err) {
    console.error('Failed to set up payments listener:', err);
    callback([]);
    return () => {};
  }
}

/**
 * Records a new fee payment and updates the student record
 */
export async function recordFeePayment({
  studentId,
  studentUid,
  studentName,
  studentClass,
  amount,
  type = 'Tuition',
  paymentMethod = 'Cash',
  receiptNumber = '',
  description = '',
  paymentDate = null,
}) {
  const numAmount = parseFloat(amount) || 0;
  if (numAmount <= 0) throw new Error('Payment amount must be greater than zero.');

  const paymentRecord = {
    studentId: studentId || '',
    studentUid: studentUid || '',
    studentName: studentName || '',
    class: studentClass || '',
    amount: numAmount,
    type: type || 'Tuition',
    paymentMethod: paymentMethod || 'Cash',
    receiptNumber: receiptNumber || `RCP-${Date.now().toString().slice(-6)}`,
    description: description || '',
    paymentDate: paymentDate || serverTimestamp(),
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, PAYMENTS_COL), paymentRecord);

  // If tied to an existing student, update student's paid and pending fee
  if (studentId) {
    try {
      const studentRef = doc(db, 'students', studentId);
      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        const stData = studentSnap.data();
        const currentPaid = parseFloat(stData.paidFee) || 0;
        const total = parseFloat(stData.totalFee) || 0;
        const newPaid = currentPaid + numAmount;
        const newPending = Math.max(0, total - newPaid);

        await updateDoc(studentRef, {
          paidFee: newPaid,
          pendingFee: newPending,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (stErr) {
      console.warn('Could not update student fee ledger:', stErr);
    }
  }

  logAdminActivity({
    action: 'COLLECT_FEE',
    module: 'Fees',
    description: `Collected ₹${numAmount} (${type}) from ${studentName} (${studentUid}) via ${paymentMethod}`,
  });

  return { id: docRef.id, ...paymentRecord };
}

/**
 * Subscribes to Class-wise Fee Structures
 */
export function subscribeToFeeStructures(callback) {
  try {
    const q = query(collection(db, STRUCTURE_COL), orderBy('class', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const structures = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        callback(structures);
      },
      (err) => {
        console.error('Error in fee structures:', err);
        callback([]);
      }
    );
  } catch (err) {
    console.error('Failed to set up fee structures listener:', err);
    callback([]);
    return () => {};
  }
}

/**
 * Adds or updates a class fee structure
 */
export async function saveFeeStructure(structureData) {
  const tuition = parseFloat(structureData.tuitionFee) || 0;
  const transport = parseFloat(structureData.transportFee) || 0;
  const admission = parseFloat(structureData.admissionFee) || 0;
  const total = tuition + transport + admission;

  const data = {
    class: structureData.class,
    tuitionFee: tuition,
    transportFee: transport,
    admissionFee: admission,
    totalFee: total,
    updatedAt: serverTimestamp(),
  };

  if (structureData.id) {
    const docRef = doc(db, STRUCTURE_COL, structureData.id);
    await updateDoc(docRef, data);
  } else {
    data.createdAt = serverTimestamp();
    await addDoc(collection(db, STRUCTURE_COL), data);
  }

  logAdminActivity({
    action: 'UPDATE_FEE_STRUCTURE',
    module: 'Fees',
    description: `Configured fee structure for Class ${data.class}: Total ₹${total}`,
  });

  return true;
}

/**
 * Deletes a class fee structure
 */
export async function deleteFeeStructure(id, className = '') {
  await deleteDoc(doc(db, STRUCTURE_COL, id));
  logAdminActivity({
    action: 'DELETE_FEE_STRUCTURE',
    module: 'Fees',
    description: `Removed fee structure for Class ${className || id}`,
  });
  return true;
}

export default {
  subscribeToRecentPayments,
  recordFeePayment,
  subscribeToFeeStructures,
  saveFeeStructure,
  deleteFeeStructure,
};

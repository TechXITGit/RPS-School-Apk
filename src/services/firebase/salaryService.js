// Salary Management & Slip Calculation Service for RPS Admin Panel
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { logAdminActivity } from './activityService';

const SALARY_COL = 'salaryReports';

/**
 * Calculates dynamic monthly salary for a teacher based on basic salary and attendance days
 */
export function calculateTeacherSalary({ basicSalary, totalWorkingDays = 30, presentDays = 30, absentDays = 0, leaveDays = 0, customDeductions = 0 }) {
  const base = parseFloat(basicSalary) || 0;
  const days = parseInt(totalWorkingDays, 10) || 30;
  const perDayRate = base / days;

  // Deduction for absent days (leaves approved are usually paid or half-paid per policy)
  const absentDeduction = absentDays * perDayRate;
  const totalDeductions = Math.round(absentDeduction + (parseFloat(customDeductions) || 0));
  const netSalary = Math.max(0, Math.round(base - totalDeductions));

  return {
    basicSalary: base,
    perDayRate: Math.round(perDayRate),
    totalWorkingDays: days,
    presentDays,
    absentDays,
    leaveDays,
    deductions: totalDeductions,
    netSalary,
  };
}

/**
 * Saves or updates processed monthly salary slip in Firestore
 */
export async function saveSalaryRecord(salaryData) {
  const record = {
    teacherId: salaryData.teacherId,
    teacherDocId: salaryData.teacherDocId || '',
    teacherName: salaryData.teacherName,
    month: salaryData.month,
    year: salaryData.year,
    basicSalary: parseFloat(salaryData.basicSalary) || 0,
    presentDays: salaryData.presentDays || 0,
    absentDays: salaryData.absentDays || 0,
    leaveDays: salaryData.leaveDays || 0,
    deductions: parseFloat(salaryData.deductions) || 0,
    netSalary: parseFloat(salaryData.netSalary) || 0,
    paymentStatus: salaryData.paymentStatus || 'Paid',
    paymentMethod: salaryData.paymentMethod || 'Bank Transfer',
    paymentDate: salaryData.paymentDate || serverTimestamp(),
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, SALARY_COL), record);

  logAdminActivity({
    action: 'GENERATE_SALARY_SLIP',
    module: 'Salary',
    description: `Generated salary slip for ${record.teacherName} (${record.month} ${record.year}): Net ₹${record.netSalary}`,
  });

  return { id: docRef.id, ...record };
}

/**
 * Fetches salary reports filtered by month and year
 */
export async function getSalaryReports(month = null, year = null) {
  try {
    let q = query(collection(db, SALARY_COL), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    let results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (month) {
      results = results.filter((r) => r.month === month);
    }
    if (year) {
      results = results.filter((r) => String(r.year) === String(year));
    }

    return results;
  } catch (err) {
    console.error('Error fetching salary reports:', err);
    return [];
  }
}

export default {
  calculateTeacherSalary,
  saveSalaryRecord,
  getSalaryReports,
};

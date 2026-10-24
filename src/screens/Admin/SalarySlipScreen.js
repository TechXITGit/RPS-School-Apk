// Printable & WhatsApp Shareable Salary Slip Screen
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';
import { getAllTeachers } from '../../services/firebase/teacherService';
import { calculateTeacherSalary } from '../../services/firebase/salaryService';
import { formatINR } from '../../utils/currencyUtils';
import { sendSalarySlipWhatsApp } from '../../utils/whatsapp';

export default function SalarySlipScreen({ teacher: initialTeacher, onBack }) {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(initialTeacher || null);
  const [month, setMonth] = useState('September');
  const [year, setYear] = useState('2026');

  useEffect(() => {
    getAllTeachers().then((list) => {
      const fallbackList = list.length > 0 ? list : [
        { id: 't-1', teacherId: 'RPS-TCH-001', name: 'Dr. Ananya Sharma', subject: 'Principal', basicSalary: 65000, phone: '9919993377' },
        { id: 't-2', teacherId: 'RPS-TCH-002', name: 'Vikramaditya Roy', subject: 'Mathematics', basicSalary: 48000, phone: '9838012345' },
      ];
      setTeachers(fallbackList);
      if (!selectedTeacher) {
        setSelectedTeacher(fallbackList[0]);
      }
    });
  }, []);

  const currentTeacher = selectedTeacher || teachers[0];

  const calc = currentTeacher
    ? calculateTeacherSalary({
        basicSalary: currentTeacher.basicSalary || 45000,
        totalWorkingDays: 30,
        presentDays: 28,
        absentDays: 1,
        leaveDays: 1,
        customDeductions: 0,
      })
    : { basicSalary: 0, deductions: 0, netSalary: 0, presentDays: 30, absentDays: 0, leaveDays: 0 };

  const handleWhatsApp = async () => {
    if (!currentTeacher) return;
    await sendSalarySlipWhatsApp({
      teacherName: currentTeacher.name,
      month: `${month} ${year}`,
      netSalary: calc.netSalary,
      phone: currentTeacher.phone || '9919993377',
    });
  };

  const handlePrint = () => {
    Alert.alert('Print / Download Slip', 'Ready to export printable high-resolution PDF salary voucher.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Bar with Teacher Selector */}
      <View style={styles.topBar}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Ionicons name="arrow-back" size={18} color="#4361EE" />
            <Text style={styles.backText}>Back to Payroll</Text>
          </TouchableOpacity>
        )}

        <View style={styles.actionsRight}>
          <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
            <Ionicons name="print-outline" size={17} color="#4361EE" />
            <Text style={styles.printBtnText}>Download / Print</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={17} color="#FFFFFF" />
            <Text style={styles.whatsappBtnText}>Send via WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Teacher Picker Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teacherChips}>
        {teachers.map((t) => {
          const isSel = currentTeacher?.id === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.tChip, isSel && styles.tChipActive]}
              onPress={() => setSelectedTeacher(t)}
            >
              <Text style={[styles.tChipText, isSel && styles.tChipTextActive]}>{t.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Printable Salary Voucher Document Card */}
      <View style={styles.slipCard}>
        {/* School Crest & Header */}
        <View style={styles.slipHeader}>
          <Image
            source={require('../../../assets/rps_logo.png')}
            style={styles.schoolLogo}
            resizeMode="contain"
          />
          <View style={styles.schoolInfo}>
            <Text style={styles.schoolTitle}>RUDRAPUR PUBLIC SCHOOL</Text>
            <Text style={styles.schoolSub}>CBSE Affiliated #3530491 • Kashipuram Colony, Deoria</Text>
            <Text style={styles.voucherBadge}>MONTHLY SALARY DISBURSEMENT SLIP</Text>
          </View>
        </View>

        <View style={styles.metaDivider} />

        {/* Employee Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Faculty Name:</Text>
            <Text style={styles.gridValue}>{currentTeacher?.name}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Teacher ID:</Text>
            <Text style={[styles.gridValue, { color: '#4361EE' }]}>{currentTeacher?.teacherId}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Department / Subject:</Text>
            <Text style={styles.gridValue}>{currentTeacher?.subject}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Pay Period:</Text>
            <Text style={styles.gridValue}>{month} {year}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Attendance Summary:</Text>
            <Text style={styles.gridValue}>
              Present: {calc.presentDays}d • Absent: {calc.absentDays}d • Leave: {calc.leaveDays}d
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Payment Mode:</Text>
            <Text style={styles.gridValue}>Direct Bank Transfer (NEFT/RTGS)</Text>
          </View>
        </View>

        {/* Earnings & Deductions Breakdown */}
        <View style={styles.breakdownTable}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.bth}>EARNING HEADS</Text>
            <Text style={[styles.bth, { textAlign: 'right' }]}>AMOUNT (₹)</Text>
          </View>
          <View style={styles.bRow}>
            <Text style={styles.bLabel}>Basic Monthly Pay</Text>
            <Text style={styles.bVal}>{formatINR(calc.basicSalary)}</Text>
          </View>
          <View style={styles.bRow}>
            <Text style={styles.bLabel}>Academic & Lab Allowance</Text>
            <Text style={styles.bVal}>₹0</Text>
          </View>

          <View style={[styles.breakdownHeader, { marginTop: 14 }]}>
            <Text style={styles.bth}>DEDUCTIONS</Text>
            <Text style={[styles.bth, { textAlign: 'right' }]}>AMOUNT (₹)</Text>
          </View>
          <View style={styles.bRow}>
            <Text style={styles.bLabel}>Leave / Absentee Adjustments</Text>
            <Text style={[styles.bVal, { color: '#E53935' }]}>-{formatINR(calc.deductions)}</Text>
          </View>
          <View style={styles.bRow}>
            <Text style={styles.bLabel}>Tax / PF Deductions</Text>
            <Text style={styles.bVal}>₹0</Text>
          </View>
        </View>

        {/* Net Salary Highlight */}
        <View style={styles.netSalaryBanner}>
          <Text style={styles.netSalaryTitle}>NET SALARY PAYABLE:</Text>
          <Text style={styles.netSalaryValue}>{formatINR(calc.netSalary)}</Text>
        </View>

        {/* Signatures */}
        <View style={styles.signaturesRow}>
          <View style={styles.sigCol}>
            <View style={styles.sigLine} />
            <Text style={styles.sigText}>Accounts Officer</Text>
          </View>
          <View style={styles.sigCol}>
            <View style={styles.sigLine} />
            <Text style={styles.sigText}>Principal / Manager</Text>
          </View>
          <View style={styles.sigCol}>
            <View style={styles.sigLine} />
            <Text style={styles.sigText}>Employee Signature</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { padding: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 12 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 13.5, fontWeight: '700', color: '#4361EE' },
  actionsRight: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  printBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EEF2FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.md },
  printBtnText: { fontSize: 12.5, fontWeight: '800', color: '#4361EE' },
  whatsappBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#25D366', paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.md },
  whatsappBtnText: { fontSize: 12.5, fontWeight: '800', color: '#FFFFFF' },
  teacherChips: { flexDirection: 'row', marginBottom: 16, maxHeight: 40 },
  tChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4DDE6', marginRight: 8 },
  tChipActive: { backgroundColor: '#4361EE', borderColor: '#4361EE' },
  tChipText: { fontSize: 12, fontWeight: '700', color: '#6B5A72' },
  tChipTextActive: { color: '#FFFFFF' },
  slipCard: { backgroundColor: '#FFFFFF', borderRadius: Radius.lg, padding: 26, borderWidth: 1, borderColor: 'rgba(61, 23, 71, 0.08)', ...Shadows.md, maxWidth: 720, alignSelf: 'center', width: '100%' },
  slipHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  schoolLogo: { width: 56, height: 56 },
  schoolInfo: { flex: 1 },
  schoolTitle: { fontSize: 16, fontWeight: '900', color: Colors.primary, letterSpacing: -0.2 },
  schoolSub: { fontSize: 11.5, color: '#6B5A72', marginTop: 1 },
  voucherBadge: { fontSize: 10, fontWeight: '800', color: '#B8860B', letterSpacing: 0.8, marginTop: 4 },
  metaDivider: { height: 1, backgroundColor: '#EDE8F0', marginVertical: 16 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 18 },
  gridItem: { width: '47%' },
  gridLabel: { fontSize: 11, color: '#8A7B8E', fontWeight: '600' },
  gridValue: { fontSize: 13, fontWeight: '700', color: '#1B1C1A', marginTop: 2 },
  breakdownTable: { borderWidth: 1, borderColor: '#EDE8F0', borderRadius: 10, padding: 14, marginBottom: 18 },
  breakdownHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: '#F5F0F7' },
  bth: { fontSize: 11, fontWeight: '800', color: '#8A7B8E', letterSpacing: 0.5 },
  bRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6 },
  bLabel: { fontSize: 12.5, color: '#4B3F50' },
  bVal: { fontSize: 13, fontWeight: '700', color: '#1B1C1A' },
  netSalaryBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#E6F4EA', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(33, 165, 114, 0.3)', marginBottom: 26 },
  netSalaryTitle: { fontSize: 13.5, fontWeight: '800', color: '#166534' },
  netSalaryValue: { fontSize: 22, fontWeight: '900', color: '#166534' },
  signaturesRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16 },
  sigCol: { width: 100, alignItems: 'center' },
  sigLine: { height: 1, width: '100%', backgroundColor: '#D0C3CD', marginBottom: 6 },
  sigText: { fontSize: 10.5, color: '#8A7B8E', fontWeight: '600' },
});

// Monthly Salary Report & Ledger Screen with dynamic salary calculation
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';
import { getAllTeachers } from '../../services/firebase/teacherService';
import { calculateTeacherSalary } from '../../services/firebase/salaryService';
import { formatINR } from '../../utils/currencyUtils';

const MONTHS = ['September 2026', 'August 2026', 'July 2026', 'June 2026'];

export default function SalaryReportScreen({ onOpenSlip }) {
  const [teachers, setTeachers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('September 2026');

  useEffect(() => {
    getAllTeachers().then((list) => {
      setTeachers(list.length > 0 ? list : [
        { id: 't-1', teacherId: 'RPS-TCH-001', name: 'Dr. Ananya Sharma', basicSalary: 65000, phone: '9919993377' },
        { id: 't-2', teacherId: 'RPS-TCH-002', name: 'Vikramaditya Roy', basicSalary: 48000, phone: '9838012345' },
        { id: 't-3', teacherId: 'RPS-TCH-003', name: 'Meenakshi Sundaram', basicSalary: 45000, phone: '9450011223' },
        { id: 't-4', teacherId: 'RPS-TCH-004', name: 'Rajeshwari Devi', basicSalary: 42000, phone: '9792011223' },
      ]);
    });
  }, []);

  // Compute calculated salaries for each teacher for this month
  const calculatedList = teachers.map((t) => {
    const calc = calculateTeacherSalary({
      basicSalary: t.basicSalary || 45000,
      totalWorkingDays: 30,
      presentDays: 28,
      absentDays: 1,
      leaveDays: 1,
      customDeductions: 0,
    });
    return { ...t, ...calc };
  });

  const totalPayroll = calculatedList.reduce((acc, t) => acc + t.netSalary, 0);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Faculty Monthly Payroll Ledger</Text>
          <Text style={styles.subtitle}>
            Net Payroll: <Text style={{ color: '#21A572', fontWeight: '800' }}>{formatINR(totalPayroll)}</Text> • Period: {selectedMonth}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.slipBtn}
          onPress={() => onOpenSlip && onOpenSlip(teachers[0])}
        >
          <Ionicons name="receipt-outline" size={17} color="#4361EE" />
          <Text style={styles.slipBtnText}>Create Salary Slip</Text>
        </TouchableOpacity>
      </View>

      {/* Month Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
        {MONTHS.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.chip, selectedMonth === m && styles.chipActive]}
            onPress={() => setSelectedMonth(m)}
          >
            <Text style={[styles.chipText, selectedMonth === m && styles.chipTextActive]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Salary Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableWrap}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { width: 150 }]}>TEACHER</Text>
            <Text style={[styles.th, { width: 90, textAlign: 'right' }]}>BASIC</Text>
            <Text style={[styles.th, { width: 70, textAlign: 'center' }]}>PRESENT</Text>
            <Text style={[styles.th, { width: 70, textAlign: 'center' }]}>ABSENT</Text>
            <Text style={[styles.th, { width: 70, textAlign: 'center' }]}>LEAVE</Text>
            <Text style={[styles.th, { width: 90, textAlign: 'right' }]}>DEDUCTION</Text>
            <Text style={[styles.th, { width: 110, textAlign: 'right' }]}>NET SALARY</Text>
            <Text style={[styles.th, { width: 100, textAlign: 'center' }]}>STATUS</Text>
            <Text style={[styles.th, { width: 90, textAlign: 'right' }]}>ACTION</Text>
          </View>

          <FlatList
            data={calculatedList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <View style={{ width: 150 }}>
                  <Text style={styles.tName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.tSubText}>{item.teacherId}</Text>
                </View>
                <Text style={[styles.tdText, { width: 90, textAlign: 'right' }]}>{formatINR(item.basicSalary)}</Text>
                <Text style={[styles.tdText, { width: 70, textAlign: 'center' }]}>{item.presentDays}d</Text>
                <Text style={[styles.tdText, { width: 70, textAlign: 'center', color: '#E53935' }]}>{item.absentDays}d</Text>
                <Text style={[styles.tdText, { width: 70, textAlign: 'center', color: '#4361EE' }]}>{item.leaveDays}d</Text>
                <Text style={[styles.tdText, { width: 90, textAlign: 'right', color: '#E53935' }]}>{formatINR(item.deductions)}</Text>
                <Text style={[styles.tdText, { width: 110, textAlign: 'right', fontWeight: '800', color: '#21A572' }]}>
                  {formatINR(item.netSalary)}
                </Text>
                <View style={{ width: 100, alignItems: 'center' }}>
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidText}>Processed</Text>
                  </View>
                </View>
                <View style={{ width: 90, alignItems: 'flex-end' }}>
                  <TouchableOpacity
                    style={styles.viewSlipBtn}
                    onPress={() => onOpenSlip && onOpenSlip(item)}
                  >
                    <Text style={styles.viewSlipText}>Slip 📄</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', padding: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#1B1C1A' },
  subtitle: { fontSize: 12.5, color: '#8A7B8E', marginTop: 2 },
  slipBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EEF2FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.md },
  slipBtnText: { fontSize: 13, fontWeight: '800', color: '#4361EE' },
  monthScroll: { flexDirection: 'row', marginBottom: 16, maxHeight: 40 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4DDE6', marginRight: 8 },
  chipActive: { backgroundColor: '#4361EE', borderColor: '#4361EE' },
  chipText: { fontSize: 12, fontWeight: '700', color: '#6B5A72' },
  chipTextActive: { color: '#FFFFFF' },
  tableWrap: { backgroundColor: '#FFFFFF', borderRadius: Radius.lg, borderWidth: 1, borderColor: 'rgba(61, 23, 71, 0.08)', ...Shadows.sm, minWidth: 840, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBF9FC', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#EDE8F0' },
  th: { fontSize: 11, fontWeight: '800', color: '#8A7B8E' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F5F0F7' },
  tdText: { fontSize: 12.5, color: '#4B3F50' },
  tName: { fontSize: 13, fontWeight: '700', color: '#1B1C1A' },
  tSubText: { fontSize: 11, color: '#8A7B8E', marginTop: 1 },
  paidBadge: { backgroundColor: '#E6F4EA', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  paidText: { fontSize: 11, fontWeight: '800', color: '#166534' },
  viewSlipBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: '#FAF8FC' },
  viewSlipText: { fontSize: 11.5, fontWeight: '700', color: '#4361EE' },
});

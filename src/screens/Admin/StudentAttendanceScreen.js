// Student Daily Attendance Marking Screen for RPS Admin Panel
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';
import { subscribeToStudents } from '../../services/firebase/studentService';
import {
  getStudentAttendanceForDate,
  saveStudentAttendance,
} from '../../services/firebase/attendanceService';
import { toDateKey, formatDate } from '../../utils/dateUtils';

const CLASS_FILTERS = ['All', 'Nursery-A', 'LKG-A', 'UKG-A', '1-A', '2-A', '3-A', '4-A', '5-A'];

export const ALL_STUDENTS_LIST = [
  { id: 'sample-1', uid: 'RPS-NURA-034', name: 'Shaanvi Yadav', parentName: 'Virendra Yadav', phone: '9919993377', class: 'Nursery-A', totalFee: 25000, paidFee: 5000, pendingFee: 20000, status: 'active', transportRequired: true },
  { id: 'sample-2', uid: 'RPS-2A-009', name: 'Swaransh Gupta', parentName: 'Manoj Gupta', phone: '9838012345', class: '2-A', totalFee: 28000, paidFee: 18000, pendingFee: 10000, status: 'active', transportRequired: false },
  { id: 'sample-3', uid: 'RPS-NURA-039', name: 'Trisha Giri', parentName: 'Anil Giri', phone: '9792054321', class: 'Nursery-A', totalFee: 25000, paidFee: 5400, pendingFee: 19600, status: 'active', transportRequired: true },
  { id: 'sample-4', uid: 'RPS-1A-012', name: 'Rahul Sharma', parentName: 'Rajesh Sharma', phone: '9450011223', class: '1-A', totalFee: 30000, paidFee: 20000, pendingFee: 10000, status: 'active', transportRequired: false },
  { id: 'sample-5', uid: 'RPS-3A-018', name: 'Aarav Patel', parentName: 'Sunil Patel', phone: '9876543210', class: '3-A', totalFee: 32000, paidFee: 22000, pendingFee: 10000, status: 'active', transportRequired: true },
  { id: 'sample-6', uid: 'RPS-LKGA-022', name: 'Diya Verma', parentName: 'Kunal Verma', phone: '9876501234', class: 'LKG-A', totalFee: 26000, paidFee: 16000, pendingFee: 10000, status: 'active', transportRequired: false },
  { id: 'sample-7', uid: 'RPS-UKGA-015', name: 'Kabir Chaurasia', parentName: 'Mohan Chaurasia', phone: '9450123456', class: 'UKG-A', totalFee: 26000, paidFee: 10000, pendingFee: 16000, status: 'active', transportRequired: true },
  { id: 'sample-8', uid: 'RPS-4A-007', name: 'Ananya Srivastava', parentName: 'Deepak Srivastava', phone: '9918012345', class: '4-A', totalFee: 34000, paidFee: 25000, pendingFee: 9000, status: 'active', transportRequired: false },
  { id: 'sample-9', uid: 'RPS-5A-011', name: 'Ishaan Pandey', parentName: 'Ramesh Pandey', phone: '9839054321', class: '5-A', totalFee: 36000, paidFee: 28000, pendingFee: 8000, status: 'active', transportRequired: true },
];

export default function StudentAttendanceScreen() {
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(new Date()));
  const [students, setStudents] = useState(ALL_STUDENTS_LIST);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 1. Subscribe to Students Directory in real time
    const unsubscribe = subscribeToStudents((list) => {
      const activeList = list && list.length > 0 ? list : ALL_STUDENTS_LIST;
      setStudents(activeList);

      // 2. Fetch existing attendance records for the selected date
      getStudentAttendanceForDate(selectedDateKey).then((existingRecords) => {
        const initialMap = { ...existingRecords };
        activeList.forEach((s) => {
          if (!initialMap[s.id]) {
            initialMap[s.id] = 'present'; // default to present
          }
        });
        setAttendanceMap(initialMap);
        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, [selectedDateKey]);

  const handleMark = (studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status) => {
    const updated = { ...attendanceMap };
    students.forEach((s) => {
      if (selectedClass === 'All' || s.class === selectedClass) {
        updated[s.id] = status;
      }
    });
    setAttendanceMap(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveStudentAttendance(selectedDateKey, attendanceMap);
      Alert.alert('Saved!', `Attendance for ${selectedDateKey} successfully saved to database.`);
    } catch (err) {
      Alert.alert('Save Failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesClass = selectedClass === 'All' || s.class === selectedClass;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.uid.toLowerCase().includes(q);
    return matchesClass && matchesSearch;
  });

  const presentCount = filteredStudents.filter((s) => attendanceMap[s.id] === 'present').length;
  const absentCount = filteredStudents.filter((s) => attendanceMap[s.id] === 'absent').length;
  const lateCount = filteredStudents.filter((s) => attendanceMap[s.id] === 'late').length;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Student Attendance Register</Text>
          <Text style={styles.subtitle}>
            Showing all <Text style={{ fontWeight: '800', color: '#4361EE' }}>{students.length} enrolled students</Text> • Date: {formatDate(selectedDateKey)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.88}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnText}>Save Attendance</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Attendance Metrics Bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryBadge}>
          <Text style={styles.summaryLabel}>Total:</Text>
          <Text style={styles.summaryVal}>{filteredStudents.length}</Text>
        </View>
        <View style={[styles.summaryBadge, { backgroundColor: '#E6F4EA' }]}>
          <Text style={[styles.summaryLabel, { color: '#166534' }]}>Present:</Text>
          <Text style={[styles.summaryVal, { color: '#166534' }]}>{presentCount}</Text>
        </View>
        <View style={[styles.summaryBadge, { backgroundColor: '#FDE8E8' }]}>
          <Text style={[styles.summaryLabel, { color: '#991B1B' }]}>Absent:</Text>
          <Text style={[styles.summaryVal, { color: '#991B1B' }]}>{absentCount}</Text>
        </View>
        <View style={[styles.summaryBadge, { backgroundColor: '#FEF7E0' }]}>
          <Text style={[styles.summaryLabel, { color: '#8A6300' }]}>Late:</Text>
          <Text style={[styles.summaryVal, { color: '#8A6300' }]}>{lateCount}</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={17} color="#8A7B8E" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search student by name or UID..."
          placeholderTextColor="#A199A3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={17} color="#8A7B8E" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Class Filters & Bulk Actions */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          {CLASS_FILTERS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, selectedClass === c && styles.chipActive]}
              onPress={() => setSelectedClass(c)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, selectedClass === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.bulkActions}>
          <TouchableOpacity onPress={() => handleMarkAll('present')} style={styles.quickAction}>
            <Text style={styles.quickActionText}>All Present</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMarkAll('absent')} style={styles.quickAction}>
            <Text style={styles.quickActionText}>All Absent</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Attendance List */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#4361EE" />
          <Text style={styles.loadingText}>Loading students for attendance...</Text>
        </View>
      ) : filteredStudents.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="people-outline" size={44} color="#D0C3CD" />
          <Text style={styles.emptyTitle}>No Students Found</Text>
          <Text style={styles.emptySub}>No student records match this filter.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id || item.uid}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const status = attendanceMap[item.id] || 'present';
            return (
              <View style={styles.studentRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stName}>{item.name}</Text>
                  <Text style={styles.stMeta}>
                    UID: <Text style={{ color: '#4361EE', fontWeight: '700' }}>{item.uid}</Text> • Class: {item.class} • C/O {item.parentName || 'Parent'}
                  </Text>
                </View>

                {/* Status Toggles: Present, Absent, Late */}
                <View style={styles.toggleGroup}>
                  <TouchableOpacity
                    style={[styles.toggleBtn, status === 'present' && styles.btnPresent]}
                    onPress={() => handleMark(item.id, 'present')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.toggleText, status === 'present' && { color: '#FFFFFF' }]}>P</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.toggleBtn, status === 'absent' && styles.btnAbsent]}
                    onPress={() => handleMark(item.id, 'absent')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.toggleText, status === 'absent' && { color: '#FFFFFF' }]}>A</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.toggleBtn, status === 'late' && styles.btnLate]}
                    onPress={() => handleMark(item.id, 'late')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.toggleText, status === 'late' && { color: '#FFFFFF' }]}>L</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#1B1C1A' },
  subtitle: { fontSize: 12.5, color: '#8A7B8E', marginTop: 2 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#21A572', paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.md, ...Shadows.sm },
  saveBtnText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  summaryBar: { flexDirection: 'row', gap: 10, marginBottom: 12, flexWrap: 'wrap' },
  summaryBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: '#EDE8F0' },
  summaryLabel: { fontSize: 12, fontWeight: '600', color: '#6B5A72' },
  summaryVal: { fontSize: 13, fontWeight: '800', color: '#1B1C1A' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#EDE8F0',
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#1B1C1A' },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 10, height: 44 },
  filterScroll: { flex: 1, height: 44 },
  filterScrollContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2, paddingRight: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderColor: '#E4DDE6', marginRight: 6, justifyContent: 'center', alignItems: 'center', ...Shadows.sm },
  chipActive: { backgroundColor: '#4361EE', borderColor: '#4361EE' },
  chipText: { fontSize: 12.5, fontWeight: '700', color: '#6B5A72', includeFontPadding: false },
  chipTextActive: { color: '#FFFFFF' },
  bulkActions: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  quickAction: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#DCE4FD' },
  quickActionText: { fontSize: 11.5, fontWeight: '700', color: '#4361EE', includeFontPadding: false },
  centerLoading: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loadingText: { marginTop: 10, fontSize: 13, color: '#8A7B8E' },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: '#4B3F50', marginTop: 8 },
  emptySub: { fontSize: 12, color: '#8A7B8E', marginTop: 3 },
  studentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(61, 23, 71, 0.08)', marginBottom: 8, ...Shadows.sm },
  stName: { fontSize: 14, fontWeight: '800', color: '#1B1C1A' },
  stMeta: { fontSize: 11.5, color: '#8A7B8E', marginTop: 2 },
  toggleGroup: { flexDirection: 'row', gap: 8 },
  toggleBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#FAF8FC', borderWidth: 1, borderColor: '#E4DDE6', alignItems: 'center', justifyContent: 'center' },
  btnPresent: { backgroundColor: '#21A572', borderColor: '#21A572' },
  btnAbsent: { backgroundColor: '#E53935', borderColor: '#E53935' },
  btnLate: { backgroundColor: '#EAA315', borderColor: '#EAA315' },
  toggleText: { fontSize: 13, fontWeight: '800', color: '#4B3F50' },
});

// Student Directory & Management Screen for RPS Admin Panel
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
import {
  subscribeToStudents,
  deleteStudent,
} from '../../services/firebase/studentService';
import { formatINR } from '../../utils/currencyUtils';
import StudentFormModal from '../../components/Admin/StudentFormModal';
import ConfirmModal from '../../components/Admin/ConfirmModal';

const CLASS_FILTERS = ['All', 'Nursery-A', 'LKG-A', 'UKG-A', '1-A', '2-A', '3-A', '4-A', '5-A', '6-A'];

// Default sample data if Firestore is empty initially
const SAMPLE_STUDENTS = [
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

export default function StudentsScreen({ onSelectStudent }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');

  // Modals
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToStudents((list) => {
      if (list && list.length > 0) {
        setStudents(list);
      } else {
        setStudents(SAMPLE_STUDENTS);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter students based on search and class filter
  const filteredStudents = students.filter((st) => {
    const matchesClass = selectedClass === 'All' || st.class === selectedClass;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      st.name.toLowerCase().includes(query) ||
      st.uid.toLowerCase().includes(query) ||
      (st.phone && st.phone.includes(query)) ||
      (st.class && st.class.toLowerCase().includes(query));

    return matchesClass && matchesSearch;
  });

  const handleEdit = (st) => {
    setEditingStudent(st);
    setFormModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      if (!studentToDelete.id.startsWith('sample-')) {
        await deleteStudent(studentToDelete.id, studentToDelete.name);
      } else {
        setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not delete student.');
    } finally {
      setStudentToDelete(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Header with Stats & Actions */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>Student Directory</Text>
          <Text style={styles.pageSubtitle}>
            Showing {filteredStudents.length} of {students.length} enrolled students
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setEditingStudent(null);
            setFormModalVisible(true);
          }}
          activeOpacity={0.88}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Register Student</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Search & Filters Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#8A7B8E" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by student name, UID, class or phone..."
            placeholderTextColor="#A199A3"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#8A7B8E" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Class Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          {CLASS_FILTERS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.filterChip, selectedClass === c && styles.filterChipActive]}
              onPress={() => setSelectedClass(c)}
            >
              <Text style={[styles.filterChipText, selectedClass === c && styles.filterChipTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Students Table / List */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#4361EE" />
          <Text style={styles.loadingText}>Loading student records...</Text>
        </View>
      ) : filteredStudents.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="people-outline" size={48} color="#D0C3CD" />
          <Text style={styles.emptyTitle}>No students found</Text>
          <Text style={styles.emptySub}>Try adjusting your search terms or class filters</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableWrap}>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.colUid]}>UID</Text>
              <Text style={[styles.th, styles.colName]}>NAME</Text>
              <Text style={[styles.th, styles.colClass]}>CLASS</Text>
              <Text style={[styles.th, styles.colFee]}>TOTAL FEE</Text>
              <Text style={[styles.th, styles.colFee]}>PAID</Text>
              <Text style={[styles.th, styles.colFee]}>LEFT</Text>
              <Text style={[styles.th, styles.colStatus]}>STATUS</Text>
              <Text style={[styles.th, styles.colAction]}>ACTION</Text>
            </View>

            {/* Rows */}
            <FlatList
              data={filteredStudents}
              keyExtractor={(item) => item.id || item.uid}
              renderItem={({ item }) => {
                const total = item.totalFee || 0;
                const paid = item.paidFee || 0;
                const pending = item.pendingFee !== undefined ? item.pendingFee : Math.max(0, total - paid);

                return (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tdUid, styles.colUid]} numberOfLines={1}>
                      {item.uid}
                    </Text>
                    <View style={styles.colName}>
                      <Text style={styles.tdName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      {item.parentName ? (
                        <Text style={styles.tdParent} numberOfLines={1}>
                          C/O {item.parentName}
                        </Text>
                      ) : null}
                    </View>
                    <Text style={[styles.tdText, styles.colClass]} numberOfLines={1}>
                      {item.class}
                    </Text>
                    <Text style={[styles.tdText, styles.colFee]} numberOfLines={1}>
                      {formatINR(total)}
                    </Text>
                    <Text style={[styles.tdPaid, styles.colFee]} numberOfLines={1}>
                      {formatINR(paid)}
                    </Text>
                    <Text style={[styles.tdPending, styles.colFee]} numberOfLines={1}>
                      {formatINR(pending)}
                    </Text>
                    <View style={styles.colStatus}>
                      <View style={[styles.statusBadge, item.status === 'active' ? styles.statusActive : styles.statusInactive]}>
                        <Text style={[styles.statusText, item.status === 'active' ? styles.statusTextActive : styles.statusTextInactive]}>
                          {item.status || 'Active'}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.actionRow, styles.colAction]}>
                      <TouchableOpacity
                        style={styles.iconActionBtn}
                        onPress={() => onSelectStudent && onSelectStudent(item)}
                        title="View Details"
                      >
                        <Ionicons name="eye-outline" size={17} color="#4361EE" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconActionBtn}
                        onPress={() => handleEdit(item)}
                        title="Edit Student"
                      >
                        <Ionicons name="create-outline" size={17} color="#21A572" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconActionBtn}
                        onPress={() => setStudentToDelete(item)}
                        title="Delete Student"
                      >
                        <Ionicons name="trash-outline" size={17} color="#E53935" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </ScrollView>
      )}

      {/* Student Form Modal */}
      <StudentFormModal
        visible={formModalVisible}
        initialData={editingStudent}
        onClose={() => {
          setFormModalVisible(false);
          setEditingStudent(null);
        }}
        onSuccess={() => {}}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={!!studentToDelete}
        title="Delete Student Record"
        message={`Are you sure you want to permanently remove ${studentToDelete?.name} (${studentToDelete?.uid})? This action cannot be undone.`}
        confirmText="Delete Student"
        isDestructive={true}
        icon="trash"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setStudentToDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B1C1A',
  },
  pageSubtitle: {
    fontSize: 12.5,
    color: '#8A7B8E',
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4361EE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.md,
    gap: 6,
    ...Shadows.sm,
  },
  addBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  searchSection: {
    marginBottom: 16,
    gap: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#1B1C1A',
  },
  filterScroll: {
    height: 44,
    flexGrow: 0,
    marginTop: 4,
  },
  filterScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E4DDE6',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  filterChipActive: {
    backgroundColor: '#4361EE',
    borderColor: '#4361EE',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B5A72',
    includeFontPadding: false,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13.5,
    color: '#8A7B8E',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4B3F50',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12.5,
    color: '#8A7B8E',
    marginTop: 4,
  },
  tableWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.sm,
    minWidth: 840,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF9FC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE8F0',
  },
  th: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A7B8E',
    letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0F7',
  },
  colUid: { width: 130 },
  colName: { width: 180 },
  colClass: { width: 80 },
  colFee: { width: 90, textAlign: 'right' },
  colStatus: { width: 90, alignItems: 'center' },
  colAction: { width: 110, justifyContent: 'flex-end' },
  tdUid: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#4361EE',
  },
  tdName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1B1C1A',
  },
  tdParent: {
    fontSize: 11,
    color: '#8A7B8E',
  },
  tdText: {
    fontSize: 12.5,
    color: '#4B3F50',
    fontWeight: '500',
  },
  tdPaid: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#21A572',
  },
  tdPending: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#EAA315',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#E6F4EA',
  },
  statusInactive: {
    backgroundColor: '#F5F0F7',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextActive: {
    color: '#166534',
  },
  statusTextInactive: {
    color: '#6B5A72',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FAF8FC',
  },
});

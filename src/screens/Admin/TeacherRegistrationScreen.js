// Teacher Registration & Faculty Management Screen for RPS Admin Panel
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';
import {
  subscribeToTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
} from '../../services/firebase/teacherService';
import { formatINR } from '../../utils/currencyUtils';

const DEFAULT_TEACHERS = [
  { id: 't-1', teacherId: 'RPS-TCH-001', name: 'Dr. Ananya Sharma', subject: 'Principal / Biology', email: 'ananya@rps.com', phone: '9919993377', qualification: 'Ph.D., M.Sc., B.Ed.', basicSalary: 65000, status: 'active' },
  { id: 't-2', teacherId: 'RPS-TCH-002', name: 'Vikramaditya Roy', subject: 'Mathematics & Robotics', email: 'vikram@rps.com', phone: '9838012345', qualification: 'M.Sc. Mathematics, B.Ed.', basicSalary: 48000, status: 'active' },
  { id: 't-3', teacherId: 'RPS-TCH-003', name: 'Meenakshi Sundaram', subject: 'English & Literature', email: 'meenakshi@rps.com', phone: '9450011223', qualification: 'M.A. English, B.Ed.', basicSalary: 45000, status: 'active' },
  { id: 't-4', teacherId: 'RPS-TCH-004', name: 'Rajeshwari Devi', subject: 'Hindi & Sanskrit', email: 'rajeshwari@rps.com', phone: '9792011223', qualification: 'M.A., B.Ed.', basicSalary: 42000, status: 'active' },
];

export default function TeacherRegistrationScreen() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [qualification, setQualification] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    const unsub = subscribeToTeachers((list) => {
      if (list && list.length > 0) {
        setTeachers(list);
      } else {
        setTeachers(DEFAULT_TEACHERS);
      }
    });
    return () => unsub();
  }, []);

  const openForm = (t = null) => {
    if (t) {
      setEditingTeacher(t);
      setName(t.name);
      setTeacherId(t.teacherId);
      setEmail(t.email);
      setPhone(t.phone);
      setSubject(t.subject);
      setQualification(t.qualification);
      setBasicSalary(String(t.basicSalary || ''));
      setStatus(t.status || 'active');
    } else {
      setEditingTeacher(null);
      setName('');
      setTeacherId(`RPS-TCH-${Date.now().toString().slice(-4)}`);
      setEmail('');
      setPhone('');
      setSubject('');
      setQualification('');
      setBasicSalary('45000');
      setStatus('active');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter teacher name.');
      return;
    }

    try {
      const payload = {
        name,
        teacherId,
        email,
        phone,
        subject,
        qualification,
        basicSalary,
        status,
      };

      if (editingTeacher && !editingTeacher.id.startsWith('t-')) {
        await updateTeacher(editingTeacher.id, payload);
      } else if (!editingTeacher) {
        await addTeacher(payload);
      } else {
        setTeachers((prev) =>
          prev.map((item) => (item.id === editingTeacher.id ? { ...item, ...payload } : item))
        );
      }
      setModalVisible(false);
    } catch (err) {
      Alert.alert('Save Failed', err.message);
    }
  };

  const handleDelete = async (t) => {
    try {
      if (!t.id.startsWith('t-')) {
        await deleteTeacher(t.id, t.name);
      } else {
        setTeachers((prev) => prev.filter((item) => item.id !== t.id));
      }
    } catch (err) {
      Alert.alert('Delete Failed', err.message);
    }
  };

  const filtered = teachers.filter((t) => {
    const q = search.toLowerCase();
    return !q || t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.teacherId.toLowerCase().includes(q);
  });

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Faculty Directory & Registration</Text>
          <Text style={styles.subtitle}>Manage teacher credentials, subject allocations & monthly payroll bases</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => openForm(null)}>
          <Ionicons name="person-add" size={17} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Register Teacher</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={17} color="#8A7B8E" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search teachers by name, subject or teacher ID..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Teachers Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableWrap}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { width: 120 }]}>TEACHER ID</Text>
            <Text style={[styles.th, { width: 170 }]}>NAME</Text>
            <Text style={[styles.th, { width: 150 }]}>SUBJECT</Text>
            <Text style={[styles.th, { width: 120 }]}>CONTACT</Text>
            <Text style={[styles.th, { width: 100, textAlign: 'right' }]}>BASE SALARY</Text>
            <Text style={[styles.th, { width: 90, textAlign: 'center' }]}>STATUS</Text>
            <Text style={[styles.th, { width: 90, textAlign: 'right' }]}>ACTION</Text>
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={[styles.tdText, { width: 120, color: '#4361EE', fontWeight: '700' }]}>{item.teacherId}</Text>
                <View style={{ width: 170 }}>
                  <Text style={styles.tName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.tSubText} numberOfLines={1}>{item.qualification}</Text>
                </View>
                <Text style={[styles.tdText, { width: 150 }]} numberOfLines={1}>{item.subject}</Text>
                <Text style={[styles.tdText, { width: 120 }]}>{item.phone || item.email || '-'}</Text>
                <Text style={[styles.tdText, { width: 100, textAlign: 'right', fontWeight: '800', color: '#1B1C1A' }]}>
                  {formatINR(item.basicSalary)}
                </Text>
                <View style={{ width: 90, alignItems: 'center' }}>
                  <View style={[styles.badge, item.status === 'active' ? styles.badgeActive : styles.badgeInactive]}>
                    <Text style={[styles.badgeText, item.status === 'active' ? styles.badgeTextActive : styles.badgeTextInactive]}>
                      {item.status || 'active'}
                    </Text>
                  </View>
                </View>
                <View style={{ width: 90, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                  <TouchableOpacity onPress={() => openForm(item)} style={{ padding: 4 }}>
                    <Ionicons name="create-outline" size={17} color="#4361EE" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item)} style={{ padding: 4 }}>
                    <Ionicons name="trash-outline" size={17} color="#E53935" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Add / Edit Teacher Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>{editingTeacher ? 'Edit Teacher Record' : 'Register New Faculty Mentor'}</Text>

            <ScrollView style={{ maxHeight: 440 }}>
              <View style={styles.field}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Vikramaditya Roy" />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Teacher ID</Text>
                <TextInput style={styles.input} value={teacherId} onChangeText={setTeacherId} placeholder="RPS-TCH-005" />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Teaching Subject(s) *</Text>
                <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="e.g. Mathematics & AI Lab" />
              </View>

              <View style={styles.row}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Contact Phone</Text>
                  <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+91 99199 93377" />
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Monthly Base Salary (₹)</Text>
                  <TextInput style={styles.input} value={basicSalary} onChangeText={setBasicSalary} keyboardType="numeric" placeholder="45000" />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Academic Qualifications</Text>
                <TextInput style={styles.input} value={qualification} onChangeText={setQualification} placeholder="e.g. M.Sc., B.Ed." />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="teacher@rps.com" />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>Save Faculty Record</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', padding: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#1B1C1A' },
  subtitle: { fontSize: 12.5, color: '#8A7B8E', marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#4361EE', paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.md },
  addBtnText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 1, borderColor: '#EDE8F0', marginBottom: 14, ...Shadows.sm },
  searchInput: { flex: 1, fontSize: 13.5, color: '#1B1C1A' },
  tableWrap: { backgroundColor: '#FFFFFF', borderRadius: Radius.lg, borderWidth: 1, borderColor: 'rgba(61, 23, 71, 0.08)', ...Shadows.sm, minWidth: 840, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBF9FC', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#EDE8F0' },
  th: { fontSize: 11, fontWeight: '800', color: '#8A7B8E' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F5F0F7' },
  tdText: { fontSize: 12.5, color: '#4B3F50' },
  tName: { fontSize: 13.5, fontWeight: '700', color: '#1B1C1A' },
  tSubText: { fontSize: 11, color: '#8A7B8E', marginTop: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeActive: { backgroundColor: '#E6F4EA' },
  badgeInactive: { backgroundColor: '#F5F0F7' },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeTextActive: { color: '#166534' },
  badgeTextInactive: { color: '#6B5A72' },
  backdrop: { flex: 1, backgroundColor: 'rgba(26, 0, 34, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: Radius.xl, padding: 22, maxWidth: 500, width: '100%', ...Shadows.lg },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#1B1C1A', marginBottom: 14 },
  field: { marginBottom: 10 },
  row: { flexDirection: 'row', gap: 10 },
  label: { fontSize: 12, fontWeight: '700', color: '#4B3F50', marginBottom: 4 },
  input: { backgroundColor: '#FAF8F5', borderWidth: 1, borderColor: '#E4DDE6', borderRadius: 10, paddingHorizontal: 12, height: 42, fontSize: 13, color: '#1B1C1A' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cancelBtn: { flex: 1, paddingVertical: 10, backgroundColor: '#F5F0F7', borderRadius: 10, alignItems: 'center' },
  cancelText: { fontSize: 13, fontWeight: '700', color: '#6B5A72' },
  saveBtn: { flex: 2, paddingVertical: 10, backgroundColor: '#4361EE', borderRadius: 10, alignItems: 'center' },
  saveText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
});

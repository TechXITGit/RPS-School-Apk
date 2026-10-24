// Teacher Attendance Register Screen (Present, Absent, Half Day, Leave)
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';
import { getAllTeachers } from '../../services/firebase/teacherService';
import {
  getTeacherAttendanceForDate,
  saveTeacherAttendance,
} from '../../services/firebase/attendanceService';
import { toDateKey, formatDate } from '../../utils/dateUtils';

const DEFAULT_TEACHERS = [
  { id: 't-1', teacherId: 'RPS-TCH-001', name: 'Dr. Ananya Sharma', subject: 'Principal / Biology' },
  { id: 't-2', teacherId: 'RPS-TCH-002', name: 'Vikramaditya Roy', subject: 'Mathematics & Robotics' },
  { id: 't-3', teacherId: 'RPS-TCH-003', name: 'Meenakshi Sundaram', subject: 'English & Literature' },
  { id: 't-4', teacherId: 'RPS-TCH-004', name: 'Rajeshwari Devi', subject: 'Hindi & Sanskrit' },
];

export default function TeacherAttendanceScreen() {
  const [dateKey, setDateKey] = useState(toDateKey(new Date()));
  const [teachers, setTeachers] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const list = await getAllTeachers();
      const teacherList = list.length > 0 ? list : DEFAULT_TEACHERS;
      setTeachers(teacherList);

      const saved = await getTeacherAttendanceForDate(dateKey);
      const initial = { ...saved };
      teacherList.forEach((t) => {
        if (!initial[t.id]) {
          initial[t.id] = 'present';
        }
      });
      setAttendanceMap(initial);
    }
    load();
  }, [dateKey]);

  const handleMark = (id, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveTeacherAttendance(dateKey, attendanceMap);
      Alert.alert('Saved!', `Faculty attendance for ${dateKey} updated successfully.`);
    } catch (err) {
      Alert.alert('Save Failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const counts = {
    present: Object.values(attendanceMap).filter((v) => v === 'present').length,
    absent: Object.values(attendanceMap).filter((v) => v === 'absent').length,
    half_day: Object.values(attendanceMap).filter((v) => v === 'half_day').length,
    leave: Object.values(attendanceMap).filter((v) => v === 'leave').length,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Faculty Daily Attendance</Text>
          <Text style={styles.subtitle}>
            Session: <Text style={{ fontWeight: '800', color: '#4361EE' }}>{formatDate(dateKey)}</Text> ({dateKey})
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnText}>Save Faculty Attendance</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Summary Metrics */}
      <View style={styles.summaryRow}>
        <View style={[styles.badge, { backgroundColor: '#E6F4EA' }]}>
          <Text style={[styles.badgeText, { color: '#166534' }]}>Present: {counts.present}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: '#FEF7E0' }]}>
          <Text style={[styles.badgeText, { color: '#8A6300' }]}>Half Day: {counts.half_day}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: '#EEF2FF' }]}>
          <Text style={[styles.badgeText, { color: '#4361EE' }]}>Leave: {counts.leave}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: '#FDE8E8' }]}>
          <Text style={[styles.badgeText, { color: '#991B1B' }]}>Absent: {counts.absent}</Text>
        </View>
      </View>

      {/* Teachers List */}
      <FlatList
        data={teachers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => {
          const status = attendanceMap[item.id] || 'present';
          return (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tName}>{item.name}</Text>
                <Text style={styles.tMeta}>{item.teacherId} • {item.subject}</Text>
              </View>

              {/* 4 Status Buttons: Present, Absent, Half Day, Leave */}
              <View style={styles.btnRow}>
                {[
                  { key: 'present', label: 'Present' },
                  { key: 'half_day', label: 'Half Day' },
                  { key: 'leave', label: 'Leave' },
                  { key: 'absent', label: 'Absent' },
                ].map((s) => {
                  const isActive = status === s.key;
                  return (
                    <TouchableOpacity
                      key={s.key}
                      style={[styles.statusBtn, isActive && styles.statusBtnActive]}
                      onPress={() => handleMark(item.id, s.key)}
                    >
                      <Text style={[styles.statusBtnText, isActive && { color: '#FFFFFF' }]}>
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        }}
      />
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
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '800' },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(61, 23, 71, 0.08)', marginBottom: 8, ...Shadows.sm, flexWrap: 'wrap', gap: 10 },
  tName: { fontSize: 14, fontWeight: '800', color: '#1B1C1A' },
  tMeta: { fontSize: 11.5, color: '#8A7B8E', marginTop: 2 },
  btnRow: { flexDirection: 'row', gap: 6 },
  statusBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#FAF8FC', borderWidth: 1, borderColor: '#E4DDE6' },
  statusBtnActive: { backgroundColor: '#4361EE', borderColor: '#4361EE' },
  statusBtnText: { fontSize: 11.5, fontWeight: '700', color: '#4B3F50' },
});

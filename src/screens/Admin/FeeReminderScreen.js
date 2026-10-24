// Fee Reminder & WhatsApp Dispatch Screen
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';
import { subscribeToStudents } from '../../services/firebase/studentService';
import { formatINR } from '../../utils/currencyUtils';
import { sendFeeReminderWhatsApp } from '../../utils/whatsapp';

export default function FeeReminderScreen() {
  const [defaulters, setDefaulters] = useState([]);
  const [search, setSearch] = useState('');
  const [remindedMap, setRemindedMap] = useState({});

  useEffect(() => {
    const unsub = subscribeToStudents((list) => {
      const pendingStudents = (list || []).filter((s) => {
        const total = parseFloat(s.totalFee) || 0;
        const paid = parseFloat(s.paidFee) || 0;
        const pending = s.pendingFee !== undefined ? s.pendingFee : Math.max(0, total - paid);
        return pending > 0;
      });
      setDefaulters(pendingStudents);
    });
    return () => unsub();
  }, []);

  const filtered = defaulters.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.uid.toLowerCase().includes(q) || (s.phone && s.phone.includes(q));
  });

  const handleSendReminder = async (student) => {
    const total = parseFloat(student.totalFee) || 0;
    const paid = parseFloat(student.paidFee) || 0;
    const pending = student.pendingFee !== undefined ? student.pendingFee : Math.max(0, total - paid);

    const success = await sendFeeReminderWhatsApp({
      parentName: student.parentName,
      studentName: student.name,
      pendingAmount: pending,
      phone: student.phone,
    });

    if (success) {
      setRemindedMap((prev) => ({
        ...prev,
        [student.id || student.uid]: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Fee Reminders & WhatsApp Dispatch</Text>
          <Text style={styles.subtitle}>
            Send customized instant payment reminders directly to parent WhatsApp numbers
          </Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={17} color="#8A7B8E" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Filter students by name, UID or contact number..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Defaulter Cards List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id || item.uid}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => {
          const total = parseFloat(item.totalFee) || 0;
          const paid = parseFloat(item.paidFee) || 0;
          const pending = item.pendingFee !== undefined ? item.pendingFee : Math.max(0, total - paid);
          const reminderSentTime = remindedMap[item.id || item.uid];

          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stName}>{item.name}</Text>
                  <Text style={styles.stMeta}>
                    Class: <Text style={{ fontWeight: '700' }}>{item.class}</Text> • Parent: {item.parentName || 'N/A'} • UID: {item.uid}
                  </Text>
                </View>

                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingText}>{formatINR(pending)} Due</Text>
                </View>
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.phoneCol}>
                  <Ionicons name="call-outline" size={15} color="#4361EE" />
                  <Text style={styles.phoneText}>+91 {item.phone || '9919993377'}</Text>
                </View>

                <View style={styles.actionsRow}>
                  {reminderSentTime && (
                    <Text style={styles.sentLabel}>✓ Sent at {reminderSentTime}</Text>
                  )}

                  <TouchableOpacity
                    style={styles.whatsappBtn}
                    onPress={() => handleSendReminder(item)}
                    activeOpacity={0.88}
                  >
                    <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.whatsappBtnText}>Send WhatsApp Reminder</Text>
                  </TouchableOpacity>
                </View>
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
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#1B1C1A' },
  subtitle: { fontSize: 12.5, color: '#8A7B8E', marginTop: 2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 1, borderColor: '#EDE8F0', marginBottom: 14, ...Shadows.sm },
  searchInput: { flex: 1, fontSize: 13.5, color: '#1B1C1A' },
  card: { backgroundColor: '#FFFFFF', borderRadius: Radius.lg, padding: 18, borderWidth: 1, borderColor: 'rgba(61, 23, 71, 0.08)', ...Shadows.sm, marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 },
  stName: { fontSize: 15, fontWeight: '800', color: '#1B1C1A' },
  stMeta: { fontSize: 12, color: '#6B5A72', marginTop: 3 },
  pendingBadge: { backgroundColor: '#FEF7E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  pendingText: { fontSize: 12.5, fontWeight: '800', color: '#8A6300' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F5F0F7' },
  phoneCol: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  phoneText: { fontSize: 13, fontWeight: '700', color: '#4361EE' },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sentLabel: { fontSize: 11.5, color: '#21A572', fontWeight: '700' },
  whatsappBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#25D366', paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.md, ...Shadows.sm },
  whatsappBtnText: { fontSize: 12.5, fontWeight: '800', color: '#FFFFFF' },
});

// Fee Defaulters Screen tracking students with pending fee balances
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';
import { subscribeToStudents } from '../../services/firebase/studentService';
import { formatINR } from '../../utils/currencyUtils';
import { sendFeeReminderWhatsApp } from '../../utils/whatsapp';

const CLASS_FILTERS = ['All', 'Nursery-A', 'LKG-A', 'UKG-A', '1-A', '2-A', '3-A', '4-A', '5-A'];

export default function FeesDefaultsScreen({ onSelectStudent }) {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = subscribeToStudents((list) => {
      // Filter only students with pending fee > 0
      const defaulters = (list || []).filter((s) => {
        const total = parseFloat(s.totalFee) || 0;
        const paid = parseFloat(s.paidFee) || 0;
        const pending = s.pendingFee !== undefined ? s.pendingFee : Math.max(0, total - paid);
        return pending > 0;
      });
      setStudents(defaulters);
    });
    return () => unsub();
  }, []);

  const filtered = students.filter((s) => {
    const matchesClass = selectedClass === 'All' || s.class === selectedClass;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      s.name.toLowerCase().includes(query) ||
      s.uid.toLowerCase().includes(query) ||
      (s.phone && s.phone.includes(query));
    return matchesClass && matchesSearch;
  });

  const totalOutstanding = filtered.reduce((acc, s) => {
    const pending = s.pendingFee !== undefined ? s.pendingFee : Math.max(0, (s.totalFee || 0) - (s.paidFee || 0));
    return acc + pending;
  }, 0);

  const handleWhatsApp = async (st) => {
    const pending = st.pendingFee !== undefined ? st.pendingFee : Math.max(0, (st.totalFee || 0) - (st.paidFee || 0));
    await sendFeeReminderWhatsApp({
      parentName: st.parentName,
      studentName: st.name,
      pendingAmount: pending,
      phone: st.phone,
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Fee Defaulters Ledger</Text>
          <Text style={styles.subtitle}>
            {filtered.length} students with outstanding fees • Total Due: <Text style={{ color: '#EAA315', fontWeight: '800' }}>{formatINR(totalOutstanding)}</Text>
          </Text>
        </View>
      </View>

      {/* Search & Class Filter */}
      <View style={styles.filterSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#8A7B8E" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search defaulter by student name, UID or phone..."
            placeholderTextColor="#A199A3"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classScroll}>
          {CLASS_FILTERS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, selectedClass === c && styles.chipActive]}
              onPress={() => setSelectedClass(c)}
            >
              <Text style={[styles.chipText, selectedClass === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Defaulters Table */}
      {filtered.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="checkmark-done-circle-outline" size={54} color="#21A572" />
          <Text style={styles.emptyTitle}>Zero Pending Defaulters!</Text>
          <Text style={styles.emptySub}>All student accounts in this filter are fully settled.</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableWrap}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { width: 120 }]}>STUDENT</Text>
              <Text style={[styles.th, { width: 100 }]}>UID</Text>
              <Text style={[styles.th, { width: 80 }]}>CLASS</Text>
              <Text style={[styles.th, { width: 90, textAlign: 'right' }]}>TOTAL</Text>
              <Text style={[styles.th, { width: 90, textAlign: 'right' }]}>PAID</Text>
              <Text style={[styles.th, { width: 100, textAlign: 'right' }]}>PENDING</Text>
              <Text style={[styles.th, { width: 110, textAlign: 'center' }]}>ACTION</Text>
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id || item.uid}
              renderItem={({ item }) => {
                const total = item.totalFee || 0;
                const paid = item.paidFee || 0;
                const pending = item.pendingFee !== undefined ? item.pendingFee : Math.max(0, total - paid);

                return (
                  <View style={styles.tableRow}>
                    <View style={{ width: 120 }}>
                      <Text style={styles.stName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.stPhone}>{item.phone || '-'}</Text>
                    </View>
                    <Text style={[styles.tdText, { width: 100, color: '#4361EE', fontWeight: '700' }]}>{item.uid}</Text>
                    <Text style={[styles.tdText, { width: 80 }]}>{item.class}</Text>
                    <Text style={[styles.tdText, { width: 90, textAlign: 'right' }]}>{formatINR(total)}</Text>
                    <Text style={[styles.tdText, { width: 90, textAlign: 'right', color: '#21A572' }]}>{formatINR(paid)}</Text>
                    <Text style={[styles.tdPending, { width: 100, textAlign: 'right' }]}>{formatINR(pending)}</Text>
                    <View style={{ width: 110, alignItems: 'center' }}>
                      <TouchableOpacity
                        style={styles.remindBtn}
                        onPress={() => handleWhatsApp(item)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="logo-whatsapp" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.remindBtnText}>Remind</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', padding: 20 },
  headerRow: { marginBottom: 14 },
  title: { fontSize: 20, fontWeight: '800', color: '#1B1C1A' },
  subtitle: { fontSize: 12.5, color: '#8A7B8E', marginTop: 2 },
  filterSection: { marginBottom: 16, gap: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 1, borderColor: '#EDE8F0', ...Shadows.sm },
  searchInput: { flex: 1, fontSize: 13.5, color: '#1B1C1A' },
  classScroll: { flexDirection: 'row' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4DDE6', marginRight: 6 },
  chipActive: { backgroundColor: '#4361EE', borderColor: '#4361EE' },
  chipText: { fontSize: 12, fontWeight: '700', color: '#6B5A72' },
  chipTextActive: { color: '#FFFFFF' },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#21A572', marginTop: 12 },
  emptySub: { fontSize: 12.5, color: '#8A7B8E', marginTop: 4 },
  tableWrap: { backgroundColor: '#FFFFFF', borderRadius: Radius.lg, borderWidth: 1, borderColor: 'rgba(61, 23, 71, 0.08)', ...Shadows.sm, minWidth: 700, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBF9FC', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#EDE8F0' },
  th: { fontSize: 11, fontWeight: '800', color: '#8A7B8E' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F5F0F7' },
  stName: { fontSize: 13, fontWeight: '700', color: '#1B1C1A' },
  stPhone: { fontSize: 11, color: '#8A7B8E', marginTop: 1 },
  tdText: { fontSize: 12.5, color: '#4B3F50' },
  tdPending: { fontSize: 13, fontWeight: '800', color: '#EAA315' },
  remindBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#25D366', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  remindBtnText: { fontSize: 11.5, fontWeight: '800', color: '#FFFFFF' },
});

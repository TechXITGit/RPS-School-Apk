// Class-wise Fees Structure Configuration Screen
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';
import {
  subscribeToFeeStructures,
  saveFeeStructure,
  deleteFeeStructure,
} from '../../services/firebase/feeService';
import { formatINR } from '../../utils/currencyUtils';

const DEFAULT_STRUCTURES = [
  { id: 'fs-1', class: 'Nursery-A', tuitionFee: 18000, transportFee: 5000, admissionFee: 2000, totalFee: 25000 },
  { id: 'fs-2', class: 'LKG-A', tuitionFee: 19000, transportFee: 5000, admissionFee: 2000, totalFee: 26000 },
  { id: 'fs-3', class: 'UKG-A', tuitionFee: 20000, transportFee: 5000, admissionFee: 2000, totalFee: 27000 },
  { id: 'fs-4', class: '1-A', tuitionFee: 20000, transportFee: 5000, admissionFee: 2000, totalFee: 27000 },
  { id: 'fs-5', class: '2-A', tuitionFee: 21000, transportFee: 5000, admissionFee: 2000, totalFee: 28000 },
  { id: 'fs-6', class: '3-A', tuitionFee: 22000, transportFee: 5000, admissionFee: 2000, totalFee: 29000 },
];

export default function FeesStructureScreen() {
  const [structures, setStructures] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [className, setClassName] = useState('');
  const [tuitionFee, setTuitionFee] = useState('');
  const [transportFee, setTransportFee] = useState('');
  const [admissionFee, setAdmissionFee] = useState('');

  useEffect(() => {
    const unsub = subscribeToFeeStructures((list) => {
      if (list && list.length > 0) {
        setStructures(list);
      } else {
        setStructures(DEFAULT_STRUCTURES);
      }
    });
    return () => unsub();
  }, []);

  const openForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setClassName(item.class);
      setTuitionFee(String(item.tuitionFee || 0));
      setTransportFee(String(item.transportFee || 0));
      setAdmissionFee(String(item.admissionFee || 0));
    } else {
      setEditingItem(null);
      setClassName('');
      setTuitionFee('');
      setTransportFee('5000');
      setAdmissionFee('2000');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!className.trim()) {
      Alert.alert('Missing Field', 'Please enter class name (e.g. 4-A).');
      return;
    }

    try {
      const payload = {
        id: editingItem?.id && !editingItem.id.startsWith('fs-') ? editingItem.id : undefined,
        class: className.trim(),
        tuitionFee,
        transportFee,
        admissionFee,
      };

      if (!editingItem || !editingItem.id.startsWith('fs-')) {
        await saveFeeStructure(payload);
      } else {
        const total = (parseFloat(tuitionFee) || 0) + (parseFloat(transportFee) || 0) + (parseFloat(admissionFee) || 0);
        setStructures((prev) =>
          prev.map((s) => (s.id === editingItem.id ? { ...s, class: className, tuitionFee, transportFee, admissionFee, totalFee: total } : s))
        );
      }
      setModalVisible(false);
    } catch (err) {
      Alert.alert('Save Failed', err.message);
    }
  };

  const handleDelete = async (item) => {
    try {
      if (!item.id.startsWith('fs-')) {
        await deleteFeeStructure(item.id, item.class);
      } else {
        setStructures((prev) => prev.filter((s) => s.id !== item.id));
      }
    } catch (err) {
      Alert.alert('Delete Failed', err.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Fees Structure Management</Text>
          <Text style={styles.subtitle}>Define class-wise Tuition, Transport, and Admission fee rates</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => openForm(null)}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Class Fee</Text>
        </TouchableOpacity>
      </View>

      {/* Grid of Class Fee Cards */}
      <View style={styles.cardsGrid}>
        {structures.map((item) => {
          const total = item.totalFee || (item.tuitionFee + item.transportFee + item.admissionFee);
          return (
            <View key={item.id} style={styles.classCard}>
              <View style={styles.cardHeader}>
                <View style={styles.classBadge}>
                  <Text style={styles.classBadgeText}>CLASS {item.class}</Text>
                </View>
                <View style={styles.headerActions}>
                  <TouchableOpacity onPress={() => openForm(item)} style={{ padding: 4 }}>
                    <Ionicons name="create-outline" size={17} color="#4361EE" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item)} style={{ padding: 4 }}>
                    <Ionicons name="trash-outline" size={17} color="#E53935" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.feesList}>
                <View style={styles.feeLine}>
                  <Text style={styles.feeLabel}>Tuition Fee</Text>
                  <Text style={styles.feeVal}>{formatINR(item.tuitionFee)}</Text>
                </View>
                <View style={styles.feeLine}>
                  <Text style={styles.feeLabel}>Transport Fee</Text>
                  <Text style={styles.feeVal}>{formatINR(item.transportFee)}</Text>
                </View>
                <View style={styles.feeLine}>
                  <Text style={styles.feeLabel}>Admission Fee</Text>
                  <Text style={styles.feeVal}>{formatINR(item.admissionFee)}</Text>
                </View>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Fee</Text>
                <Text style={styles.totalValue}>{formatINR(total)}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Add / Edit Fee Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>{editingItem ? 'Edit Fee Structure' : 'Add Class Fee Structure'}</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Class / Grade *</Text>
              <TextInput style={styles.input} value={className} onChangeText={setClassName} placeholder="e.g. 5-A" />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Tuition Fee (₹)</Text>
              <TextInput style={styles.input} value={tuitionFee} onChangeText={setTuitionFee} keyboardType="numeric" placeholder="20000" />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Transport Fee (₹)</Text>
              <TextInput style={styles.input} value={transportFee} onChangeText={setTransportFee} keyboardType="numeric" placeholder="5000" />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Admission Fee (₹)</Text>
              <TextInput style={styles.input} value={admissionFee} onChangeText={setAdmissionFee} keyboardType="numeric" placeholder="2000" />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { padding: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#1B1C1A' },
  subtitle: { fontSize: 12.5, color: '#8A7B8E', marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#4361EE', paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.md },
  addBtnText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  classCard: { flex: 1, minWidth: 260, backgroundColor: '#FFFFFF', borderRadius: Radius.lg, padding: 18, borderWidth: 1, borderColor: 'rgba(61, 23, 71, 0.08)', ...Shadows.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  classBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  classBadgeText: { fontSize: 12, fontWeight: '800', color: '#4361EE' },
  headerActions: { flexDirection: 'row', gap: 8 },
  feesList: { gap: 8, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F5F0F7' },
  feeLine: { flexDirection: 'row', justifyContent: 'space-between' },
  feeLabel: { fontSize: 12.5, color: '#6B5A72' },
  feeVal: { fontSize: 13, fontWeight: '700', color: '#1B1C1A' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, alignItems: 'center' },
  totalLabel: { fontSize: 13, fontWeight: '800', color: '#1B1C1A' },
  totalValue: { fontSize: 16, fontWeight: '800', color: '#21A572' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(26, 0, 34, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: Radius.xl, padding: 22, maxWidth: 420, width: '100%', ...Shadows.lg },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#1B1C1A', marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#4B3F50', marginBottom: 4 },
  input: { backgroundColor: '#FAF8F5', borderWidth: 1, borderColor: '#E4DDE6', borderRadius: 10, paddingHorizontal: 12, height: 42, fontSize: 13.5, color: '#1B1C1A' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cancelBtn: { flex: 1, paddingVertical: 10, backgroundColor: '#F5F0F7', borderRadius: 10, alignItems: 'center' },
  cancelText: { fontSize: 13, fontWeight: '700', color: '#6B5A72' },
  saveBtn: { flex: 2, paddingVertical: 10, backgroundColor: '#4361EE', borderRadius: 10, alignItems: 'center' },
  saveText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
});

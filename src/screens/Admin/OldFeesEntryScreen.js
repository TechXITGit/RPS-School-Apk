// Historical / Old Fees Entry Screen for recording back-dated payments
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';
import { getAllStudents } from '../../services/firebase/studentService';
import { recordFeePayment } from '../../services/firebase/feeService';

const PAYMENT_METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque'];
const FEE_TYPES = ['Tuition', 'Transport', 'Development', 'SchoolKit', 'OldFee', 'Examination'];

export default function OldFeesEntryScreen({ onPaymentSaved }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchStudent, setSearchStudent] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [feeType, setFeeType] = useState('OldFee');
  const [receiptNumber, setReceiptNumber] = useState(`OLD-${Date.now().toString().slice(-5)}`);
  const [paymentDateStr, setPaymentDateStr] = useState('2026-08-15');
  const [description, setDescription] = useState('Settlement of previous term fee balance');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAllStudents().then((res) => {
      if (res && res.length > 0) {
        setStudents(res);
        setSelectedStudent(res[0]);
      }
    });
  }, []);

  const matchingStudents = students.filter((s) => {
    if (!searchStudent.trim()) return true;
    const q = searchStudent.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.uid.toLowerCase().includes(q);
  });

  const handleSubmit = async () => {
    if (!selectedStudent) {
      Alert.alert('No Student Selected', 'Please pick a student to attach this historical fee.');
      return;
    }
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedDate = new Date(paymentDateStr);
      await recordFeePayment({
        studentId: selectedStudent.id,
        studentUid: selectedStudent.uid,
        studentName: selectedStudent.name,
        studentClass: selectedStudent.class,
        amount: num,
        type: feeType,
        paymentMethod,
        receiptNumber,
        description,
        paymentDate: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
      });

      Alert.alert(
        'Recorded Successfully!',
        `Logged payment of ₹${num} for ${selectedStudent.name}. Balance ledger has been updated.`
      );
      setAmount('');
      setReceiptNumber(`OLD-${Date.now().toString().slice(-5)}`);
      if (onPaymentSaved) onPaymentSaved();
    } catch (err) {
      Alert.alert('Submission Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Historical / Old Fees Entry</Text>
        <Text style={styles.subtitle}>
          Manually log past offline collections, bank deposits, or arrears
        </Text>
      </View>

      <View style={styles.card}>
        {/* Student Selector */}
        <Text style={styles.label}>Select Student *</Text>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color="#8A7B8E" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search student by name or UID..."
            value={searchStudent}
            onChangeText={setSearchStudent}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.studentChips}>
          {matchingStudents.slice(0, 10).map((st) => {
            const isSel = selectedStudent?.id === st.id;
            return (
              <TouchableOpacity
                key={st.id}
                style={[styles.stChip, isSel && styles.stChipActive]}
                onPress={() => setSelectedStudent(st)}
              >
                <Text style={[styles.stChipText, isSel && styles.stChipTextActive]}>
                  {st.name} ({st.class})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {selectedStudent && (
          <View style={styles.selectedBox}>
            <Ionicons name="checkmark-circle" size={18} color="#21A572" />
            <Text style={styles.selectedText}>
              Selected: <Text style={{ fontWeight: '800' }}>{selectedStudent.name}</Text> • UID: {selectedStudent.uid}
            </Text>
          </View>
        )}

        {/* Row 1: Amount & Fee Type */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Payment Amount (₹) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 5000"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Fee Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
              {FEE_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.smallChip, feeType === t && styles.smallChipActive]}
                  onPress={() => setFeeType(t)}
                >
                  <Text style={[styles.smallChipText, feeType === t && { color: '#FFFFFF' }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Row 2: Payment Method */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.methodRow}>
            {PAYMENT_METHODS.map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.methodBtn, paymentMethod === m && styles.methodBtnActive]}
                onPress={() => setPaymentMethod(m)}
              >
                <Text style={[styles.methodBtnText, paymentMethod === m && { color: '#FFFFFF' }]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Row 3: Receipt Number & Back-dated Date */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Receipt / Voucher #</Text>
            <TextInput style={styles.input} value={receiptNumber} onChangeText={setReceiptNumber} />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Payment Date (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} value={paymentDateStr} onChangeText={setPaymentDateStr} />
          </View>
        </View>

        {/* Notes */}
        <View style={{ marginBottom: 18 }}>
          <Text style={styles.label}>Remarks / Description</Text>
          <TextInput
            style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.submitBtnText}>Record Payment into Ledger</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { padding: 20 },
  topBar: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#1B1C1A' },
  subtitle: { fontSize: 12.5, color: '#8A7B8E', marginTop: 2 },
  card: { backgroundColor: '#FFFFFF', borderRadius: Radius.lg, padding: 22, borderWidth: 1, borderColor: 'rgba(61, 23, 71, 0.08)', ...Shadows.sm },
  label: { fontSize: 12, fontWeight: '700', color: '#4B3F50', marginBottom: 6 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAF8F5', borderWidth: 1, borderColor: '#E4DDE6', borderRadius: 10, paddingHorizontal: 12, height: 42, marginBottom: 8, gap: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#1B1C1A' },
  studentChips: { flexDirection: 'row', marginBottom: 12 },
  stChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#FAF8F5', borderWidth: 1, borderColor: '#E4DDE6', marginRight: 6 },
  stChipActive: { backgroundColor: '#4361EE', borderColor: '#4361EE' },
  stChipText: { fontSize: 12, fontWeight: '700', color: '#4B3F50' },
  stChipTextActive: { color: '#FFFFFF' },
  selectedBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F4EA', padding: 10, borderRadius: 8, gap: 8, marginBottom: 14 },
  selectedText: { fontSize: 12.5, color: '#166534' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  col: { flex: 1 },
  input: { backgroundColor: '#FAF8F5', borderWidth: 1, borderColor: '#E4DDE6', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 13.5, color: '#1B1C1A' },
  smallChip: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, backgroundColor: '#FAF8F5', borderWidth: 1, borderColor: '#E4DDE6', marginRight: 6 },
  smallChipActive: { backgroundColor: '#4361EE', borderColor: '#4361EE' },
  smallChipText: { fontSize: 11.5, fontWeight: '700', color: '#6B5A72' },
  methodRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  methodBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: '#FAF8F5', borderWidth: 1, borderColor: '#E4DDE6' },
  methodBtnActive: { backgroundColor: '#21A572', borderColor: '#21A572' },
  methodBtnText: { fontSize: 12, fontWeight: '700', color: '#4B3F50' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4361EE', paddingVertical: 13, borderRadius: Radius.md, ...Shadows.sm },
  submitBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});

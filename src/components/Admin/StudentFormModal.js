// Reusable Student Add / Edit Modal Form with automatic pending fee calculation
import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';
import { addStudent, updateStudent } from '../../services/firebase/studentService';
import { formatINR } from '../../utils/currencyUtils';

const CLASS_OPTIONS = ['Nursery-A', 'LKG-A', 'UKG-A', '1-A', '2-A', '3-A', '4-A', '5-A', '6-A'];

export default function StudentFormModal({
  visible,
  initialData = null,
  onClose,
  onSuccess,
}) {
  const isEditing = !!initialData?.id;

  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [studentClass, setStudentClass] = useState('1-A');
  const [section, setSection] = useState('A');
  const [totalFee, setTotalFee] = useState('25000');
  const [paidFee, setPaidFee] = useState('0');
  const [transportRequired, setTransportRequired] = useState(false);
  const [transportRoute, setTransportRoute] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('active');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setUid(initialData.uid || '');
      setName(initialData.name || '');
      setParentName(initialData.parentName || '');
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
      setStudentClass(initialData.class || '1-A');
      setSection(initialData.section || 'A');
      setTotalFee(String(initialData.totalFee || 25000));
      setPaidFee(String(initialData.paidFee || 0));
      setTransportRequired(!!initialData.transportRequired);
      setTransportRoute(initialData.transportRoute || '');
      setAddress(initialData.address || '');
      setStatus(initialData.status || 'active');
    } else {
      setUid(`RPS-${Date.now().toString().slice(-5)}`);
      setName('');
      setParentName('');
      setPhone('');
      setEmail('');
      setStudentClass('1-A');
      setSection('A');
      setTotalFee('25000');
      setPaidFee('0');
      setTransportRequired(false);
      setTransportRoute('');
      setAddress('');
      setStatus('active');
    }
    setErrorMessage(null);
  }, [initialData, visible]);

  // Automatic calculation: pendingFee = totalFee - paidFee
  const numTotal = parseFloat(totalFee) || 0;
  const numPaid = parseFloat(paidFee) || 0;
  const calculatedPending = Math.max(0, numTotal - numPaid);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter student name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter contact phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const studentPayload = {
        uid: uid.trim(),
        name: name.trim(),
        parentName: parentName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        class: studentClass,
        section: section.trim().toUpperCase(),
        totalFee: numTotal,
        paidFee: numPaid,
        pendingFee: calculatedPending,
        transportRequired,
        transportRoute: transportRequired ? transportRoute.trim() : '',
        address: address.trim(),
        status,
      };

      if (isEditing) {
        await updateStudent(initialData.id, studentPayload);
      } else {
        await addStudent(studentPayload);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Edit Student Details' : 'Register New Student'}
              </Text>
              <Text style={styles.modalSub}>
                {isEditing ? `Editing UID: ${initialData.uid}` : 'Enter student and academic details'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#6B5A72" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {errorMessage && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Row 1: UID & Name */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Student UID</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#F0EDF2' }]}
                  value={uid}
                  onChangeText={setUid}
                  placeholder="STU001"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Student Name *</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Rahul Sharma"
                />
              </View>
            </View>

            {/* Row 2: Parent Name & Phone */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Parent / Guardian Name</Text>
                <TextInput
                  style={styles.input}
                  value={parentName}
                  onChangeText={setParentName}
                  placeholder="e.g. Rajesh Sharma"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Contact Phone *</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+91 98765 43210"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Row 3: Class & Section */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Class / Grade</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classChips}>
                  {CLASS_OPTIONS.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.chip, studentClass === c && styles.chipActive]}
                      onPress={() => setStudentClass(c)}
                    >
                      <Text style={[styles.chipText, studentClass === c && styles.chipTextActive]}>
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Row 4: Total Fee & Paid Fee */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Total Fee (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={totalFee}
                  onChangeText={setTotalFee}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Paid Fee (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={paidFee}
                  onChangeText={setPaidFee}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Auto Pending Fee Callout Banner */}
            <View style={styles.autoCalcBox}>
              <View style={styles.autoCalcRow}>
                <Ionicons name="calculator-outline" size={18} color="#21A572" />
                <Text style={styles.autoCalcTitle}>Auto-Calculated Pending Fee:</Text>
              </View>
              <Text style={styles.autoCalcValue}>{formatINR(calculatedPending)}</Text>
            </View>

            {/* Row 5: Transport Toggle */}
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>Transport Service Required</Text>
                <Text style={styles.switchSub}>School bus pickup / drop facility</Text>
              </View>
              <Switch
                value={transportRequired}
                onValueChange={setTransportRequired}
                trackColor={{ false: '#D0C3CD', true: '#B9EBCA' }}
                thumbColor={transportRequired ? '#21A572' : '#FFFFFF'}
              />
            </View>

            {transportRequired && (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.label}>Transport Route</Text>
                <TextInput
                  style={styles.input}
                  value={transportRoute}
                  onChangeText={setTransportRoute}
                  placeholder="e.g. Route 4: Kashipuram - Deoria Bypass"
                />
              </View>
            )}

            {/* Address */}
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.label}>Residential Address</Text>
              <TextInput
                style={[styles.input, { height: 64, textAlignVertical: 'top' }]}
                value={address}
                onChangeText={setAddress}
                placeholder="Full address details"
                multiline
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isSubmitting}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, isSubmitting && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveText}>{isEditing ? 'Save Changes' : 'Register Student'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 0, 34, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 22,
    maxWidth: 540,
    width: '100%',
    maxHeight: '92%',
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBF2',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1B1C1A',
  },
  modalSub: {
    fontSize: 12,
    color: '#8A7B8E',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  formScroll: {
    paddingTop: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorContainer,
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  errorText: {
    color: Colors.onErrorContainer,
    fontSize: 12.5,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B3F50',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E4DDE6',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13.5,
    color: '#1B1C1A',
  },
  classChips: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E4DDE6',
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: '#4361EE',
    borderColor: '#4361EE',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B3F50',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  autoCalcBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6F4EA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(33, 165, 114, 0.25)',
  },
  autoCalcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  autoCalcTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#166534',
  },
  autoCalcValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#166534',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B1C1A',
  },
  switchSub: {
    fontSize: 11.5,
    color: '#7E747D',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    paddingBottom: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F5F0F7',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#6B5A72',
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 12,
    backgroundColor: '#4361EE',
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

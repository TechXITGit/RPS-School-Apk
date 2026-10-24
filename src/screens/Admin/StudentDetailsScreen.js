// Detailed Student Profile, Ledger, and Actions Screen
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';
import { formatINR } from '../../utils/currencyUtils';
import { sendFeeReminderWhatsApp } from '../../utils/whatsapp';
import StudentFormModal from '../../components/Admin/StudentFormModal';

export default function StudentDetailsScreen({ student, onBack, onRecordPayment }) {
  const [currentStudent, setCurrentStudent] = useState(student);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!currentStudent) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={18} color="#4361EE" />
          <Text style={styles.backText}>Back to Students List</Text>
        </TouchableOpacity>
        <Text style={styles.emptyText}>No student selected</Text>
      </View>
    );
  }

  const total = currentStudent.totalFee || 0;
  const paid = currentStudent.paidFee || 0;
  const pending = currentStudent.pendingFee !== undefined ? currentStudent.pendingFee : Math.max(0, total - paid);

  const handleWhatsAppReminder = async () => {
    if (pending <= 0) {
      Alert.alert('No Dues', `${currentStudent.name} has no outstanding pending fee.`);
      return;
    }
    await sendFeeReminderWhatsApp({
      parentName: currentStudent.parentName,
      studentName: currentStudent.name,
      pendingAmount: pending,
      phone: currentStudent.phone,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons name="arrow-back" size={18} color="#4361EE" />
        <Text style={styles.backText}>Back to Students List</Text>
      </TouchableOpacity>

      {/* Hero Profile Card */}
      <View style={styles.heroCard}>
        <View style={styles.avatarBig}>
          <Text style={styles.avatarBigText}>
            {(currentStudent.name[0] || 'S').toUpperCase()}
          </Text>
        </View>

        <View style={styles.heroMeta}>
          <View style={styles.nameRow}>
            <Text style={styles.studentName}>{currentStudent.name}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>CLASS {currentStudent.class}</Text>
            </View>
          </View>
          <Text style={styles.uidText}>UID: {currentStudent.uid}</Text>
          <Text style={styles.parentText}>Parent: {currentStudent.parentName || 'N/A'}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.heroActions}>
          <TouchableOpacity
            style={styles.actionBtnPrimary}
            onPress={() => onRecordPayment && onRecordPayment(currentStudent)}
          >
            <Ionicons name="card-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Add Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnWhatsApp}
            onPress={handleWhatsAppReminder}
          >
            <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Fee Reminder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnSecondary}
            onPress={() => setIsEditModalOpen(true)}
          >
            <Ionicons name="create-outline" size={16} color="#4361EE" />
            <Text style={[styles.actionBtnText, { color: '#4361EE' }]}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fee Balance Cards Grid */}
      <View style={styles.balanceGrid}>
        <View style={[styles.balanceCard, { borderLeftColor: '#4361EE' }]}>
          <Text style={styles.balanceLabel}>Total Assigned Fee</Text>
          <Text style={styles.balanceValue}>{formatINR(total)}</Text>
        </View>

        <View style={[styles.balanceCard, { borderLeftColor: '#21A572' }]}>
          <Text style={styles.balanceLabel}>Total Fee Paid</Text>
          <Text style={[styles.balanceValue, { color: '#21A572' }]}>{formatINR(paid)}</Text>
        </View>

        <View style={[styles.balanceCard, { borderLeftColor: '#EAA315' }]}>
          <Text style={styles.balanceLabel}>Outstanding Balance</Text>
          <Text style={[styles.balanceValue, { color: '#EAA315' }]}>{formatINR(pending)}</Text>
        </View>
      </View>

      {/* Detailed Information Sections */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionHeading}>Contact & Transport Information</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Primary Phone</Text>
            <Text style={styles.infoVal}>{currentStudent.phone || '-'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Registered Email</Text>
            <Text style={styles.infoVal}>{currentStudent.email || '-'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Transport Facility</Text>
            <Text style={styles.infoVal}>
              {currentStudent.transportRequired ? 'Enrolled (Bus Pickup)' : 'Self / Not Enrolled'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Bus Route</Text>
            <Text style={styles.infoVal}>{currentStudent.transportRoute || 'N/A'}</Text>
          </View>
          <View style={[styles.infoItem, { width: '100%' }]}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoVal}>{currentStudent.address || 'Address on file at office'}</Text>
          </View>
        </View>
      </View>

      {/* Edit Student Modal */}
      <StudentFormModal
        visible={isEditModalOpen}
        initialData={currentStudent}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updated) => {
          if (updated) setCurrentStudent(updated);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  content: {
    padding: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#4361EE',
  },
  emptyText: {
    fontSize: 14,
    color: '#8A7B8E',
    marginTop: 20,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.sm,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 18,
  },
  avatarBig: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAF8F5',
    borderWidth: 2,
    borderColor: '#4361EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBigText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#4361EE',
  },
  heroMeta: {
    flex: 1,
    minWidth: 200,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B1C1A',
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4361EE',
  },
  uidText: {
    fontSize: 12.5,
    color: '#4361EE',
    fontWeight: '700',
    marginTop: 2,
  },
  parentText: {
    fontSize: 12.5,
    color: '#6B5A72',
    marginTop: 2,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4361EE',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
  },
  actionBtnWhatsApp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#25D366',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
  },
  actionBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  balanceGrid: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  balanceCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.sm,
  },
  balanceLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8A7B8E',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1B1C1A',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.sm,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1B1C1A',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBF2',
    paddingBottom: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    width: '46%',
  },
  infoLabel: {
    fontSize: 11.5,
    color: '#8A7B8E',
    fontWeight: '600',
    marginBottom: 2,
  },
  infoVal: {
    fontSize: 13.5,
    color: '#1B1C1A',
    fontWeight: '700',
  },
});

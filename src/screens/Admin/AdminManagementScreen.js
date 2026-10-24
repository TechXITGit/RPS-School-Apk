import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import {
  subscribeAllAdmins,
  createAdminAccount,
  revokeAdminAccount,
  restoreAdminAccount,
} from '../../services/firebase/adminService';
import ConfirmModal from '../../components/Admin/ConfirmModal';
import { formatDate } from '../../utils/dateUtils';

const AdminManagementScreen = () => {
  const { currentUser, adminProfile, isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add Admin Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Confirm Revoke/Restore Modal
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // 'revoke' | 'restore'
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    const unsub = subscribeAllAdmins((data) => {
      setAdmins(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredAdmins = admins.filter((a) => {
    const q = search.toLowerCase();
    return (
      (a.displayName || '').toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q) ||
      (a.role || '').toLowerCase().includes(q)
    );
  });

  const handleOpenAddModal = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('admin');
    setFormError('');
    setModalVisible(true);
  };

  const handleCreateAdmin = async () => {
    if (!name.trim()) {
      setFormError('Please enter admin name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email');
      return;
    }
    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');
      await createAdminAccount({
        email: email.trim(),
        password: password.trim(),
        name: name.trim(),
        role,
        currentAdmin: {
          uid: currentUser?.uid,
          name: adminProfile?.displayName || currentUser?.email || 'Super Admin',
        },
      });
      setSubmitting(false);
      setModalVisible(false);
      Alert.alert('Success', `Admin account created for ${email.trim()}`);
    } catch (err) {
      setSubmitting(false);
      setFormError(err.message || 'Failed to create admin');
    }
  };

  const handleTriggerRevoke = (admin) => {
    if (admin.id === currentUser?.uid) {
      Alert.alert('Action Denied', 'You cannot revoke your own account.');
      return;
    }
    setConfirmTarget(admin);
    setConfirmAction('revoke');
  };

  const handleTriggerRestore = (admin) => {
    setConfirmTarget(admin);
    setConfirmAction('restore');
  };

  const executeConfirmAction = async () => {
    if (!confirmTarget) return;
    try {
      setConfirmLoading(true);
      const superAdminInfo = {
        uid: currentUser?.uid,
        name: adminProfile?.displayName || currentUser?.email || 'Super Admin',
      };
      if (confirmAction === 'revoke') {
        await revokeAdminAccount(confirmTarget.id, superAdminInfo);
      } else {
        await restoreAdminAccount(confirmTarget.id, superAdminInfo);
      }
      setConfirmLoading(false);
      setConfirmTarget(null);
      setConfirmAction(null);
    } catch (err) {
      setConfirmLoading(false);
      Alert.alert('Error', err.message || 'Action failed');
    }
  };

  if (!isSuperAdmin) {
    return (
      <View style={styles.restrictedContainer}>
        <Ionicons name="shield-outline" size={56} color="#C62828" />
        <Text style={styles.restrictedTitle}>Access Restricted</Text>
        <Text style={styles.restrictedSub}>
          Only Super Admins have permission to manage administrator credentials and access levels.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Banner */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.screenTitle}>Admin Management</Text>
          <Text style={styles.screenSub}>
            Super Admin Control Panel • {admins.length} Total Registered Admins
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleOpenAddModal}>
          <Ionicons name="person-add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>New Admin</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email or role..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Admin Cards / List */}
      {loading ? (
        <ActivityIndicator size="large" color="#5E17EB" style={{ marginTop: 40 }} />
      ) : filteredAdmins.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color="#999" />
          <Text style={styles.emptyText}>No admin accounts match your search.</Text>
        </View>
      ) : (
        <View style={styles.cardList}>
          {filteredAdmins.map((admin) => {
            const isSelf = admin.id === currentUser?.uid;
            const isRevoked = admin.status === 'revoked';
            const isSuper = admin.role === 'superadmin';

            return (
              <View key={admin.id} style={[styles.adminCard, isRevoked && styles.revokedCard]}>
                <View style={styles.adminCardHeader}>
                  <View style={styles.adminInfoLeft}>
                    <View
                      style={[
                        styles.avatarCircle,
                        isSuper ? styles.superAvatar : styles.adminAvatar,
                      ]}
                    >
                      <Ionicons
                        name={isSuper ? 'shield-checkmark' : 'person'}
                        size={20}
                        color="#FFFFFF"
                      />
                    </View>
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.adminName}>
                          {admin.displayName || 'Unnamed Admin'}
                        </Text>
                        {isSelf && (
                          <View style={styles.selfBadge}>
                            <Text style={styles.selfBadgeText}>YOU</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.adminEmail}>{admin.email}</Text>
                    </View>
                  </View>

                  {/* Status Badges */}
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.roleBadge,
                        isSuper ? styles.superBadge : styles.regularBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleBadgeText,
                          isSuper ? styles.superBadgeText : styles.regularBadgeText,
                        ]}
                      >
                        {isSuper ? 'Super Admin' : 'Admin'}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        isRevoked ? styles.revokedBadge : styles.activeBadge,
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: isRevoked ? '#C62828' : '#2E7D32' },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: isRevoked ? '#C62828' : '#2E7D32' },
                        ]}
                      >
                        {isRevoked ? 'Revoked' : 'Active'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                {/* Footer details & action buttons */}
                <View style={styles.cardFooter}>
                  <Text style={styles.createdDate}>
                    Added on {formatDate(admin.createdAt || admin.created_at)}
                  </Text>

                  {!isSelf && (
                    <View style={styles.actionButtons}>
                      {isRevoked ? (
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.restoreBtn]}
                          onPress={() => handleTriggerRestore(admin)}
                        >
                          <Ionicons name="refresh" size={14} color="#2E7D32" />
                          <Text style={styles.restoreBtnText}>Restore Access</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.revokeBtn]}
                          onPress={() => handleTriggerRevoke(admin)}
                        >
                          <Ionicons name="lock-closed" size={14} color="#C62828" />
                          <Text style={styles.revokeBtnText}>Revoke Access</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Add Admin Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Create New Admin</Text>
                <Text style={styles.modalSub}>Assign administrative access to staff</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {formError ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#C62828" />
                <Text style={styles.errorBoxText}>{formError}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Ramesh Chandra"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="admin@rudrapurpublicschool.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Temporary Password * (Min 6 chars)</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Role Assignment</Text>
              <View style={styles.rolePickerRow}>
                <TouchableOpacity
                  style={[styles.roleSelectBtn, role === 'admin' && styles.roleSelectActive]}
                  onPress={() => setRole('admin')}
                >
                  <Ionicons
                    name="person"
                    size={16}
                    color={role === 'admin' ? '#FFFFFF' : '#666'}
                  />
                  <Text
                    style={[
                      styles.roleSelectText,
                      role === 'admin' && styles.roleSelectTextActive,
                    ]}
                  >
                    Admin
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleSelectBtn, role === 'superadmin' && styles.roleSelectActive]}
                  onPress={() => setRole('superadmin')}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={16}
                    color={role === 'superadmin' ? '#FFFFFF' : '#666'}
                  />
                  <Text
                    style={[
                      styles.roleSelectText,
                      role === 'superadmin' && styles.roleSelectTextActive,
                    ]}
                  >
                    Super Admin
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                disabled={submitting}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleCreateAdmin}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirm Revoke / Restore Modal */}
      <ConfirmModal
        visible={!!confirmTarget}
        title={confirmAction === 'revoke' ? 'Revoke Admin Access' : 'Restore Admin Access'}
        message={
          confirmAction === 'revoke'
            ? `Are you sure you want to revoke access for ${confirmTarget?.displayName || confirmTarget?.email}? They will be immediately locked out of all admin features.`
            : `Restore access for ${confirmTarget?.displayName || confirmTarget?.email}? They will regain full administrative privileges.`
        }
        confirmText={confirmAction === 'revoke' ? 'Revoke Access' : 'Restore'}
        confirmColor={confirmAction === 'revoke' ? '#C62828' : '#2E7D32'}
        loading={confirmLoading}
        onCancel={() => {
          setConfirmTarget(null);
          setConfirmAction(null);
        }}
        onConfirm={executeConfirmAction}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 20, paddingBottom: 60 },
  restrictedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#F8F9FA',
  },
  restrictedTitle: { fontSize: 20, fontWeight: '700', color: '#C62828', marginTop: 16 },
  restrictedSub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  screenTitle: { fontSize: 24, fontWeight: '800', color: '#180126' },
  screenSub: { fontSize: 13, color: '#666', marginTop: 3 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5E17EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
    height: 44,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#999', marginTop: 12, fontSize: 14 },
  cardList: { gap: 14 },
  adminCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  revokedCard: {
    backgroundColor: '#FFF9F9',
    borderColor: '#FFCDD2',
  },
  adminCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 10,
  },
  adminInfoLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 220 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  superAvatar: { backgroundColor: '#180126' },
  adminAvatar: { backgroundColor: '#5E17EB' },
  adminName: { fontSize: 16, fontWeight: '700', color: '#180126' },
  adminEmail: { fontSize: 13, color: '#666', marginTop: 2 },
  selfBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  selfBadgeText: { fontSize: 10, fontWeight: '800', color: '#2E7D32' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  superBadge: { backgroundColor: '#EDE7F6' },
  regularBadge: { backgroundColor: '#E3F2FD' },
  roleBadgeText: { fontSize: 11, fontWeight: '700' },
  superBadgeText: { color: '#5E17EB' },
  regularBadgeText: { color: '#1976D2' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  activeBadge: { backgroundColor: '#E8F5E9' },
  revokedBadge: { backgroundColor: '#FFEBEE' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  cardDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  createdDate: { fontSize: 12, color: '#999' },
  actionButtons: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 4,
  },
  revokeBtn: { backgroundColor: '#FFEBEE' },
  revokeBtnText: { fontSize: 12, fontWeight: '700', color: '#C62828' },
  restoreBtn: { backgroundColor: '#E8F5E9' },
  restoreBtnText: { fontSize: 12, fontWeight: '700', color: '#2E7D32' },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    width: '100%',
    maxWidth: 480,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#180126' },
  modalSub: { fontSize: 13, color: '#666', marginTop: 2 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  errorBoxText: { color: '#C62828', fontSize: 12, flex: 1 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: '#444', marginBottom: 6 },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 14,
    color: '#333',
  },
  rolePickerRow: { flexDirection: 'row', gap: 10 },
  roleSelectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F9FA',
    gap: 6,
  },
  roleSelectActive: { backgroundColor: '#5E17EB', borderColor: '#5E17EB' },
  roleSelectText: { fontSize: 13, fontWeight: '600', color: '#666' },
  roleSelectTextActive: { color: '#FFFFFF', fontWeight: '700' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  cancelBtnText: { color: '#666', fontWeight: '600', fontSize: 14 },
  saveBtn: {
    backgroundColor: '#5E17EB',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});

export default AdminManagementScreen;

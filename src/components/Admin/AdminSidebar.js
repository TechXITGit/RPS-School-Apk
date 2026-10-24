// Admin Navigation Sidebar / Drawer matching RPS Admin Portal reference
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows, Radius } from '../../theme/colors';
import TourTarget from '../Tour/TourTarget';
export default function AdminSidebar({
  activeScreen,
  onSelectScreen,
  onLogoutPress,
  onCloseMobileDrawer,
}) {
  const { isSuperAdmin } = useAuth();

  const handleItemPress = (key) => {
    onSelectScreen(key);
    if (onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
      ],
    },
    {
      title: 'STUDENTS & TRANSPORT',
      items: [
        { key: 'students', label: 'Students', icon: 'people-outline' },
        { key: 'import_students', label: 'Import Students', icon: 'cloud-upload-outline' },
        { key: 'enquiries', label: 'Enquiries', icon: 'mail-outline' },
      ],
    },
    {
      title: 'FEES & REPORTS',
      items: [
        { key: 'fees_structure', label: 'Fees Structure', icon: 'cash-outline' },
        { key: 'fees_defaults', label: 'Fee Defaulters', icon: 'warning-outline' },
        { key: 'collection_report', label: 'Collection Report', icon: 'bar-chart-outline' },
        { key: 'old_fees', label: 'Old Fee Entry', icon: 'pricetag-outline' },
        { key: 'fee_reminders', label: 'Fee Reminders', icon: 'chatbubble-ellipses-outline' },
      ],
    },
    {
      title: 'ATTENDANCE & TEACHERS',
      items: [
        { key: 'student_attendance', label: 'Student Attendance', icon: 'checkbox-outline' },
        { key: 'attendance_records', label: 'Attendance Record', icon: 'document-text-outline' },
        { key: 'teachers', label: 'Teachers', icon: 'person-add-outline' },
        { key: 'teacher_attendance', label: 'Teacher Attendance', icon: 'time-outline' },
        { key: 'salary_reports', label: 'Salary Report', icon: 'receipt-outline' },
      ],
    },
  ];

  if (isSuperAdmin) {
    navSections.push({
      title: 'SUPER ADMIN',
      items: [
        { key: 'admin_management', label: 'Admin Management', icon: 'shield-checkmark-outline' },
        { key: 'admin_activity', label: 'Admin Activity', icon: 'pulse-outline' },
      ],
    });
  }

  return (
    <View style={styles.container}>
      {/* Mobile Drawer Header with Back / Close Button */}
      {onCloseMobileDrawer && (
        <View style={styles.drawerHeader}>
          <TouchableOpacity
            style={styles.drawerBackBtn}
            onPress={onCloseMobileDrawer}
            activeOpacity={0.7}
            accessibilityLabel="Close Menu"
          >
            <Ionicons name="arrow-back" size={20} color="#5E17EB" />
            <Text style={styles.drawerBackText}>Back</Text>
          </TouchableOpacity>

          
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {navSections.map((sec, secIdx) => (
          <View key={secIdx} style={styles.sectionWrap}>
            <Text style={styles.sectionHeader}>{sec.title}</Text>
            <View style={styles.itemsList}>
              {sec.items.map((item) => {
                const isActive = activeScreen === item.key;
                const buttonContent = (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.navItem, isActive && styles.navItemActive]}
                    onPress={() => handleItemPress(item.key)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={isActive ? '#3B5998' : '#554C58'}
                      style={styles.navIcon}
                    />
                    <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );

                if (item.key === 'admin_management') {
                  return (
                    <TourTarget key={item.key} id="admin-nav-superadmin-mgmt">
                      {buttonContent}
                    </TourTarget>
                  );
                }

                if (item.key === 'admin_activity') {
                  return (
                    <TourTarget key={item.key} id="admin-nav-superadmin-activity">
                      {buttonContent}
                    </TourTarget>
                  );
                }

                return buttonContent;
              })}
            </View>
          </View>
        ))}


        {/* Logout Button */}
        <View style={styles.logoutWrap}>
          <TourTarget id="admin-logout-btn">
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={onLogoutPress}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color="#E53935" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </TourTarget>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: 'rgba(61, 23, 71, 0.08)',
    height: '100%',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE8F0',
    backgroundColor: '#FBF9FC',
  },
  drawerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    gap: 6,
  },
  drawerBackText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#5E17EB',
  },
  drawerCloseIconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionWrap: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: '#8A7B8E',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  itemsList: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#4361EE',
  },
  navIcon: {
    marginRight: 10,
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B3F50',
  },
  navLabelActive: {
    fontWeight: '800',
    color: '#4361EE',
  },
  logoutWrap: {
    marginTop: 8,
    paddingTop: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 10,
  },
  logoutText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#E53935',
  },
});

// Root Admin Navigation Host with Responsive Sidebar & Drawer
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  useWindowDimensions,
  StatusBar,
  Platform,
  BackHandler,
  PanResponder,
} from 'react-native';
import AdminHeader from '../components/Admin/AdminHeader';
import AdminSidebar from '../components/Admin/AdminSidebar';
import ConfirmModal from '../components/Admin/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screen Imports
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import StudentsScreen from '../screens/Admin/StudentsScreen';
import StudentDetailsScreen from '../screens/Admin/StudentDetailsScreen';
import ImportStudentsScreen from '../screens/Admin/ImportStudentsScreen';
import EnquiriesScreen from '../screens/Admin/EnquiriesScreen';
import FeesStructureScreen from '../screens/Admin/FeesStructureScreen';
import FeesDefaultsScreen from '../screens/Admin/FeesDefaultsScreen';
import CollectionReportScreen from '../screens/Admin/CollectionReportScreen';
import OldFeesEntryScreen from '../screens/Admin/OldFeesEntryScreen';
import FeeReminderScreen from '../screens/Admin/FeeReminderScreen';
import StudentAttendanceScreen from '../screens/Admin/StudentAttendanceScreen';
import AttendanceRecordScreen from '../screens/Admin/AttendanceRecordScreen';
import TeacherRegistrationScreen from '../screens/Admin/TeacherRegistrationScreen';
import TeacherAttendanceScreen from '../screens/Admin/TeacherAttendanceScreen';
import SalaryReportScreen from '../screens/Admin/SalaryReportScreen';
import SalarySlipScreen from '../screens/Admin/SalarySlipScreen';
import AdminManagementScreen from '../screens/Admin/AdminManagementScreen';
import AdminActivityScreen from '../screens/Admin/AdminActivityScreen';

const SCREEN_TITLES = {
  dashboard: 'Dashboard',
  students: 'Student Directory',
  student_details: 'Student Profile',
  import_students: 'Import Students',
  enquiries: 'Admission Enquiries',
  fees_structure: 'Fees Structure',
  fees_defaults: 'Fee Defaulters',
  collection_report: 'Collection Report',
  old_fees: 'Old Fee Entry',
  fee_reminders: 'Fee Reminders',
  student_attendance: 'Student Attendance',
  attendance_records: 'Attendance Records',
  teachers: 'Teacher Registration',
  teacher_attendance: 'Teacher Attendance',
  salary_reports: 'Salary Reports',
  salary_slip: 'Salary Slip',
  admin_management: 'Admin Management',
  admin_activity: 'Admin Activity',
};

export default function AdminNavigator({ onExitToSchoolApp }) {
  const { logout } = useAuth();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 900;

  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Sub-screen parameters
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);


  // Unified Go Back Handler
  const handleGoBack = () => {
    if (mobileDrawerOpen) {
      setMobileDrawerOpen(false);
      return;
    }
    if (activeScreen === 'student_details') {
      setActiveScreen('students');
      return;
    }
    if (activeScreen === 'salary_slip') {
      setActiveScreen('salary_reports');
      return;
    }
    if (activeScreen !== 'dashboard') {
      setActiveScreen('dashboard');
      return;
    }
    if (onExitToSchoolApp) {
      onExitToSchoolApp();
    }
  };

  // Hardware Back Button Handler (Android / System)
  useEffect(() => {
    const onBackPress = () => {
      if (mobileDrawerOpen) {
        setMobileDrawerOpen(false);
        return true;
      }
      if (activeScreen === 'student_details') {
        setActiveScreen('students');
        return true;
      }
      if (activeScreen === 'salary_slip') {
        setActiveScreen('salary_reports');
        return true;
      }
      if (activeScreen !== 'dashboard') {
        setActiveScreen('dashboard');
        return true;
      }
      if (onExitToSchoolApp) {
        onExitToSchoolApp();
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [mobileDrawerOpen, activeScreen, onExitToSchoolApp]);

  // Swipe Gesture Back Handler (Left-to-Right swipe anywhere on mobile)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          activeScreen !== 'dashboard' &&
          gestureState.dx > 25 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.3
        );
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return (
          activeScreen !== 'dashboard' &&
          gestureState.dx > 45 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.8
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        if (
          (gestureState.dx > 60 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) ||
          (gestureState.dx > 25 && gestureState.vx > 0.3)
        ) {
          handleGoBack();
        }
      },
    })
  ).current;

  const handleSelectScreen = (screenKey) => {
    setActiveScreen(screenKey);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const handleLogoutConfirm = async () => {
    setLogoutModalVisible(false);
    await logout();
  };

  // Render the currently active screen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <AdminDashboardScreen onNavigate={handleSelectScreen} />;
      case 'students':
        return (
          <StudentsScreen
            onSelectStudent={(st) => {
              setSelectedStudent(st);
              setActiveScreen('student_details');
            }}
          />
        );
      case 'student_details':
        return (
          <StudentDetailsScreen
            student={selectedStudent}
            onBack={() => setActiveScreen('students')}
          />
        );
      case 'import_students':
        return (
          <ImportStudentsScreen
            onImportSuccess={() => setActiveScreen('students')}
            onBack={() => setActiveScreen('students')}
          />
        );
      case 'enquiries':
        return <EnquiriesScreen />;
      case 'fees_structure':
        return <FeesStructureScreen />;
      case 'fees_defaults':
        return <FeesDefaultsScreen />;
      case 'collection_report':
        return <CollectionReportScreen />;
      case 'old_fees':
        return <OldFeesEntryScreen />;
      case 'fee_reminders':
        return <FeeReminderScreen />;
      case 'student_attendance':
        return <StudentAttendanceScreen />;
      case 'attendance_records':
        return <AttendanceRecordScreen />;
      case 'teachers':
        return <TeacherRegistrationScreen />;
      case 'teacher_attendance':
        return <TeacherAttendanceScreen />;
      case 'salary_reports':
        return (
          <SalaryReportScreen
            onOpenSlip={(teacher) => {
              setSelectedTeacher(teacher);
              setActiveScreen('salary_slip');
            }}
          />
        );
      case 'salary_slip':
        return (
          <SalarySlipScreen
            teacher={selectedTeacher}
            onBack={() => setActiveScreen('salary_reports')}
          />
        );
      case 'admin_management':
        return <AdminManagementScreen />;
      case 'admin_activity':
        return <AdminActivityScreen />;
      default:
        return <AdminDashboardScreen onNavigate={handleSelectScreen} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header - sits flush directly below the phone status bar */}
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <AdminHeader
          onToggleSidebar={() => setMobileDrawerOpen(true)}
          activeScreenTitle={SCREEN_TITLES[activeScreen] || 'Dashboard'}
          onExitToSchoolApp={onExitToSchoolApp}
          canGoBack={activeScreen !== 'dashboard'}
          onBack={handleGoBack}
        />
      </View>

      {/* Body (Sidebar + Content) */}
      <View style={styles.body}>
        {/* Desktop Fixed Sidebar */}
        {!isMobile && (
          <AdminSidebar
            activeScreen={activeScreen}
            onSelectScreen={handleSelectScreen}
            onLogoutPress={() => setLogoutModalVisible(true)}
          />
        )}

        {/* Main Content Area with Swipe-Back Gesture */}
        <View style={styles.contentArea} {...panResponder.panHandlers}>
          {renderScreen()}
        </View>
      </View>

      {/* Mobile Slide Drawer Modal */}
      {isMobile && (
        <Modal
          visible={mobileDrawerOpen}
          animationType="fade"
          transparent
          statusBarTranslucent={true}
          onRequestClose={() => setMobileDrawerOpen(false)}
        >
          <View style={styles.drawerBackdrop}>
            <Pressable
              style={styles.backdropOverlay}
              onPress={() => setMobileDrawerOpen(false)}
            />
            <View style={[styles.drawerContent, { paddingTop: insets.top }]}>
              <AdminSidebar
                activeScreen={activeScreen}
                onSelectScreen={handleSelectScreen}
                onLogoutPress={() => {
                  setMobileDrawerOpen(false);
                  setLogoutModalVisible(true);
                }}
                onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        visible={logoutModalVisible}
        title="Sign Out of Admin Portal"
        message="Are you sure you want to end your administrative session? You will be returned to the public school portal."
        confirmText="Sign Out"
        isDestructive={true}
        icon="log-out-outline"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(61, 23, 71, 0.08)',
    zIndex: 100,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  drawerBackdrop: {
    flex: 1,
    flexDirection: 'row',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24, 1, 38, 0.45)',
  },
  drawerContent: {
    width: 270,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 16,
    zIndex: 10,
  },
});

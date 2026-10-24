import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  BackHandler,
  Modal,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// Authentication & Language Contexts
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LanguageProvider } from './src/context/LanguageContext';

// Admin Portal
import AdminNavigator from './src/navigation/AdminNavigator';
import AdminLoginScreen from './src/screens/Admin/AdminLoginScreen';

// Global Shell Components
import Header from './src/components/Header';
import BottomNav from './src/components/BottomNav';
import ProfileModal from './src/components/ProfileModal';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import AdmissionScreen from './src/screens/AdmissionScreen';
import FacultyScreen from './src/screens/FacultyScreen';

// Guided Tour System
import TourProvider from './src/components/Tour/TourProvider';
import { useTour } from './src/hooks/useTour';
import { hasTourCompleted } from './src/utils/tourStorage';

function MainApp() {
  const { isAdmin, isSuperAdmin } = useAuth();
  const { registerNavigator, startTour, checkAndShowUserTour } = useTour();
  const [adminPanelActive, setAdminPanelActive] = useState(false);
  const [isAdminLoginVisible, setIsAdminLoginVisible] = useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('home');
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  // Forward / Tab Navigation (direct, instant, robust)
  const navigateToTab = (tabKey) => {
    if (tabKey === activeTab) return;
    setActiveTab(tabKey);
  };

  // Back Navigation: return to home tab if on detail screen, or dismiss profile
  const goBack = () => {
    if (isProfileModalVisible) {
      setIsProfileModalVisible(false);
      return true;
    }

    if (activeTab !== 'home') {
      setActiveTab('home');
      return true;
    }

    return false;
  };

  // Register navigation coordinator for Tour system
  useEffect(() => {
    if (registerNavigator) {
      registerNavigator({
        navigateToTab,
      });
    }
  }, [registerNavigator]);


  // Trigger First-Time User Tour only ONCE after Splash Screen has finished on startup
  const hasCheckedUserTourRef = useRef(false);
  useEffect(() => {
    if (!isSplashVisible && !adminPanelActive && !hasCheckedUserTourRef.current) {
      hasCheckedUserTourRef.current = true;
      const timer = setTimeout(() => {
        if (checkAndShowUserTour) {
          checkAndShowUserTour();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSplashVisible, adminPanelActive, checkAndShowUserTour]);

  // Android Hardware Back Button
  useEffect(() => {
    const onBackPress = () => goBack();
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [isProfileModalVisible, activeTab]);

  // Screen content renderer
  const renderScreenContent = (tabKey) => {
    switch (tabKey) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToAdmission={() => navigateToTab('admissions')}
            onNavigateToGallery={() => navigateToTab('gallery')}
            onNavigateToFaculty={() => navigateToTab('faculty')}
          />
        );
      case 'admissions':
      case 'admission':
        return <AdmissionScreen onBack={goBack} />;
      case 'faculty':
        return <FacultyScreen onBack={goBack} />;
      case 'gallery':
        return (
          <GalleryScreen
            onNavigateToAdmission={() => navigateToTab('admissions')}
            onBack={goBack}
          />
        );
      case 'about':
        return (
          <AboutUsScreen
            onNavigateToAdmission={() => navigateToTab('admissions')}
            onBack={goBack}
          />
        );
      default:
        return null;
    }
  };

  // Splash Screen View
  if (isSplashVisible) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
        <ExpoStatusBar style="dark" />
        <SplashScreen onFinish={() => setIsSplashVisible(false)} />
      </SafeAreaView>
    );
  }

  // Admin Portal View (Dedicated full-featured admin navigation)
  if (adminPanelActive && isAdmin) {
    return (
      <View style={[styles.root, { backgroundColor: '#FFFFFF' }]}>
        <ExpoStatusBar style="dark" backgroundColor="#FFFFFF" />
        <AdminNavigator onExitToSchoolApp={() => setAdminPanelActive(false)} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      <ExpoStatusBar style="dark" backgroundColor="#FAF8F5" />

      {/* Global RPS Shell Header */}
      <Header onOpenProfile={() => setIsProfileModalVisible(true)} />

      {/* Screen Viewport */}
      <View style={styles.stackContainer}>
        {renderScreenContent(activeTab)}
      </View>

      {/* Fixed Bottom Navigation Bar (5 Tabs) */}
      <BottomNav activeTab={activeTab} onTabChange={navigateToTab} />

      {/* Guest User Profile Modal with Admin Entry */}
      <ProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
        onNavigateToAdmission={() => {
          setIsProfileModalVisible(false);
          navigateToTab('admissions');
        }}
        onOpenAdminLogin={() => {
          setIsProfileModalVisible(false);
          if (isAdmin) {
            setAdminPanelActive(true);
          } else {
            setIsAdminLoginVisible(true);
          }
        }}
      />

      {/* Admin Login Modal */}
      <Modal
        visible={isAdminLoginVisible}
        animationType="slide"
        onRequestClose={() => setIsAdminLoginVisible(false)}
      >
        <AdminLoginScreen
          onClose={() => setIsAdminLoginVisible(false)}
          onLoginSuccess={() => {
            setIsAdminLoginVisible(false);
            setAdminPanelActive(true);
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LanguageProvider>
          <TourProvider>
            <MainApp />
          </TourProvider>
        </LanguageProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  stackContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FAF8F5',
  },
  baseScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FAF8F5',
  },
});

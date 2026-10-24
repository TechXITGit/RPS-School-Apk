import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Shadows, Radius } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';

export default function WelcomeTourModal({
  visible,
  tourType = 'user',
  onStart,
  onSkip,
}) {
  const { isHindi } = useLanguage();

  if (!visible) return null;

  const getTitle = () => {
    if (tourType === 'superadmin') {
      return isHindi ? 'सुपर एडमिन पोर्टल में स्वागत है 👑' : 'Welcome to Super Admin Portal 👑';
    }
    if (tourType === 'admin') {
      return isHindi ? 'एडमिन पोर्टल में स्वागत है 🛡️' : 'Welcome to RPS Admin Portal 🛡️';
    }
    return isHindi ? 'रुद्रपुर पब्लिक स्कूल में आपका स्वागत है 👋' : 'Welcome to Rudrapur Public School 👋';
  };

  const getSubtitle = () => {
    if (tourType === 'superadmin') {
      return isHindi
        ? 'आइए एक त्वरित टूर लें और स्कूल प्रबंधन व सुरक्षा टूल्स को समझें। इसमें केवल एक मिनट लगेगा।'
        : "Let's take a quick guided tour to explore administration, security controls, and audit logs. It takes just a minute.";
    }
    if (tourType === 'admin') {
      return isHindi
        ? 'आइए एक त्वरित टूर लें और शुल्क रिपोर्ट, उपस्थिति व छात्र प्रबंधन को समझें। इसमें केवल एक मिनट लगेगा।'
        : "Let's take a quick guided walkthrough to explore real-time metrics, student records, and fee registers.";
    }
    return isHindi
      ? 'आइए ऐप का एक छोटा और रोचक टूर लें ताकि आप सभी महत्वपूर्ण सुविधाओं को आसानी से समझ सकें।'
      : "Let's take a quick tour of the app and show you where everything is. It will only take a minute.";
  };

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onSkip}
    >
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onSkip}>
          <Pressable style={styles.card} onPress={() => {}}>
            {/* Top Decorative Mascot / Sparkle Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={tourType === 'user' ? 'compass' : 'shield-checkmark'}
                  size={34}
                  color="#3D1747"
                />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>{getTitle()}</Text>

            {/* Subtitle / Body */}
            <Text style={styles.subtitle}>{getSubtitle()}</Text>

            {/* Actions */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.skipBtn} onPress={onSkip} activeOpacity={0.75}>
                <Text style={styles.skipBtnText}>{isHindi ? 'छोड़ें (Skip)' : 'Skip'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.startBtn} onPress={onStart} activeOpacity={0.88}>
                <Text style={styles.startBtnText}>{isHindi ? 'टूर शुरू करें' : 'Start Tour'}</Text>
                <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backdrop: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(15, 7, 24, 0.74)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
    ...Shadows.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(61, 23, 71, 0.1)',
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FCD7FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(61, 23, 71, 0.1)',
    ...Shadows.sm,
  },
  title: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#260131',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20.5,
    color: '#554C58',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 24,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  skipBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F5F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#655B69',
  },
  startBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#3D1747',
    ...Shadows.sm,
  },
  startBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

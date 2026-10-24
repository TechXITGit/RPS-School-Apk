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

export default function FinishTourModal({
  visible,
  tourType = 'user',
  onFinish,
}) {
  const { isHindi } = useLanguage();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onFinish}
    >
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onFinish}>
          <Pressable style={styles.card} onPress={() => {}}>
            {/* Confetti / Celebration Trophy Icon */}
            <View style={styles.iconCircle}>
              <Ionicons name="sparkles" size={34} color="#21A572" />
            </View>

            {/* Title */}
            <Text style={styles.title}>
              {isHindi ? 'आप पूरी तरह तैयार हैं! 🎉' : "You're all set! 🎉"}
            </Text>

            {/* Message */}
            <Text style={styles.subtitle}>
              {isHindi
                ? 'अब आप ऐप के सभी महत्वपूर्ण फीचर्स से परिचित हैं। आप अपनी सुविधा अनुसार स्कूल की विभिन्न सेवाओं का अनुभव कर सकते हैं।'
                : 'Now you know where the key features and portals are. You can explore the app freely on your own.'}
            </Text>

            {/* Action Button */}
            <TouchableOpacity style={styles.finishBtn} onPress={onFinish} activeOpacity={0.88}>
              <Text style={styles.finishBtnText}>
                {isHindi ? 'अनुभव शुरू करें 🚀' : 'Start Exploring 🚀'}
              </Text>
            </TouchableOpacity>
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
    paddingTop: 26,
    paddingBottom: 22,
    alignItems: 'center',
    ...Shadows.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(33, 165, 114, 0.15)',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(33, 165, 114, 0.2)',
    marginBottom: 16,
    ...Shadows.sm,
  },
  title: {
    fontSize: 20,
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
  finishBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#21A572',
    ...Shadows.sm,
  },
  finishBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

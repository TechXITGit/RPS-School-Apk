// Reusable Confirmation Modal for Destructive/Sensitive Admin Actions
import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';

export default function ConfirmModal({
  visible,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  icon = 'help-circle-outline',
  onConfirm,
  onCancel,
}) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {/* Top Icon */}
          <View
            style={[
              styles.iconCircle,
              isDestructive ? styles.iconCircleDestructive : styles.iconCircleInfo,
            ]}
          >
            <Ionicons
              name={icon}
              size={28}
              color={isDestructive ? Colors.error : Colors.primary}
            />
          </View>

          {/* Title & Message */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Action Buttons */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                isDestructive ? styles.destructiveBtn : styles.primaryBtn,
              ]}
              onPress={onConfirm}
              activeOpacity={0.88}
            >
              <Text style={styles.confirmBtnText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
    ...Shadows.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconCircleDestructive: {
    backgroundColor: Colors.errorContainer,
  },
  iconCircleInfo: {
    backgroundColor: '#EEF2FF',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1B1C1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#6B5A72',
    textAlign: 'center',
    marginBottom: 22,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F5F0F7',
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#6B5A72',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  primaryBtn: {
    backgroundColor: '#4361EE',
  },
  destructiveBtn: {
    backgroundColor: '#E53935',
  },
  confirmBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

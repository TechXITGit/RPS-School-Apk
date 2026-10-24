import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

export default function NotificationModal({ visible, onClose }) {
  const { t, isHindi } = useLanguage();

  const notificationsList = t.notifications.items.map((item, idx) => ({
    ...item,
    category:
      item.type === 'admission'
        ? (isHindi ? 'प्रवेश' : 'Admissions')
        : item.type === 'event'
        ? (isHindi ? 'खेलकूद' : 'Sports')
        : (isHindi ? 'अकादमिक' : 'Academic'),
    color:
      item.type === 'admission'
        ? Colors.primaryContainer
        : item.type === 'event'
        ? Colors.secondary
        : Colors.surfaceTint,
    icon:
      item.type === 'admission'
        ? 'school-outline'
        : item.type === 'event'
        ? 'football-outline'
        : 'calendar-outline',
    unread: item.isNew,
  }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Sheet Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.bellIcon}>
                <Ionicons
                  name="notifications"
                  size={18}
                  color={Colors.primaryContainer}
                />
              </View>
              <Text style={styles.sheetTitle}>{t.notifications.title}</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {isHindi ? '2 नई' : '2 New'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* List of Notifications */}
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {notificationsList.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  item.unread && styles.cardUnread,
                ]}
              >
                <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.category}>{item.category}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.desc}</Text>
                </View>
                {item.unread && <View style={styles.dot} />}
              </View>
            ))}
          </ScrollView>

          {/* Footer Action */}
          <TouchableOpacity
            style={styles.footerBtn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.footerBtnText}>{t.notifications.markAllRead}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(38, 1, 49, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '75%',
    ...Shadows.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainer,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bellIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  countBadge: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSecondaryContainer,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    marginTop: 10,
  },
  listContent: {
    paddingVertical: 6,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceContainerLow,
    position: 'relative',
    gap: 12,
  },
  cardUnread: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.sm,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 11,
    color: Colors.outline,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.onSurfaceVariant,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
    alignSelf: 'center',
  },
  footerBtn: {
    marginTop: 14,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radius.full,
    paddingVertical: 12,
    alignItems: 'center',
  },
  footerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryContainer,
  },
});

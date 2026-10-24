// Metric Stat Card matching RPS Admin Dashboard screenshot
import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Shadows, Radius } from '../../theme/colors';

export default function StatCard({
  title,
  value,
  icon,
  iconColor,
  iconBg,
  bottomAccentColor,
  style,
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;

  return (
    <View style={[styles.card, isMobile ? styles.cardMobile : styles.cardDesktop, style]}>
      {/* Top Header Row: Label/Title (left) & Icon Circle (right) */}
      <View style={styles.topRow}>
        <Text
          style={[styles.title, isMobile && styles.titleMobile]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        <View
          style={[
            styles.iconCircle,
            isMobile && styles.iconCircleMobile,
            { backgroundColor: iconBg || '#EEF2FF' },
          ]}
        >
          <Ionicons name={icon} size={isMobile ? 16 : 20} color={iconColor || '#4361EE'} />
        </View>
      </View>

      {/* Metric Value Row: Full card width below header */}
      <View style={styles.valueRow}>
        <Text
          style={[styles.value, isMobile && styles.valueMobile]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {value}
        </Text>
      </View>

      {/* Colored bottom line accent */}
      <View style={[styles.bottomAccent, { backgroundColor: bottomAccentColor || '#4361EE' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    paddingTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.sm,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardDesktop: {
    flex: 1,
    minWidth: 200,
    minHeight: 110,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardMobile: {
    width: '48%',
    minHeight: 96,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#6B5A72',
    letterSpacing: 0.1,
    lineHeight: 16,
  },
  titleMobile: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconCircleMobile: {
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  valueRow: {
    marginTop: 8,
    marginBottom: 10,
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B1C1A',
    letterSpacing: -0.5,
  },
  valueMobile: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  bottomAccent: {
    height: 3.5,
    width: '100%',
    borderRadius: 2,
  },
});

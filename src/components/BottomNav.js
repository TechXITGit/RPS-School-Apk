import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadows, Radius } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import TourTarget from './Tour/TourTarget';

const MAX_BAR_WIDTH = 480;

export default function BottomNav({ activeTab, onTabChange }) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(10, insets.bottom > 0 ? (Platform.OS === 'android' ? 12 : 8) : 12);

  const TABS = useMemo(
    () => [
      {
        key: 'home',
        label: t.nav.home,
        iconActive: 'home',
        iconInactive: 'home-outline',
      },
      {
        key: 'admissions',
        label: t.nav.admissions,
        iconActive: 'school',
        iconInactive: 'school-outline',
      },
      {
        key: 'faculty',
        label: t.nav.faculty,
        iconActive: 'people',
        iconInactive: 'people-outline',
      },
      {
        key: 'gallery',
        label: t.nav.gallery,
        iconActive: 'grid',
        iconInactive: 'grid-outline',
      },
      {
        key: 'about',
        label: t.nav.about,
        iconActive: 'shield-checkmark',
        iconInactive: 'shield-outline',
      },
    ],
    [t]
  );

  return (
    <View style={[styles.navWrapper, { bottom: bottomOffset }]}>
      <View style={styles.navBar}>
        {/* Frosted Glass Background */}
        <BlurView
          intensity={Platform.OS === 'ios' ? 70 : 40}
          tint="light"
          style={StyleSheet.absoluteFill}
        />

        {/* Tab Items with Integrated Active Pill Styling */}
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <TourTarget
              key={tab.key}
              id={`nav-${tab.key}`}
              style={styles.tabTarget}
            >
              <TouchableOpacity
                onPress={() => onTabChange(tab.key)}
                activeOpacity={0.75}
                style={[
                  styles.tabItem,
                  isActive && styles.tabItemActive,
                ]}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
              >
                <Ionicons
                  name={isActive ? tab.iconActive : tab.iconInactive}
                  size={20}
                  color={isActive ? '#FFFFFF' : '#554C58'}
                />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.tabLabel,
                    isActive && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            </TourTarget>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    position: 'absolute',
    left: 10,
    right: 10,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: Radius.full,
    paddingVertical: 5,
    paddingHorizontal: 4,
    width: '100%',
    maxWidth: MAX_BAR_WIDTH,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.lg,
  },
  tabTarget: {
    flex: 1,
    minWidth: 0,
  },
  tabItem: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: Radius.full,
    gap: 2.5,
  },
  tabItemActive: {
    backgroundColor: '#3D1747',
    ...Shadows.sm,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#554C58',
    letterSpacing: 0,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
  },
});

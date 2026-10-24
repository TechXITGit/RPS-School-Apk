import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import TourTarget from './Tour/TourTarget';

export default function Header({ onOpenProfile }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.contentRow}>
        {/* School Crest & Title */}
        <TourTarget id="home-logo">
          <View style={styles.branding}>
            <Image
              source={require('../../assets/rps_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.titleColumn}>
              <View style={styles.titleRow}>
                <Text style={styles.schoolCode}>{t.header.schoolCode}</Text>
                <View style={styles.verifiedDot} />
              </View>
              <Text style={styles.motto}>{t.header.motto}</Text>
            </View>
          </View>
        </TourTarget>

        {/* Action Controls */}
        <View style={styles.actionGroup}>
          {/* Language Switcher */}
          <TourTarget id="header-language">
            <View style={styles.langPill}>
              <TouchableOpacity
                onPress={() => setLanguage('EN')}
                style={[
                  styles.langBtn,
                  language === 'EN' && styles.langBtnActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langText,
                    language === 'EN' && styles.langTextActive,
                  ]}
                >
                  EN
                </Text>
              </TouchableOpacity>
              <Text style={styles.langDivider}>|</Text>
              <TouchableOpacity
                onPress={() => setLanguage('HI')}
                style={[
                  styles.langBtn,
                  language === 'HI' && styles.langBtnActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langText,
                    language === 'HI' && styles.langTextActive,
                  ]}
                >
                  हिं
                </Text>
              </TouchableOpacity>
            </View>
          </TourTarget>

          {/* Profile Avatar (Guest User) */}
          <TourTarget id="header-profile">
            <TouchableOpacity
              style={styles.avatar}
              activeOpacity={0.75}
              onPress={onOpenProfile}
              accessibilityRole="button"
              accessibilityLabel="Guest User Profile"
            >
              <Ionicons name="person" size={16} color={Colors.onPrimary} />
            </TouchableOpacity>
          </TourTarget>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(61, 23, 71, 0.06)',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    zIndex: 100,
    ...Shadows.sm,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  titleColumn: {
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  schoolCode: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  verifiedDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.secondary,
  },
  motto: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 0.2,
    marginTop: 1,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radius.full,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  langBtnActive: {
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  langText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
  langTextActive: {
    color: Colors.primaryContainer,
    fontWeight: '800',
  },
  langDivider: {
    fontSize: 12,
    color: Colors.outline,
    marginHorizontal: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

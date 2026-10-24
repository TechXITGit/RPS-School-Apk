import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Easing,
  Platform,
} from 'react-native';
import { Colors, Shadows, Radius } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

/**
 * SplashScreen inspired by `assets/Splash Screen.json`:
 * - Lavender pastel canvas background (matching Splash Screen Bg)
 * - Two dynamic angled 3D floating panels (Frame 21 & Frame 22) swooping from top and bottom
 * - Smooth -9.7° to +9.7° rotational easing
 * - Centered elevated logo card scaling up with spring physics
 * - Staggered entrance for School Name & CBSE credentials above the logo
 * - Slogan, Session info, and animated loading bar below the logo
 */
export default function SplashScreen({ onFinish }) {
  const { t, isHindi } = useLanguage();

  // 1. Diagonal floating panels animation (Frame 22 top, Frame 21 bottom)
  const topPanelY = useRef(new Animated.Value(-height * 0.45)).current;
  const topPanelRot = useRef(new Animated.Value(-9.7)).current;
  const bottomPanelY = useRef(new Animated.Value(height * 0.45)).current;
  const bottomPanelRot = useRef(new Animated.Value(-9.7)).current;

  // 2. Center logo emblem card (matching Audi-Beats asset in Splash Screen.json)
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // 3. Staggered Top Info & School Title
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(18)).current;

  // 4. Staggered Bottom Tagline & School Details
  const infoOpacity = useRef(new Animated.Value(0)).current;
  const infoTranslateY = useRef(new Animated.Value(-18)).current;

  // 5. Sleek progress loading bar
  const progressAnim = useRef(new Animated.Value(0)).current;
  const footerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Phase 1: Diagonal curved panels swoop in with bezier curve (0s - 1.2s)
    Animated.parallel([
      Animated.timing(topPanelY, {
        toValue: -height * 0.12,
        duration: 1200,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
        useNativeDriver: true,
      }),
      Animated.timing(bottomPanelY, {
        toValue: height * 0.12,
        duration: 1200,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
        useNativeDriver: true,
      }),
      Animated.timing(topPanelRot, {
        toValue: 9.7,
        duration: 1600,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
        useNativeDriver: true,
      }),
      Animated.timing(bottomPanelRot, {
        toValue: 9.7,
        duration: 1600,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
        useNativeDriver: true,
      }),
    ]).start();

    // Phase 2: Center Logo Card scales up and fades in (0.8s - 1.8s)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1.0,
          friction: 6,
          tension: 45,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);

    // Phase 3: Top Title Section smoothly fades in (1.5s - 2.2s)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 1200);

    // Phase 4: Bottom Info & Slogan smoothly fades in (2.0s - 2.8s)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(infoOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(infoTranslateY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(footerFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1600);

    // Phase 5: Progress bar smoothly fills up across the splash duration
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3400,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Auto-transition to main screen after 3.8s
    const timer = setTimeout(() => {
      onFinish();
    }, 3800);

    return () => clearTimeout(timer);
  }, []);

  const topRotation = topPanelRot.interpolate({
    inputRange: [-15, 15],
    outputRange: ['-15deg', '15deg'],
  });

  const bottomRotation = bottomPanelRot.interpolate({
    inputRange: [-15, 15],
    outputRange: ['-15deg', '15deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onFinish}
      style={styles.container}
    >
      {/* 1. Top Angled Panel (Matching Frame 22 in Splash Screen.json) */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.topAngledPanel,
          {
            transform: [
              { translateY: topPanelY },
              { rotate: topRotation },
            ],
          },
        ]}
      >
        <View style={styles.panelSheen} />
      </Animated.View>

      {/* 2. Bottom Angled Panel (Matching Frame 21 in Splash Screen.json) */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.bottomAngledPanel,
          {
            transform: [
              { translateY: bottomPanelY },
              { rotate: bottomRotation },
            ],
          },
        ]}
      >
        <View style={styles.panelSheen} />
      </Animated.View>

      {/* Main Content Flow */}
      <View style={styles.contentContainer}>
        {/* Top Header & School Title (Matching AudioBeats title layer in JSON) */}
        <Animated.View
          style={[
            styles.titleWrapper,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          <View style={styles.crestBadge}>
            <View style={styles.crestDot} />
            <Text style={styles.crestBadgeText}>
              {isHindi ? 'सीबीएसई संबद्ध #3530491 • सत्र 2026-27' : 'CBSE AFFILIATED #3530491 • EST. 2024'}
            </Text>
          </View>

          <Text style={styles.schoolName}>
            {isHindi ? 'रुद्रपुर पब्लिक स्कूल' : 'RUDRAPUR PUBLIC SCHOOL'}
          </Text>
          <Text style={styles.schoolLocation}>
            {isHindi ? 'काशीपुरम, देवरिया' : 'Kashipuram, Deoria'}
          </Text>
        </Animated.View>

        {/* Central Logo Emblem Card (Matching Audi-Beats 1 2 3 asset in JSON) */}
        <Animated.View
          style={[
            styles.logoCardWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoCard}>
            <Image
              source={require('../../assets/rps_logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Bottom Tagline & School Info (Matching "Feel Every Beat." layer in JSON) */}
        <Animated.View
          style={[
            styles.infoWrapper,
            {
              opacity: infoOpacity,
              transform: [{ translateY: infoTranslateY }],
            },
          ]}
        >
          <Text style={styles.mottoText}>
            {isHindi
              ? 'विद्या ददाति विनयम • चरित्र निर्माण'
              : '“Building Bright Futures • Empowering Minds”'}
          </Text>

          <View style={styles.admissionPill}>
            <Text style={styles.admissionPillText}>
              {isHindi
                ? '🎒 प्रवेश प्रारंभ : नर्सरी – 5वीं'
                : '🎒 Admissions Open : Nursery – Class V'}
            </Text>
          </View>

          {/* Animated Loading Bar */}
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                { width: progressWidth },
              ]}
            />
          </View>
        </Animated.View>
      </View>

      {/* Footer Tap to Skip */}
      <Animated.View style={[styles.footer, { opacity: footerFade }]}>
        <Text style={styles.tapToSkip}>
          {isHindi ? 'आगे बढ़ने हेतु कहीं भी टैप करें' : 'Tap anywhere to continue'}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Soft pastel lavender background matching Splash Screen Bg in JSON ([0.77, 0.73, 1])
    backgroundColor: '#E7E0F8',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  // Top Angled Floating Ribbon (Frame 22)
  topAngledPanel: {
    position: 'absolute',
    top: -height * 0.15,
    width: width * 1.55,
    height: height * 0.42,
    backgroundColor: '#2E0E3B', // Deep Royal Plum matching RPS colors & Frame 22
    borderRadius: 60,
    shadowColor: '#1A0022',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },
  // Bottom Angled Floating Ribbon (Frame 21)
  bottomAngledPanel: {
    position: 'absolute',
    bottom: -height * 0.15,
    width: width * 1.55,
    height: height * 0.42,
    backgroundColor: '#2E0E3B',
    borderRadius: 60,
    shadowColor: '#1A0022',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },
  panelSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  // Top School Info (AudioBeats position)
  titleWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  crestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(61, 23, 71, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: Radius.full,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.12)',
    gap: 6,
  },
  crestDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  crestBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#3D1747',
    letterSpacing: 0.6,
  },
  schoolName: {
    fontSize: 25,
    fontWeight: '900',
    color: '#260131',
    letterSpacing: 1.2,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  schoolLocation: {
    fontSize: 13,
    fontWeight: '600',
    color: '#655B69',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  // Centered Logo Card (Audi-Beats 1 2 3 asset)
  logoCardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  logoCard: {
    width: 175,
    height: 175,
    borderRadius: 44,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    shadowColor: '#260131',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 14,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  // Bottom Slogan & Details ("Feel Every Beat." position)
  infoWrapper: {
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  mottoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3D1747',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  admissionPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.1)',
    shadowColor: '#260131',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  admissionPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#260131',
    letterSpacing: 0.2,
  },
  // Progress Bar
  progressTrack: {
    width: 180,
    height: 4,
    backgroundColor: 'rgba(61, 23, 71, 0.12)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3D1747',
    borderRadius: 2,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 28,
    alignItems: 'center',
    zIndex: 20,
  },
  tapToSkip: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#7D7382',
    letterSpacing: 0.3,
  },
});

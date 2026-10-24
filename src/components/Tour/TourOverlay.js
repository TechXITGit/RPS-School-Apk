import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Text,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import Spotlight from './Spotlight';
import TourTooltip from './TourTooltip';
import { calculateTourPosition } from '../../utils/tourPosition';
import { Shadows } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';

export default function TourOverlay({
  visible,
  step,
  stepIndex,
  totalSteps,
  targetRect,
  onNext,
  onPrevious,
  onSkip,
  isSkipConfirmVisible,
  onConfirmSkip,
  onCancelSkip,
}) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { isHindi } = useLanguage();

  // Animated values for smooth tooltip slide & fade (pure Native Driver on opacity/transform)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    if (visible && step) {
      fadeAnim.setValue(0);
      slideAnim.setValue(8);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 260,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [stepIndex, visible, step, fadeAnim, slideAnim]);

  if (!visible || !step) return null;

  // Calculate coordinates, spotlight cutout box, and arrow direction
  const {
    tooltipX,
    tooltipY,
    arrowDirection,
    arrowOffset,
    spotlightRect,
  } = calculateTourPosition(
    targetRect,
    { width: screenWidth, height: screenHeight },
    { width: 310, height: 180 },
    step.position || 'auto',
    step.id || ''
  );

  return (
    <View style={styles.overlayRoot} pointerEvents="box-none">
        {/* 1. Dark Backdrop with Cutout Spotlight Hole & Glowing Focus Border */}
        <Spotlight spotlightRect={spotlightRect} />

        {/* 2. Floating Coachmark Tooltip Card */}
        <View
          pointerEvents="box-none"
          style={[
            styles.tooltipWrapper,
            {
              left: tooltipX,
              top: tooltipY,
            },
          ]}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <TourTooltip
              step={step}
              stepIndex={stepIndex}
              totalSteps={totalSteps}
              arrowDirection={arrowDirection}
              arrowOffset={arrowOffset}
              onNext={onNext}
              onPrevious={onPrevious}
              onSkip={onSkip}
            />
          </Animated.View>
        </View>

        {/* 3. In-Modal Skip Confirmation Dialog (No nested Modal needed on Android) */}
        {isSkipConfirmVisible && (
          <Pressable style={styles.confirmBackdrop} onPress={onCancelSkip}>
            <Pressable style={styles.confirmCard} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.confirmTitle}>
                {isHindi ? 'क्या आप टूर छोड़ना चाहते हैं?' : 'Skip Guided Tour?'}
              </Text>
              <Text style={styles.confirmBody}>
                {isHindi
                  ? 'क्या आप सच में ऐप टूर छोड़ना चाहते हैं? आप इसे बाद में प्रोफ़ाइल से दोबारा देख सकते हैं।'
                  : 'Are you sure you want to exit the interactive walkthrough? You can replay it anytime from your Profile.'}
              </Text>

              <View style={styles.confirmBtnRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onCancelSkip}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelBtnText}>
                    {isHindi ? 'जारी रखें' : 'Continue'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmSkipBtn}
                  onPress={onConfirmSkip}
                  activeOpacity={0.85}
                >
                  <Text style={styles.confirmSkipBtnText}>
                    {isHindi ? 'टूर छोड़ें' : 'Skip Tour'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    elevation: 99999,
  },
  tooltipWrapper: {
    position: 'absolute',
    zIndex: 100000,
    elevation: 100000,
  },
  confirmBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 7, 24, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 100001,
    elevation: 100001,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    ...Shadows.lg,
  },
  confirmTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#260131',
    marginBottom: 8,
  },
  confirmBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5E5462',
    fontWeight: '500',
    marginBottom: 20,
  },
  confirmBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F5F0F7',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3D1747',
  },
  confirmSkipBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#E53935',
  },
  confirmSkipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TourArrow from './TourArrow';
import { Shadows, Radius } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';

export default function TourTooltip(props) {
  const { isHindi } = useLanguage();
  const hookInsets = useSafeAreaInsets();

  const stepIndex = props.currentStep !== undefined ? props.currentStep : (props.stepIndex || 0);
  const totalSteps = props.totalSteps || 8;
  const isFirst = stepIndex === 0;
  const isLast = props.isLastStep !== undefined ? props.isLastStep : (stepIndex === totalSteps - 1);

  const title = props.title || (props.step && (isHindi && props.step.hindiTitle ? props.step.hindiTitle : props.step.title)) || '';
  const description = props.description || (props.step && (isHindi && props.step.hindiDesc ? props.step.hindiDesc : props.step.description)) || '';

  const onNext = props.onNext;
  const onPrevious = props.onPrev || props.onPrevious;
  const onSkip = props.onSkip;

  // Measurement and geometry props
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
  const screenWidth = props.screenWidth || windowWidth;
  const screenHeight = props.screenHeight || windowHeight;
  const screenInsets = {
    top: Math.max(hookInsets?.top || 0, props.insets?.top || 0),
    bottom: Math.max(hookInsets?.bottom || 0, props.insets?.bottom || 0),
    left: Math.max(hookInsets?.left || 0, props.insets?.left || 0),
    right: Math.max(hookInsets?.right || 0, props.insets?.right || 0),
  };
  const position = props.position;
  const targetWidth = props.targetWidth || 0;
  const targetHeight = props.targetHeight || 0;
  const tooltipPosition = props.tooltipPosition || 'auto';

  // Smooth entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(8);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [stepIndex, fadeAnim, slideAnim]);

  // Compute card dimensions and viewport clamping
  const cardWidth = Math.min(312, screenWidth - 28);
  const estimatedCardHeight = 185;

  let clampedLeft = (screenWidth - cardWidth) / 2;
  let clampedTop = (screenHeight - estimatedCardHeight) / 2;
  let arrowDir = 'none';
  let arrowOffset = cardWidth / 2;

  if (position && (targetWidth > 0 || targetHeight > 0)) {
    const targetCenterX = position.x + targetWidth / 2;
    const idealLeft = targetCenterX - cardWidth / 2;
    const minLeft = screenInsets.left + 14;
    const maxLeft = screenWidth - screenInsets.right - cardWidth - 14;
    clampedLeft = Math.max(minLeft, Math.min(idealLeft, maxLeft));

    const offset = 14;
    let resolvedPos = tooltipPosition;

    if (resolvedPos === 'auto' || (resolvedPos !== 'top' && resolvedPos !== 'bottom')) {
      const spaceBelow = screenHeight - screenInsets.bottom - (position.y + targetHeight + offset);
      resolvedPos = spaceBelow >= estimatedCardHeight ? 'bottom' : 'top';
    }

    if (resolvedPos === 'top') {
      clampedTop = position.y - offset - estimatedCardHeight;
      arrowDir = 'bottom';
    } else {
      clampedTop = position.y + targetHeight + offset;
      arrowDir = 'top';
    }

    const minTop = screenInsets.top + 12;
    const maxTop = screenHeight - screenInsets.bottom - estimatedCardHeight - 12;
    clampedTop = Math.max(minTop, Math.min(clampedTop, maxTop));

    const relativeArrowX = targetCenterX - clampedLeft;
    arrowOffset = Math.max(24, Math.min(relativeArrowX, cardWidth - 24));
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.tooltipContainer,
        {
          left: clampedLeft,
          top: clampedTop,
          width: cardWidth,
        },
      ]}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={styles.card} accessibilityLabel={title}>
          {/* Directional Arrow */}
          <TourArrow direction={arrowDir} offset={arrowOffset} />

          {/* Header with Step Counter & Close/Skip cross */}
          <View style={styles.headerRow}>
            <View style={styles.badge}>
              <Ionicons name="compass-outline" size={13} color="#21A572" />
              <Text style={styles.badgeText}>
                {isHindi
                  ? `चरण ${stepIndex + 1} / ${totalSteps}`
                  : `Step ${stepIndex + 1} of ${totalSteps}`}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onSkip}
              style={styles.closeIconBtn}
              activeOpacity={0.7}
              accessibilityLabel="Skip Tour"
            >
              <Ionicons name="close" size={16} color="#8A7B8E" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            {description}
          </Text>

          {/* Action Controls Footer */}
          <View style={styles.footerRow}>
            {/* Skip Tour Button */}
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={onSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>
                {isHindi ? 'स्किप' : 'Skip Tour'}
              </Text>
            </TouchableOpacity>

            {/* Previous & Next Buttons */}
            <View style={styles.btnGroup}>
              {!isFirst && onPrevious && (
                <TouchableOpacity
                  style={styles.prevBtn}
                  onPress={onPrevious}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-back" size={15} color="#3D1747" />
                  <Text style={styles.prevText}>
                    {isHindi ? 'पिछला' : 'Previous'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.nextBtn, isLast && styles.finishBtn]}
                onPress={onNext}
                activeOpacity={0.88}
              >
                <Text style={styles.nextText}>
                  {isLast
                    ? isHindi
                      ? 'समाप्त'
                      : 'Finish'
                    : isHindi
                    ? 'आगे →'
                    : 'Next →'}
                </Text>
                {isLast ? (
                  <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                ) : null}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tooltipContainer: {
    position: 'absolute',
    zIndex: 100000,
    elevation: 100000,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(61, 23, 71, 0.12)',
    ...Shadows.lg,
    zIndex: 9999,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 165, 114, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1B8258',
    letterSpacing: 0.2,
  },
  closeIconBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#260131',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 18.5,
    color: '#4D444D',
    fontWeight: '500',
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(61, 23, 71, 0.06)',
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  skipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#7E747D',
  },
  btnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEF5',
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 12,
    gap: 4,
  },
  prevText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#3D1747',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D1747',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 5,
    ...Shadows.sm,
  },
  finishBtn: {
    backgroundColor: '#21A572',
  },
  nextText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});


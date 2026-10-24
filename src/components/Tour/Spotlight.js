import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Platform,
} from 'react-native';

const OVERLAY_COLOR = 'rgba(15, 7, 24, 0.74)';

/**
 * Pure React Native Spotlight Overlay
 * Renders four darkened surrounding curtain views + pulsing animated glow focus ring.
 * Eliminates native SVG Mask crashing on Android release builds while maintaining
 * perfect visual spotlight cutout around the target element.
 *
 * @param {Object} spotlightRect - { x, y, width, height, borderRadius }
 */
export default function Spotlight({ spotlightRect }) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Pulsing animation for the spotlight highlight ring
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 1100,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  // If no target rect or invalid dimensions, render pure dim overlay
  if (
    !spotlightRect ||
    !Number.isFinite(spotlightRect.x) ||
    !Number.isFinite(spotlightRect.y) ||
    !Number.isFinite(spotlightRect.width) ||
    !Number.isFinite(spotlightRect.height) ||
    spotlightRect.width <= 0 ||
    spotlightRect.height <= 0
  ) {
    return (
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { backgroundColor: OVERLAY_COLOR }]}
      />
    );
  }

  const { x, y, width, height, borderRadius = 14 } = spotlightRect;

  // Safe normalized coordinates clamped within screen dimensions
  const safeX = Math.max(0, Math.round(x));
  const safeY = Math.max(0, Math.round(y));
  const safeW = Math.max(8, Math.min(Math.round(width), screenWidth - safeX));
  const safeH = Math.max(8, Math.round(height));

  const topHeight = safeY;
  const bottomTop = safeY + safeH;
  const bottomHeight = Math.max(0, screenHeight - bottomTop);
  const leftWidth = safeX;
  const rightLeft = safeX + safeW;
  const rightWidth = Math.max(0, screenWidth - rightLeft);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {/* 1. Top dark curtain */}
      {topHeight > 0 && (
        <View
          style={[
            styles.curtain,
            { top: 0, left: 0, width: screenWidth, height: topHeight },
          ]}
        />
      )}

      {/* 2. Bottom dark curtain */}
      {bottomHeight > 0 && (
        <View
          style={[
            styles.curtain,
            { top: bottomTop, left: 0, width: screenWidth, height: bottomHeight },
          ]}
        />
      )}

      {/* 3. Left dark curtain */}
      {leftWidth > 0 && (
        <View
          style={[
            styles.curtain,
            { top: safeY, left: 0, width: leftWidth, height: safeH },
          ]}
        />
      )}

      {/* 4. Right dark curtain */}
      {rightWidth > 0 && (
        <View
          style={[
            styles.curtain,
            { top: safeY, left: rightLeft, width: rightWidth, height: safeH },
          ]}
        />
      )}

      {/* 5. Pulsing Glowing Focus Border over the cutout (isolated layout from Native Driver) */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: safeX,
          top: safeY,
          width: safeW,
          height: safeH,
          borderRadius: borderRadius,
        }}
      >
        <Animated.View
          style={[
            styles.glowRing,
            {
              width: '100%',
              height: '100%',
              borderRadius: borderRadius,
              opacity: pulseAnim,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  curtain: {
    position: 'absolute',
    backgroundColor: OVERLAY_COLOR,
  },
  glowRing: {
    borderWidth: 2.5,
    borderColor: '#FCD7FF',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    shadowColor: '#8C1D74',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 10,
    elevation: 8,
  },
});

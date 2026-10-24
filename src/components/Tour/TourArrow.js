import React from 'react';
import { View, StyleSheet } from 'react-native';

const ARROW_SIZE = 10;
const TOOLTIP_BG = '#FFFFFF';

/**
 * Directional Arrow pointing towards the target element
 * @param {'top' | 'bottom' | 'left' | 'right' | 'none'} direction
 * @param {number} offset - horizontal or vertical offset
 */
export default function TourArrow({ direction = 'top', offset = 24 }) {
  if (direction === 'none') return null;

  if (direction === 'top') {
    // Arrow on top of tooltip, pointing UP towards target
    return (
      <View
        style={[
          styles.arrowBase,
          styles.arrowTop,
          { left: Math.max(14, offset - ARROW_SIZE) },
        ]}
      />
    );
  }

  if (direction === 'bottom') {
    // Arrow on bottom of tooltip, pointing DOWN towards target
    return (
      <View
        style={[
          styles.arrowBase,
          styles.arrowBottom,
          { left: Math.max(14, offset - ARROW_SIZE) },
        ]}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  arrowBase: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    zIndex: 9999,
  },
  arrowTop: {
    top: -ARROW_SIZE,
    borderLeftWidth: ARROW_SIZE,
    borderRightWidth: ARROW_SIZE,
    borderBottomWidth: ARROW_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: TOOLTIP_BG,
  },
  arrowBottom: {
    bottom: -ARROW_SIZE,
    borderLeftWidth: ARROW_SIZE,
    borderRightWidth: ARROW_SIZE,
    borderTopWidth: ARROW_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: TOOLTIP_BG,
  },
});

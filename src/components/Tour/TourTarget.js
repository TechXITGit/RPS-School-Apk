import React from 'react';
import { StyleSheet } from 'react-native';
import { TourTarget as RNTourTarget } from '@wrack/react-native-tour-guide';

/**
 * TourTarget wrapper backed by @wrack/react-native-tour-guide
 * Ensures collapsable={false} so Android native views are never flattened,
 * preventing layout measurement failures and status bar offsets.
 * Automatically preserves flex layout when wrapping flex items (e.g. tabs or headers).
 */
export default function TourTarget({ id, children, style, ...rest }) {
  let computedStyle = style;

  // If style wasn't explicitly passed, check if the child has flex: 1 or minWidth
  if (!computedStyle && React.isValidElement(children) && children.props?.style) {
    const flat = StyleSheet.flatten(children.props.style);
    if (flat?.flex) {
      computedStyle = { flex: flat.flex };
    }
  }

  return (
    <RNTourTarget id={id} style={computedStyle} {...rest}>
      {children}
    </RNTourTarget>
  );
}

export { TourTarget };


// Rudrapur Public School Design System Tokens
// Based on Stitch Design specifications

export const Colors = {
  // Primary (Deep Royal Purple / Indigo)
  primary: '#260131',
  primaryContainer: '#3D1747',
  primaryFixed: '#FCD7FF',
  primaryFixedDim: '#E8B5F0',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#AD7EB5',
  onPrimaryFixed: '#30093A',
  surfaceTint: '#794F82',

  // Secondary (Emerald / Forest Green)
  secondary: '#3A684D',
  secondaryContainer: '#B9EBCA',
  secondaryFixed: '#BCEECD',
  secondaryFixedDim: '#A0D2B2',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#214F37',
  onSecondaryFixed: '#002111',

  // Tertiary
  tertiary: '#00170B',
  tertiaryContainer: '#002E1A',
  tertiaryFixed: '#71FCB5',
  tertiaryFixedDim: '#52DF9B',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#00A368',

  // Background & Surface
  background: '#FBF9F6',
  surface: '#FFFFFF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F5F3F0',
  surfaceContainer: '#EFEEEB',
  surfaceContainerHigh: '#EAE8E5',
  surfaceContainerHighest: '#E4E2DF',
  surfaceDim: '#DBDAD7',
  surfaceBright: '#FBF9F6',

  // Text & Content
  onBackground: '#1B1C1A',
  onSurface: '#1B1C1A',
  onSurfaceVariant: '#4D444D',
  outline: '#7E747D',
  outlineVariant: '#D0C3CD',

  // Feedback
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onError: '#FFFFFF',
  onErrorContainer: '#93000A',
  success: '#2E7D32',
  warning: '#ED6C02',
};

export const Shadows = {
  sm: {
    shadowColor: '#3D1747',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#3D1747',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  lg: {
    shadowColor: '#3D1747',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const Radius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  full: 9999,
};

export default { Colors, Shadows, Radius };

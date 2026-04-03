export const colors = {
  background: '#F4F6FB',
  card: '#FFFFFF',
  cardInner: '#F8F9FF',

  primary: '#5B67CA',
  primaryLight: '#EEF0FF',
  primaryDark: '#3D4BA8',

  success: '#27AE60',
  successLight: '#E8F8EF',
  warning: '#F39C12',
  warningLight: '#FEF6E7',
  danger: '#E74C3C',
  dangerLight: '#FDECEA',

  textPrimary: '#1A1D3A',
  textSecondary: '#8890B5',
  textMuted: '#B0B7D3',

  border: '#E2E5F0',
  borderFocus: '#5B67CA',

  inputBg: '#FFFFFF',
  inputBgAuto: '#EEF0FF',

  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const shadow = {
  card: {
    shadowColor: '#1A1D3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sticky: {
    shadowColor: '#1A1D3A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
};

export const typography = {
  h1: { fontSize: 22, fontWeight: '700' as const, color: colors.textPrimary },
  h2: { fontSize: 18, fontWeight: '700' as const, color: colors.textPrimary },
  h3: { fontSize: 16, fontWeight: '600' as const, color: colors.textPrimary },
  body: { fontSize: 14, fontWeight: '400' as const, color: colors.textPrimary },
  bodyBold: { fontSize: 14, fontWeight: '600' as const, color: colors.textPrimary },
  small: { fontSize: 12, fontWeight: '400' as const, color: colors.textSecondary },
  smallBold: { fontSize: 12, fontWeight: '600' as const, color: colors.textSecondary },
  label: { fontSize: 11, fontWeight: '500' as const, color: colors.textSecondary },
};

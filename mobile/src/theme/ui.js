import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const ui = {
  colors: {
    background: '#f4f7fb',
    surface: '#ffffff',
    text: '#1f2937',
    mutedText: '#6b7280',
    primary: '#0f766e',
    primarySoft: '#ccfbf1',
    accent: '#ea580c',
    danger: '#dc2626',
    success: '#16a34a',
    border: '#e5e7eb',
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    pill: 999,
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 28,
  },
  type: {
    title: {
      fontSize: width > 390 ? 31 : 28,
      fontWeight: '800',
      color: '#1f2937',
      letterSpacing: 0.2,
    },
    heading: {
      fontSize: width > 390 ? 23 : 21,
      fontWeight: '700',
      color: '#1f2937',
    },
    body: {
      fontSize: 15,
      color: '#6b7280',
      lineHeight: 22,
    },
  },
  shadow: {
    card: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      elevation: 4,
    },
  },
};

export const screenPadding = width > 390 ? 22 : 16;

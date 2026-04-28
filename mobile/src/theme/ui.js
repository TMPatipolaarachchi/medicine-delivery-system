import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const ui = {
  colors: {
    background: '#eef5f9',
    surface: '#ffffff',
    text: '#102a43',
    mutedText: '#627d98',
    primary: '#0b7285',
    primarySoft: '#d8f3f7',
    accent: '#2f9e44',
    danger: '#dc2626',
    success: '#2b8a3e',
    border: '#d9e2ec',
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
      color: '#102a43',
      letterSpacing: 0.2,
    },
    heading: {
      fontSize: width > 390 ? 23 : 21,
      fontWeight: '700',
      color: '#102a43',
    },
    body: {
      fontSize: 15,
      color: '#627d98',
      lineHeight: 22,
    },
  },
  shadow: {
    card: {
      shadowColor: '#243b53',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.09,
      shadowRadius: 16,
      elevation: 4,
    },
  },
};

export const screenPadding = width > 390 ? 22 : 16;

export const theme = {
  light: {
    primary: '#FFD700',
    secondary: '#F9FAFB',
    background: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    cardBg: '#F9FAFB',
  },
  dark: {
    primary: '#FFD700',
    secondary: '#0C0A09',
    background: '#000000',
    text: '#F9FAFB',
    textSecondary: '#A8A29E',
    border: '#292524',
    cardBg: '#1C1917',
  },
};

export const getThemeColors = (isDark) => (isDark ? theme.dark : theme.light);

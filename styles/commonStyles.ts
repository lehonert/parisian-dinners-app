
import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';

export const colors = {
  primary: '#8B1538',
  primaryLight: '#8B153820',
  secondary: '#2C2C2C',
  background: '#FEFEFE',
  surface: '#FFFFFF',
  text: '#2C2C2C',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#E5E5E5',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  grey: '#F5F5F5',
  white: '#FFFFFF',
  accent: '#FFD700',
};

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 20 : 16,
    marginBottom: isTablet ? 20 : 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: isTablet ? 16 : 12,
    marginBottom: isTablet ? 20 : 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: isTablet ? 10 : 8,
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 16 : 12,
    fontSize: isTablet ? 18 : 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  label: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: isTablet ? 10 : 8,
  },
  errorText: {
    fontSize: isTablet ? 14 : 12,
    color: colors.error,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: isTablet ? 20 : 16,
  },
});

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: isTablet ? 18 : 16,
    paddingHorizontal: isTablet ? 28 : 24,
    borderRadius: isTablet ? 10 : 8,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  primaryText: {
    color: colors.white,
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
  } as TextStyle,
  secondary: {
    backgroundColor: colors.surface,
    paddingVertical: isTablet ? 18 : 16,
    paddingHorizontal: isTablet ? 28 : 24,
    borderRadius: isTablet ? 10 : 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  } as ViewStyle,
  secondaryText: {
    color: colors.text,
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
  } as TextStyle,
  outline: {
    backgroundColor: 'transparent',
    paddingVertical: isTablet ? 18 : 16,
    paddingHorizontal: isTablet ? 28 : 24,
    borderRadius: isTablet ? 10 : 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  } as ViewStyle,
  outlineText: {
    color: colors.primary,
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
  } as TextStyle,
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: isTablet ? 18 : 16,
    paddingHorizontal: isTablet ? 28 : 24,
    borderRadius: isTablet ? 10 : 8,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  ghostText: {
    color: colors.primary,
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
  } as TextStyle,
});

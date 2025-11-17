
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import Icon from './Icon';
import { colors } from '../styles/commonStyles';
import { useResponsive } from '../hooks/useResponsive';

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
}

export default function ScreenHeader({
  title,
  showBackButton = true,
  onBackPress,
  rightComponent,
  backgroundColor = colors.white,
}: ScreenHeaderProps) {
  const { isTablet, spacing } = useResponsive();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/(tabs)/events');
      }
    }
  };

  return (
    <View style={[styles.header, { paddingHorizontal: spacing, backgroundColor }]}>
      {showBackButton ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={isTablet ? 28 : 24} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} />
      )}
      
      <Text style={[styles.title, isTablet && styles.titleTablet]} numberOfLines={1}>
        {title}
      </Text>
      
      {rightComponent ? (
        <View style={styles.rightComponent}>{rightComponent}</View>
      ) : (
        <View style={styles.backButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...Platform.select({
      android: {
        paddingTop: 48,
      },
    }),
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  titleTablet: {
    fontSize: 24,
  },
  rightComponent: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

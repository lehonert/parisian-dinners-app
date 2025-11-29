
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useWebOptimization } from '../hooks/useWebOptimization';

interface WebContainerProps {
  children: React.ReactNode;
  centered?: boolean;
  maxWidth?: number;
}

export default function WebContainer({ 
  children, 
  centered = true,
  maxWidth 
}: WebContainerProps) {
  const { isWeb, isDesktop, maxContentWidth } = useWebOptimization();

  if (!isWeb || !isDesktop) {
    return <>{children}</>;
  }

  const containerMaxWidth = maxWidth || maxContentWidth;

  return (
    <View style={styles.outerContainer}>
      <View 
        style={[
          styles.innerContainer,
          centered && styles.centered,
          { maxWidth: containerMaxWidth }
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Platform.OS === 'web' ? '#000' : 'transparent',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
  },
  centered: {
    alignSelf: 'center',
  },
});

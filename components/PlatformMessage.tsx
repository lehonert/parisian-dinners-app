
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../styles/commonStyles';

interface PlatformMessageProps {
  webMessage?: string;
  nativeMessage?: string;
  showOnWeb?: boolean;
  showOnNative?: boolean;
}

export default function PlatformMessage({
  webMessage = "Cette fonctionnalité est optimisée pour le web",
  nativeMessage = "Cette fonctionnalité est optimisée pour mobile",
  showOnWeb = false,
  showOnNative = false,
}: PlatformMessageProps) {
  const isWeb = Platform.OS === 'web';

  if (isWeb && !showOnWeb) return null;
  if (!isWeb && !showOnNative) return null;

  const message = isWeb ? webMessage : nativeMessage;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary + '20',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  text: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
});


import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { colors } from '../styles/commonStyles';

export default function OnlineStatusBanner() {
  const isOnline = useOnlineStatus();

  // Ne rien afficher si en ligne ou pas sur web
  if (isOnline || Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        ⚠️ Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFA500',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

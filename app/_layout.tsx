
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { setupErrorLogging } from '../utils/errorLogger';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';

export default function RootLayout() {
  useEffect(() => {
    // Set up global error logging
    console.log('RootLayout: Setting up error logging');
    setupErrorLogging();
  }, []);

  console.log('RootLayout: Rendering');

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <DataProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'default',
              }}
            />
          </DataProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

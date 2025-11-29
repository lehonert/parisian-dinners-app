
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { setupErrorLogging } from '../utils/errorLogger';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';
import { Platform, View } from 'react-native';
import OnlineStatusBanner from '../components/OnlineStatusBanner';
import { registerServiceWorker } from '../utils/registerServiceWorker';
import * as SplashScreen from 'expo-splash-screen';

// Empêcher le splash screen de se cacher automatiquement
SplashScreen.preventAutoHideAsync().catch(() => {
  console.log('SplashScreen.preventAutoHideAsync failed');
});

export default function RootLayout() {
  useEffect(() => {
    // Set up global error logging
    console.log('RootLayout: Setting up error logging');
    setupErrorLogging();

    // Log platform information
    console.log('Platform:', Platform.OS);
    console.log('Running on web:', Platform.OS === 'web');

    // Register service worker for PWA functionality (web only)
    if (Platform.OS === 'web') {
      console.log('RootLayout: Registering service worker');
      registerServiceWorker();
    }

    // Cacher le splash screen après un court délai
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {
        console.log('SplashScreen.hideAsync failed');
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  console.log('RootLayout: Rendering');

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <DataProvider>
            <View style={{ flex: 1 }}>
              {Platform.OS === 'web' && <OnlineStatusBanner />}
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'default',
                }}
              />
            </View>
          </DataProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

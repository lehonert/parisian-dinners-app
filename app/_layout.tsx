
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <DataProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="event/[id]" />
            <Stack.Screen name="admin/create-event" />
            <Stack.Screen name="admin/edit-event/[id]" />
            <Stack.Screen name="subscription" />
          </Stack>
          <StatusBar style="auto" />
        </DataProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

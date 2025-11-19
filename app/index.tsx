
import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../styles/commonStyles';
import { Text, View } from 'react-native';

export default function IndexScreen() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log('IndexScreen: isLoading:', isLoading, 'user:', user?.name);
  }, [isLoading, user]);

  if (isLoading) {
    console.log('IndexScreen: Showing loading spinner');
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <LoadingSpinner />
        <View style={{ position: 'absolute', bottom: 50, alignSelf: 'center' }}>
          <Text>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (user) {
    console.log('IndexScreen: User found, redirecting to events');
    return <Redirect href="/(tabs)/events" />;
  }

  console.log('IndexScreen: No user, redirecting to welcome');
  return <Redirect href="/(auth)/welcome" />;
}

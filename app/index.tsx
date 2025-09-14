
import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../styles/commonStyles';

export default function IndexScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/events" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}

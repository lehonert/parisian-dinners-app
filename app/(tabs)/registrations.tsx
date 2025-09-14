
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import { mockEvents, mockRegistrations } from '../../data/mockData';
import EventCard from '../../components/EventCard';

export default function RegistrationsScreen() {
  // Get events where user is registered
  const userRegistrations = mockRegistrations;
  const registeredEvents = mockEvents.filter(event => 
    userRegistrations.some(reg => reg.eventId === event.id)
  );

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mes inscriptions</Text>
          <Text style={styles.subtitle}>
            {registeredEvents.length} événement{registeredEvents.length > 1 ? 's' : ''}
          </Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {registeredEvents.length > 0 ? (
            registeredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => handleEventPress(event.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Vous n&apos;êtes inscrit à aucun événement pour le moment
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Découvrez nos événements dans l&apos;onglet &quot;Événements&quot;
              </Text>
            </View>
          )}
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});

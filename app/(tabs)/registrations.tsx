
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import EventCard from '../../components/EventCard';
import { useResponsive } from '../../hooks/useResponsive';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Event } from '../../types';

export default function RegistrationsScreen() {
  const { isTablet, columns, spacing } = useResponsive();
  const { user } = useAuth();
  const { events, registrations, loadingEvents, loadingRegistrations } = useData();
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (user && events.length > 0 && registrations.length > 0) {
      const userRegs = registrations.filter(reg => reg.userId === user.id);
      const userEvents = events.filter(event =>
        userRegs.some(reg => reg.eventId === event.id)
      );
      setRegisteredEvents(userEvents);
    } else {
      setRegisteredEvents([]);
    }
  }, [user, events, registrations]);

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <View style={[styles.eventItem, { width: isTablet ? `${100 / columns}%` : '100%' }]}>
      <EventCard
        event={item}
        onPress={() => handleEventPress(item.id)}
      />
    </View>
  );

  if (loadingEvents || loadingRegistrations) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
            Chargement de vos inscriptions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={styles.container}>
        <View style={[styles.header, { paddingHorizontal: spacing }]}>
          <Text style={[styles.title, isTablet && styles.titleTablet]}>Mes inscriptions</Text>
          <Text style={[styles.subtitle, isTablet && styles.subtitleTablet]}>
            {registeredEvents.length} événement{registeredEvents.length > 1 ? 's' : ''}
          </Text>
        </View>

        {isTablet ? (
          <FlatList
            data={registeredEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            numColumns={columns}
            key={columns}
            contentContainerStyle={[styles.gridContainer, { paddingHorizontal: spacing / 2 }]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, isTablet && styles.emptyStateTextTablet]}>
                  Vous n&apos;êtes inscrit à aucun événement pour le moment
                </Text>
                <Text style={[styles.emptyStateSubtext, isTablet && styles.emptyStateSubtextTablet]}>
                  Découvrez nos événements dans l&apos;onglet &quot;Événements&quot;
                </Text>
              </View>
            }
          />
        ) : (
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
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
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
  titleTablet: {
    fontSize: 36,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  subtitleTablet: {
    fontSize: 18,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  loadingTextTablet: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  eventItem: {
    paddingHorizontal: 10,
    marginBottom: 10,
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
  emptyStateTextTablet: {
    fontSize: 22,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  emptyStateSubtextTablet: {
    fontSize: 18,
  },
  bottomPadding: {
    height: 20,
  },
});

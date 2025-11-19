
import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import { mockEvents, mockRegistrations } from '../../data/mockData';
import EventCard from '../../components/EventCard';
import { useResponsive } from '../../hooks/useResponsive';

export default function RegistrationsScreen() {
  const { isTablet, columns, spacing } = useResponsive();
  
  // Get events where user is registered
  const userRegistrations = mockRegistrations;
  const registeredEvents = mockEvents.filter(event => 
    userRegistrations.some(reg => reg.eventId === event.id)
  );

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const renderEventItem = ({ item }: { item: typeof mockEvents[0] }) => (
    <View style={[styles.eventItem, { width: isTablet ? `${100 / columns}%` : '100%' }]}>
      <EventCard
        event={item}
        onPress={() => handleEventPress(item.id)}
      />
    </View>
  );

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

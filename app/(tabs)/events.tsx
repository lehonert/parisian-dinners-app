
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import { mockEvents } from '../../data/mockData';
import EventCard from '../../components/EventCard';
import { useResponsive } from '../../hooks/useResponsive';

export default function EventsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const { isTablet, columns, spacing } = useResponsive();

  const now = new Date();
  const upcomingEvents = mockEvents.filter(event => event.date > now);
  const pastEvents = mockEvents.filter(event => event.date <= now);

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

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
          <View style={styles.titleContainer}>
            <Image 
              source={require('../../assets/images/92510293-455a-4eb0-b08e-b4694dac60f6.png')}
              style={[styles.logo, isTablet && styles.logoTablet]}
              resizeMode="contain"
            />
            <Text style={[styles.title, isTablet && styles.titleTablet]}>Les Dîners Parisiens</Text>
          </View>
          
          <View style={[styles.tabContainer, isTablet && styles.tabContainerTablet]}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
              onPress={() => setActiveTab('upcoming')}
            >
              <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText, isTablet && styles.tabTextTablet]}>
                À venir
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'past' && styles.activeTab]}
              onPress={() => setActiveTab('past')}
            >
              <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText, isTablet && styles.tabTextTablet]}>
                Passés
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isTablet ? (
          <FlatList
            data={currentEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            numColumns={columns}
            key={columns}
            contentContainerStyle={[styles.gridContainer, { paddingHorizontal: spacing / 2 }]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, isTablet && styles.emptyStateTextTablet]}>
                  {activeTab === 'upcoming' 
                    ? 'Aucun événement à venir pour le moment'
                    : 'Aucun événement passé'
                  }
                </Text>
              </View>
            }
          />
        ) : (
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => handleEventPress(event.id)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {activeTab === 'upcoming' 
                    ? 'Aucun événement à venir pour le moment'
                    : 'Aucun événement passé'
                  }
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
  logoTablet: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  titleTablet: {
    fontSize: 28,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.grey,
    borderRadius: 25,
    padding: 4,
  },
  tabContainerTablet: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 21,
  },
  activeTab: {
    backgroundColor: colors.white,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textLight,
  },
  tabTextTablet: {
    fontSize: 18,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
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
  },
  emptyStateTextTablet: {
    fontSize: 22,
  },
  bottomPadding: {
    height: 20,
  },
});

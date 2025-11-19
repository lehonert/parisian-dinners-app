
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Redirect } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { colors, commonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import EventCard from '../../components/EventCard';
import { useResponsive } from '../../hooks/useResponsive';

export default function AdminScreen() {
  const { user } = useAuth();
  const { events, reviews, approveReview, deleteReview } = useData();
  const { isTablet, spacing } = useResponsive();
  const [activeTab, setActiveTab] = useState<'events' | 'reviews'>('events');

  if (!user?.isAdmin) {
    return <Redirect href="/(tabs)/events" />;
  }

  const pendingReviews = reviews.filter(r => r.status === 'pending');

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleCreateEvent = () => {
    router.push('/admin/create-event');
  };

  const handleEditEvent = (eventId: string) => {
    router.push(`/admin/edit-event/${eventId}`);
  };

  const handleApproveReview = async (reviewId: string, eventId: string) => {
    try {
      await approveReview(reviewId, eventId);
      Alert.alert('Succès', 'L\'avis a été approuvé');
    } catch (error) {
      console.log('Error approving review:', error);
      Alert.alert('Erreur', 'Impossible d\'approuver l\'avis');
    }
  };

  const handleDeleteReview = async (reviewId: string, eventId: string) => {
    Alert.alert(
      'Supprimer l\'avis',
      'Êtes-vous sûr de vouloir supprimer cet avis ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReview(reviewId, eventId);
              Alert.alert('Succès', 'L\'avis a été supprimé');
            } catch (error) {
              console.log('Error deleting review:', error);
              Alert.alert('Erreur', 'Impossible de supprimer l\'avis');
            }
          },
        },
      ]
    );
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={isTablet ? 18 : 16}
            color={star <= rating ? colors.primary : colors.textLight}
          />
        ))}
      </View>
    );
  };

  const contentMaxWidth = isTablet ? 1200 : undefined;

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={[styles.container, { paddingHorizontal: spacing }]}>
        <View style={[styles.header, isTablet && styles.headerTablet]}>
          <Text style={[styles.title, isTablet && styles.titleTablet]}>Administration</Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'events' && styles.activeTab, isTablet && styles.tabTablet]}
            onPress={() => setActiveTab('events')}
          >
            <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText, isTablet && styles.tabTextTablet]}>
              Événements ({events.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab, isTablet && styles.tabTablet]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText, isTablet && styles.tabTextTablet]}>
              Avis en attente ({pendingReviews.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={{ maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }}>
            {activeTab === 'events' ? (
              <View>
                <TouchableOpacity
                  style={[styles.createButton, isTablet && styles.createButtonTablet]}
                  onPress={handleCreateEvent}
                >
                  <Icon name="add-circle-outline" size={isTablet ? 24 : 20} color={colors.white} />
                  <Text style={[styles.createButtonText, isTablet && styles.createButtonTextTablet]}>
                    Créer un événement
                  </Text>
                </TouchableOpacity>

                <View style={styles.eventsGrid}>
                  {events.map((event) => (
                    <View key={event.id} style={[styles.eventItem, isTablet && styles.eventItemTablet]}>
                      <EventCard
                        event={event}
                        onPress={() => handleEventPress(event.id)}
                      />
                      <TouchableOpacity
                        style={[styles.editButton, isTablet && styles.editButtonTablet]}
                        onPress={() => handleEditEvent(event.id)}
                      >
                        <Icon name="create-outline" size={isTablet ? 20 : 18} color={colors.white} />
                        <Text style={[styles.editButtonText, isTablet && styles.editButtonTextTablet]}>Modifier</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                {events.length === 0 && (
                  <View style={styles.emptyState}>
                    <Icon name="calendar-outline" size={isTablet ? 64 : 48} color={colors.textLight} />
                    <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
                      Aucun événement créé
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View>
                {pendingReviews.map((review) => {
                  const event = events.find(e => e.id === review.eventId);
                  return (
                    <View key={review.id} style={[styles.reviewCard, isTablet && styles.reviewCardTablet]}>
                      <View style={styles.reviewHeader}>
                        <Text style={[styles.reviewEventTitle, isTablet && styles.reviewEventTitleTablet]}>
                          {event?.title || 'Événement inconnu'}
                        </Text>
                        {renderStars(review.rating)}
                      </View>
                      <Text style={[styles.reviewAuthor, isTablet && styles.reviewAuthorTablet]}>
                        Par {review.userName}
                      </Text>
                      <Text style={[styles.reviewComment, isTablet && styles.reviewCommentTablet]}>
                        {review.comment}
                      </Text>
                      <View style={styles.reviewActions}>
                        <TouchableOpacity
                          style={[styles.approveButton, isTablet && styles.approveButtonTablet]}
                          onPress={() => handleApproveReview(review.id, review.eventId)}
                        >
                          <Icon name="checkmark-circle-outline" size={isTablet ? 20 : 18} color={colors.white} />
                          <Text style={[styles.approveButtonText, isTablet && styles.approveButtonTextTablet]}>
                            Approuver
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.deleteButton, isTablet && styles.deleteButtonTablet]}
                          onPress={() => handleDeleteReview(review.id, review.eventId)}
                        >
                          <Icon name="trash-outline" size={isTablet ? 20 : 18} color={colors.white} />
                          <Text style={[styles.deleteButtonText, isTablet && styles.deleteButtonTextTablet]}>
                            Supprimer
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}

                {pendingReviews.length === 0 && (
                  <View style={styles.emptyState}>
                    <Icon name="chatbubbles-outline" size={isTablet ? 64 : 48} color={colors.textLight} />
                    <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
                      Aucun avis en attente
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
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
    paddingVertical: 20,
  },
  headerTablet: {
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  titleTablet: {
    fontSize: 36,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabTablet: {
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textLight,
  },
  tabTextTablet: {
    fontSize: 18,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  createButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  createButtonTablet: {
    paddingVertical: 16,
    borderRadius: 14,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonTextTablet: {
    fontSize: 18,
  },
  eventsGrid: {
    gap: 16,
  },
  eventItem: {
    marginBottom: 16,
  },
  eventItemTablet: {
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
  },
  editButtonTablet: {
    paddingVertical: 12,
    borderRadius: 10,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  editButtonTextTablet: {
    fontSize: 16,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewCardTablet: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  reviewEventTitleTablet: {
    fontSize: 18,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewAuthor: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  reviewAuthorTablet: {
    fontSize: 16,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  reviewCommentTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    flex: 1,
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  approveButtonTablet: {
    paddingVertical: 12,
    borderRadius: 10,
  },
  approveButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  approveButtonTextTablet: {
    fontSize: 16,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  deleteButtonTablet: {
    paddingVertical: 12,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButtonTextTablet: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 16,
  },
  emptyTextTablet: {
    fontSize: 18,
  },
});

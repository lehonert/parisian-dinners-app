
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import { mockEvents, mockReviews } from '../../data/mockData';
import EventCard from '../../components/EventCard';
import Icon from '../../components/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.white,
    marginTop: 12,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: 4,
  },
  eventsList: {
    paddingHorizontal: 20,
  },
  reviewsSection: {
    paddingHorizontal: 20,
  },
  reviewCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  reviewEvent: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pendingBadge: {
    backgroundColor: colors.warning + '20',
  },
  approvedBadge: {
    backgroundColor: colors.success + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pendingText: {
    color: colors.warning,
  },
  approvedText: {
    color: colors.success,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default function AdminScreen() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(mockReviews);

  // Redirect if not admin
  if (!user?.isAdmin) {
    return <Redirect href="/(tabs)/events" />;
  }

  const handleEventPress = (eventId: string) => {
    console.log('Opening event:', eventId);
    router.push(`/event/${eventId}`);
  };

  const handleCreateEvent = () => {
    console.log('Creating new event');
    router.push('/admin/create-event');
  };

  const handleEditEvent = (eventId: string) => {
    console.log('Editing event:', eventId);
    router.push(`/admin/edit-event/${eventId}`);
  };

  const handleApproveReview = (reviewId: string) => {
    console.log('Approving review:', reviewId);
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, status: 'approved' as const }
        : review
    ));
    Alert.alert('Succès', 'Avis approuvé avec succès');
  };

  const handleDeleteReview = (reviewId: string) => {
    console.log('Deleting review:', reviewId);
    Alert.alert(
      'Supprimer l\'avis',
      'Êtes-vous sûr de vouloir supprimer cet avis ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setReviews(prev => prev.filter(review => review.id !== reviewId));
          },
        },
      ]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={16}
        color={colors.warning}
      />
    ));
  };

  const pendingReviews = reviews.filter(review => review.status === 'pending');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Administration</Text>
        <Text style={styles.headerSubtitle}>Gérez les événements et les avis</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Événements</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleCreateEvent}>
              <Icon name="add" size={16} color={colors.white} />
              <Text style={styles.addButtonText}>Créer</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.eventsList}>
            {mockEvents.map((event) => (
              <View key={event.id} style={{ marginBottom: 16 }}>
                <EventCard
                  event={event}
                  onPress={() => handleEventPress(event.id)}
                />
                <TouchableOpacity
                  style={[styles.addButton, { marginTop: 8, alignSelf: 'flex-end' }]}
                  onPress={() => handleEditEvent(event.id)}
                >
                  <Icon name="create-outline" size={16} color={colors.white} />
                  <Text style={styles.addButtonText}>Modifier</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Avis en attente ({pendingReviews.length})
            </Text>
          </View>
          
          <View style={styles.reviewsSection}>
            {pendingReviews.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="checkmark-circle-outline" size={48} color={colors.textLight} />
                <Text style={styles.emptyText}>
                  Aucun avis en attente de modération
                </Text>
              </View>
            ) : (
              pendingReviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewUser}>{review.userName}</Text>
                      <Text style={styles.reviewEvent}>
                        Événement #{review.eventId}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      review.status === 'pending' ? styles.pendingBadge : styles.approvedBadge
                    ]}>
                      <Text style={[
                        styles.statusText,
                        review.status === 'pending' ? styles.pendingText : styles.approvedText
                      ]}>
                        {review.status === 'pending' ? 'En attente' : 'Approuvé'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.reviewRating}>
                    {renderStars(review.rating)}
                  </View>
                  
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  
                  {review.status === 'pending' && (
                    <View style={styles.reviewActions}>
                      <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => handleApproveReview(review.id)}
                      >
                        <Text style={styles.actionButtonText}>Approuver</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteReview(review.id)}
                      >
                        <Text style={styles.actionButtonText}>Supprimer</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </View>

        {/* All Reviews Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tous les avis</Text>
          </View>
          
          <View style={styles.reviewsSection}>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewUser}>{review.userName}</Text>
                    <Text style={styles.reviewEvent}>
                      Événement #{review.eventId}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    review.status === 'pending' ? styles.pendingBadge : styles.approvedBadge
                  ]}>
                    <Text style={[
                      styles.statusText,
                      review.status === 'pending' ? styles.pendingText : styles.approvedText
                    ]}>
                      {review.status === 'pending' ? 'En attente' : 'Approuvé'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.reviewRating}>
                  {renderStars(review.rating)}
                </View>
                
                <Text style={styles.reviewComment}>{review.comment}</Text>
                
                <View style={styles.reviewActions}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteReview(review.id)}
                  >
                    <Text style={styles.actionButtonText}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

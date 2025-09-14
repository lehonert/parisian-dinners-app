
import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { mockEvents, mockRegistrations, mockReviews, currentUser } from '../../data/mockData';
import Icon from '../../components/Icon';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isRegistered, setIsRegistered] = useState(
    mockRegistrations.some(reg => reg.eventId === id && reg.userId === currentUser.id)
  );

  const event = mockEvents.find(e => e.id === id);
  const eventReviews = mockReviews.filter(review => review.eventId === id && review.status === 'approved');

  if (!event) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.text}>Événement non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return `${price}€`;
  };

  const isEventFull = event.registeredCount >= event.capacity;
  const spotsLeft = event.capacity - event.registeredCount;
  const isPastEvent = event.date < new Date();

  const handleRegistration = () => {
    if (isRegistered) {
      Alert.alert(
        'Se désinscrire',
        'Êtes-vous sûr de vouloir vous désinscrire de cet événement ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Se désinscrire', 
            style: 'destructive',
            onPress: () => {
              setIsRegistered(false);
              console.log('User unregistered from event:', id);
            }
          },
        ]
      );
    } else {
      if (isEventFull) {
        Alert.alert(
          'Liste d\'attente',
          'Cet événement est complet. Souhaitez-vous rejoindre la liste d\'attente ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { 
              text: 'Rejoindre', 
              onPress: () => {
                console.log('User joined waitlist for event:', id);
                Alert.alert('Succès', 'Vous avez été ajouté à la liste d\'attente');
              }
            },
          ]
        );
      } else {
        setIsRegistered(true);
        console.log('User registered for event:', id);
        Alert.alert('Succès', 'Vous êtes maintenant inscrit à cet événement !');
      }
    }
  };

  const handleReview = () => {
    router.push(`/review/${id}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={colors.accent}
        />
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.image} />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.price}>{formatPrice(event.price)}</Text>
            </View>
            <Text style={styles.chef}>Chef {event.chef}</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Icon name="time-outline" size={20} color={colors.textLight} />
              <Text style={styles.infoText}>{formatDate(event.date)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="location-outline" size={20} color={colors.textLight} />
              <Text style={styles.infoText}>{event.location}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="people-outline" size={20} color={colors.textLight} />
              <Text style={styles.infoText}>
                {event.registeredCount}/{event.capacity} participants
                {spotsLeft > 0 && !isPastEvent && ` • ${spotsLeft} place${spotsLeft > 1 ? 's' : ''} restante${spotsLeft > 1 ? 's' : ''}`}
              </Text>
            </View>

            {event.ratingCount > 0 && (
              <View style={styles.infoRow}>
                <Icon name="star" size={20} color={colors.accent} />
                <Text style={styles.infoText}>
                  {event.ratingAvg.toFixed(1)} ({event.ratingCount} avis)
                </Text>
              </View>
            )}
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {eventReviews.length > 0 && (
            <View style={styles.reviewsSection}>
              <Text style={styles.sectionTitle}>Avis des participants</Text>
              {eventReviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUser}>
                      {review.userPhoto && (
                        <Image source={{ uri: review.userPhoto }} style={styles.reviewAvatar} />
                      )}
                      <Text style={styles.reviewUserName}>{review.userName}</Text>
                    </View>
                    <View style={styles.reviewRating}>
                      {renderStars(review.rating)}
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.actionSection}>
            {!isPastEvent ? (
              <TouchableOpacity 
                style={[
                  buttonStyles.primary, 
                  styles.actionButton,
                  isRegistered && styles.unregisterButton
                ]}
                onPress={handleRegistration}
              >
                <Text style={[styles.actionButtonText, isRegistered && styles.unregisterButtonText]}>
                  {isRegistered 
                    ? 'Se désinscrire' 
                    : isEventFull 
                      ? 'Rejoindre la liste d\'attente'
                      : 'S\'inscrire'
                  }
                </Text>
              </TouchableOpacity>
            ) : (
              isRegistered && (
                <TouchableOpacity 
                  style={[buttonStyles.primary, styles.actionButton]}
                  onPress={handleReview}
                >
                  <Text style={styles.actionButtonText}>Laisser un avis</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: colors.grey,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  chef: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textLight,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  reviewsSection: {
    marginBottom: 24,
  },
  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  actionSection: {
    paddingTop: 20,
  },
  actionButton: {
    paddingVertical: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  unregisterButton: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unregisterButtonText: {
    color: colors.text,
  },
});

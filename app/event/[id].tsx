
import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { useResponsive } from '../../hooks/useResponsive';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user, hasActiveSubscription } = useAuth();
  const { events, registerForEvent, unregisterFromEvent, getUserRegistrations, getEventReviews } = useData();
  const { isTablet, spacing } = useResponsive();
  
  const event = events.find(e => e.id === id);
  const userRegistrations = user ? getUserRegistrations(user.id) : [];
  const userRegistration = userRegistrations.find(r => r.eventId === id);
  const eventReviews = event ? getEventReviews(event.id) : [];
  
  const [isRegistering, setIsRegistering] = useState(false);

  if (!event) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={[styles.container, { paddingHorizontal: spacing }]}>
          <Text style={styles.errorText}>Événement non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)}€`;
  };

  const handleRegistration = async () => {
    if (!user) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour vous inscrire à un événement',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => router.push('/(auth)/login') },
        ]
      );
      return;
    }

    if (!hasActiveSubscription()) {
      Alert.alert(
        'Abonnement requis',
        'Vous devez avoir un abonnement actif pour vous inscrire aux événements',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'S\'abonner', onPress: () => router.push('/subscription') },
        ]
      );
      return;
    }

    setIsRegistering(true);

    try {
      if (userRegistration) {
        await unregisterFromEvent(event.id, user.id);
        Alert.alert('Succès', 'Vous êtes désinscrit de cet événement');
      } else {
        const isFull = event.registeredCount >= event.capacity;
        await registerForEvent(event.id, user.id);
        
        if (isFull) {
          Alert.alert(
            'Liste d\'attente',
            'L\'événement est complet. Vous avez été ajouté à la liste d\'attente.'
          );
        } else {
          Alert.alert('Succès', 'Vous êtes inscrit à cet événement !');
        }
      }
    } catch (error: any) {
      console.log('Registration error:', error);
      
      if (error.code === 'event/already-registered') {
        Alert.alert('Erreur', 'Vous êtes déjà inscrit à cet événement');
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleReview = () => {
    if (!user) {
      Alert.alert('Connexion requise', 'Vous devez être connecté pour laisser un avis');
      return;
    }

    if (!userRegistration) {
      Alert.alert('Inscription requise', 'Vous devez être inscrit à cet événement pour laisser un avis');
      return;
    }

    const eventDate = new Date(event.date);
    const now = new Date();

    if (eventDate > now) {
      Alert.alert('Événement à venir', 'Vous pourrez laisser un avis après l\'événement');
      return;
    }

    Alert.alert('Fonctionnalité à venir', 'La possibilité de laisser un avis sera bientôt disponible');
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={isTablet ? 20 : 18}
            color={star <= rating ? colors.primary : colors.textLight}
          />
        ))}
      </View>
    );
  };

  const handleSubscribe = () => {
    router.push('/subscription');
  };

  const remainingSpots = event.capacity - event.registeredCount;
  const isFull = remainingSpots <= 0;
  const isUpcoming = new Date(event.date) > new Date();

  const contentMaxWidth = isTablet ? 900 : undefined;

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: event.image }} style={styles.image} />
            <TouchableOpacity
              style={[styles.backButton, { top: spacing, left: spacing }]}
              onPress={() => router.back()}
            >
              <Icon name="arrow-back" size={isTablet ? 28 : 24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={[styles.content, { paddingHorizontal: spacing }]}>
            <View style={[styles.header, isTablet && styles.headerTablet]}>
              <Text style={[styles.title, isTablet && styles.titleTablet]}>{event.title}</Text>
              <View style={styles.ratingContainer}>
                {renderStars(Math.round(event.ratingAvg))}
                <Text style={[styles.ratingText, isTablet && styles.ratingTextTablet]}>
                  {event.ratingAvg.toFixed(1)} ({event.ratingCount})
                </Text>
              </View>
            </View>

            <View style={[styles.infoSection, isTablet && styles.infoSectionTablet]}>
              <View style={styles.infoRow}>
                <Icon name="person-outline" size={isTablet ? 22 : 20} color={colors.primary} />
                <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>Chef : {event.chef}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="calendar-outline" size={isTablet ? 22 : 20} color={colors.primary} />
                <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>{formatDate(event.date)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="location-outline" size={isTablet ? 22 : 20} color={colors.primary} />
                <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>{event.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="cash-outline" size={isTablet ? 22 : 20} color={colors.primary} />
                <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>{formatPrice(event.price)}</Text>
              </View>
            </View>

            <View style={[styles.capacitySection, isTablet && styles.capacitySectionTablet]}>
              <View style={styles.capacityRow}>
                <Text style={[styles.capacityLabel, isTablet && styles.capacityLabelTablet]}>Places disponibles :</Text>
                <Text style={[styles.capacityValue, isFull && styles.capacityFull, isTablet && styles.capacityValueTablet]}>
                  {isFull ? 'Complet' : `${remainingSpots} / ${event.capacity}`}
                </Text>
              </View>
              {event.waitlistCount > 0 && (
                <Text style={[styles.waitlistText, isTablet && styles.waitlistTextTablet]}>
                  {event.waitlistCount} personne(s) en liste d&apos;attente
                </Text>
              )}
            </View>

            <View style={[styles.descriptionSection, isTablet && styles.descriptionSectionTablet]}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>Description</Text>
              <Text style={[styles.description, isTablet && styles.descriptionTablet]}>{event.description}</Text>
            </View>

            {eventReviews.length > 0 && (
              <View style={[styles.reviewsSection, isTablet && styles.reviewsSectionTablet]}>
                <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                  Avis ({eventReviews.length})
                </Text>
                {eventReviews.map((review) => (
                  <View key={review.id} style={[styles.reviewCard, isTablet && styles.reviewCardTablet]}>
                    <View style={styles.reviewHeader}>
                      <Text style={[styles.reviewAuthor, isTablet && styles.reviewAuthorTablet]}>
                        {review.userName}
                      </Text>
                      {renderStars(review.rating)}
                    </View>
                    <Text style={[styles.reviewComment, isTablet && styles.reviewCommentTablet]}>
                      {review.comment}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {!hasActiveSubscription() && (
              <View style={[styles.subscriptionBanner, isTablet && styles.subscriptionBannerTablet]}>
                <Icon name="information-circle-outline" size={isTablet ? 28 : 24} color={colors.primary} />
                <View style={styles.subscriptionTextContainer}>
                  <Text style={[styles.subscriptionTitle, isTablet && styles.subscriptionTitleTablet]}>
                    Abonnement requis
                  </Text>
                  <Text style={[styles.subscriptionText, isTablet && styles.subscriptionTextTablet]}>
                    Souscrivez à un abonnement pour vous inscrire aux événements
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.subscribeButton, isTablet && styles.subscribeButtonTablet]}
                  onPress={handleSubscribe}
                >
                  <Text style={[styles.subscribeButtonText, isTablet && styles.subscribeButtonTextTablet]}>
                    S&apos;abonner
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {isUpcoming && (
              <TouchableOpacity
                style={[
                  buttonStyles.primary,
                  styles.registerButton,
                  userRegistration && styles.unregisterButton,
                  isRegistering && { opacity: 0.7 },
                  isTablet && styles.registerButtonTablet,
                ]}
                onPress={handleRegistration}
                disabled={isRegistering}
              >
                <Text style={[styles.registerButtonText, isTablet && styles.registerButtonTextTablet]}>
                  {isRegistering
                    ? 'Chargement...'
                    : userRegistration
                    ? 'Se désinscrire'
                    : isFull
                    ? 'Rejoindre la liste d\'attente'
                    : 'S\'inscrire'}
                </Text>
              </TouchableOpacity>
            )}

            {!isUpcoming && userRegistration && (
              <TouchableOpacity
                style={[buttonStyles.secondary, styles.reviewButton, isTablet && styles.reviewButtonTablet]}
                onPress={handleReview}
              >
                <Text style={[styles.reviewButtonText, isTablet && styles.reviewButtonTextTablet]}>
                  Laisser un avis
                </Text>
              </TouchableOpacity>
            )}

            <View style={{ height: 40 }} />
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
  },
  backButton: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTablet: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  titleTablet: {
    fontSize: 32,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: colors.textLight,
  },
  ratingTextTablet: {
    fontSize: 16,
  },
  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  infoSectionTablet: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  infoTextTablet: {
    fontSize: 18,
  },
  capacitySection: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  capacitySectionTablet: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  capacityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  capacityLabelTablet: {
    fontSize: 18,
  },
  capacityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.success,
  },
  capacityValueTablet: {
    fontSize: 18,
  },
  capacityFull: {
    color: colors.error,
  },
  waitlistText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
  },
  waitlistTextTablet: {
    fontSize: 16,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionSectionTablet: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  sectionTitleTablet: {
    fontSize: 24,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  descriptionTablet: {
    fontSize: 18,
    lineHeight: 28,
  },
  reviewsSection: {
    marginBottom: 20,
  },
  reviewsSectionTablet: {
    marginBottom: 24,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewCardTablet: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  reviewAuthorTablet: {
    fontSize: 18,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  reviewCommentTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
  subscriptionBanner: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subscriptionBannerTablet: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  subscriptionTextContainer: {
    flex: 1,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  subscriptionTitleTablet: {
    fontSize: 18,
  },
  subscriptionText: {
    fontSize: 14,
    color: colors.textLight,
  },
  subscriptionTextTablet: {
    fontSize: 16,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  subscribeButtonTablet: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  subscribeButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  subscribeButtonTextTablet: {
    fontSize: 16,
  },
  registerButton: {
    marginBottom: 12,
  },
  registerButtonTablet: {
    paddingVertical: 18,
  },
  unregisterButton: {
    backgroundColor: colors.error,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  registerButtonTextTablet: {
    fontSize: 18,
  },
  reviewButton: {
    marginBottom: 12,
  },
  reviewButtonTablet: {
    paddingVertical: 18,
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewButtonTextTablet: {
    fontSize: 18,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 40,
  },
});

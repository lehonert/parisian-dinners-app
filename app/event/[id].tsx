
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { mockEvents, mockRegistrations, mockReviews, currentUser } from '../../data/mockData';
import React, { useState } from 'react';
import Icon from '../../components/Icon';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user, hasActiveSubscription, getEventPrice } = useAuth();
  const { isTablet, spacing } = useResponsive();
  const [isRegistered, setIsRegistered] = useState(false);

  const event = mockEvents.find(e => e.id === id);
  const eventReviews = mockReviews.filter(r => r.eventId === id && r.status === 'approved');
  const userRegistration = mockRegistrations.find(r => r.eventId === id && r.userId === currentUser.id);

  React.useEffect(() => {
    setIsRegistered(!!userRegistration);
  }, [userRegistration]);

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Événement non trouvé</Text>
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

  const userPrice = getEventPrice(event.price);
  const isSubscriber = hasActiveSubscription();

  const handleRegistration = () => {
    if (!hasActiveSubscription()) {
      Alert.alert(
        'Abonnement requis',
        'Vous devez avoir un abonnement actif pour vous inscrire aux événements. Abonnez-vous pour seulement 197€/an et économisez 30€ sur chaque événement !',
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'S\'abonner',
            onPress: () => router.push('/subscription'),
          },
        ]
      );
      return;
    }

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
              Alert.alert('Succès', 'Vous êtes maintenant désinscrit de cet événement.');
            },
          },
        ]
      );
    } else {
      if (event.registeredCount >= event.capacity) {
        Alert.alert(
          'Liste d\'attente',
          'Cet événement est complet. Souhaitez-vous rejoindre la liste d\'attente ?',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Rejoindre',
              onPress: () => {
                setIsRegistered(true);
                Alert.alert('Succès', 'Vous avez été ajouté à la liste d\'attente.');
              },
            },
          ]
        );
      } else {
        setIsRegistered(true);
        Alert.alert('Succès', 'Vous êtes maintenant inscrit à cet événement !');
      }
    }
  };

  const handleReview = () => {
    Alert.alert('Avis', 'Fonctionnalité d\'avis en cours de développement.');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="star"
        size={isTablet ? 18 : 16}
        color={i < rating ? colors.primary : colors.border}
      />
    ));
  };

  const handleSubscribe = () => {
    router.push('/subscription');
  };

  const contentMaxWidth = isTablet ? 800 : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingHorizontal: spacing }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-left" size={isTablet ? 28 : 24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]} numberOfLines={1}>
          {event.title}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: event.image }} 
          style={[styles.eventImage, isTablet && styles.eventImageTablet]} 
        />
        
        <View style={[styles.content, { paddingHorizontal: spacing, maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}>
          <Text style={[styles.eventTitle, isTablet && styles.eventTitleTablet]}>
            {event.title}
          </Text>
          <Text style={[styles.chefName, isTablet && styles.chefNameTablet]}>
            Par {event.chef}
          </Text>

          {!hasActiveSubscription() && (
            <View style={[styles.subscriptionRequired, isTablet && styles.subscriptionRequiredTablet]}>
              <Text style={[styles.subscriptionTitle, isTablet && styles.subscriptionTitleTablet]}>
                Abonnement requis
              </Text>
              <Text style={[styles.subscriptionText, isTablet && styles.subscriptionTextTablet]}>
                Pour vous inscrire à cet événement, vous devez avoir un abonnement actif. 
                Abonnez-vous pour 197€/an et économisez 30€ sur chaque événement !
              </Text>
              <View style={styles.savingsExample}>
                <Text style={[styles.savingsExampleText, isTablet && styles.savingsExampleTextTablet]}>
                  Cet événement : {formatPrice(event.price)} → {formatPrice(userPrice)} avec l&apos;abonnement
                </Text>
              </View>
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={handleSubscribe}
              >
                <Text style={styles.subscribeButtonText}>
                  Découvrir l&apos;abonnement
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isSubscriber && (
            <View style={[styles.subscriberBadge, isTablet && styles.subscriberBadgeTablet]}>
              <Icon name="check-circle" size={isTablet ? 22 : 20} color={colors.primary} />
              <Text style={[styles.subscriberBadgeText, isTablet && styles.subscriberBadgeTextTablet]}>
                Vous économisez 30€ sur cet événement !
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Icon 
              name="calendar" 
              size={isTablet ? 24 : 20} 
              color={colors.textSecondary} 
              style={styles.infoIcon} 
            />
            <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>
              {formatDate(event.date)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon 
              name="map-pin" 
              size={isTablet ? 24 : 20} 
              color={colors.textSecondary} 
              style={styles.infoIcon} 
            />
            <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>
              {event.location}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon 
              name="users" 
              size={isTablet ? 24 : 20} 
              color={colors.textSecondary} 
              style={styles.infoIcon} 
            />
            <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>
              {event.registeredCount}/{event.capacity} participants
              {event.waitlistCount > 0 && ` • ${event.waitlistCount} en attente`}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Icon 
              name="credit-card" 
              size={isTablet ? 24 : 20} 
              color={colors.textSecondary} 
              style={styles.infoIcon} 
            />
            <View style={{ flex: 1 }}>
              {isSubscriber ? (
                <View>
                  <Text style={[styles.originalPrice, isTablet && styles.originalPriceTablet]}>
                    {formatPrice(event.price)}
                  </Text>
                  <Text style={[styles.discountedPrice, isTablet && styles.discountedPriceTablet]}>
                    {formatPrice(userPrice)} (prix abonné)
                  </Text>
                </View>
              ) : (
                <Text style={[styles.infoText, styles.priceText, isTablet && styles.priceTextTablet]}>
                  {formatPrice(event.price)}
                </Text>
              )}
            </View>
          </View>

          <Text style={[styles.description, isTablet && styles.descriptionTablet]}>
            {event.description}
          </Text>

          <View style={styles.ratingContainer}>
            <View style={{ flexDirection: 'row' }}>
              {renderStars(Math.round(event.ratingAvg))}
            </View>
            <Text style={[styles.ratingText, isTablet && styles.ratingTextTablet]}>
              {event.ratingAvg.toFixed(1)} ({event.ratingCount} avis)
            </Text>
          </View>

          {eventReviews.length > 0 && (
            <View style={styles.reviewsSection}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                Avis des participants
              </Text>
              {eventReviews.slice(0, 3).map((review) => (
                <View key={review.id} style={[styles.reviewItem, isTablet && styles.reviewItemTablet]}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ uri: review.userPhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }}
                      style={[styles.reviewAvatar, isTablet && styles.reviewAvatarTablet]}
                    />
                    <Text style={[styles.reviewerName, isTablet && styles.reviewerNameTablet]}>
                      {review.userName}
                    </Text>
                    <View style={styles.reviewRating}>
                      {renderStars(review.rating)}
                    </View>
                  </View>
                  <Text style={[styles.reviewComment, isTablet && styles.reviewCommentTablet]}>
                    {review.comment}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.actionButtons}>
            {hasActiveSubscription() ? (
              <>
                <TouchableOpacity
                  style={isRegistered ? styles.unregisterButton : styles.registerButton}
                  onPress={handleRegistration}
                >
                  <Text style={isRegistered ? styles.unregisterButtonText : styles.registerButtonText}>
                    {isRegistered ? 'Se désinscrire' : `S'inscrire - ${formatPrice(userPrice)}`}
                  </Text>
                </TouchableOpacity>

                {isRegistered && new Date() > event.date && (
                  <TouchableOpacity
                    style={styles.reviewButton}
                    onPress={handleReview}
                  >
                    <Text style={styles.reviewButtonText}>Laisser un avis</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={handleSubscribe}
              >
                <Text style={styles.subscribeButtonText}>
                  S&apos;abonner pour s&apos;inscrire
                </Text>
              </TouchableOpacity>
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  headerTitleTablet: {
    fontSize: 22,
  },
  eventImage: {
    width: '100%',
    height: 250,
  },
  eventImageTablet: {
    height: 400,
  },
  content: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  eventTitleTablet: {
    fontSize: 32,
  },
  chefName: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 16,
  },
  chefNameTablet: {
    fontSize: 20,
  },
  subscriberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  subscriberBadgeTablet: {
    padding: 14,
    borderRadius: 10,
  },
  subscriberBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  subscriberBadgeTextTablet: {
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  infoTextTablet: {
    fontSize: 18,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  originalPriceTablet: {
    fontSize: 16,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  discountedPriceTablet: {
    fontSize: 22,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  priceTextTablet: {
    fontSize: 22,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginVertical: 20,
  },
  descriptionTablet: {
    fontSize: 18,
    lineHeight: 28,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  ratingTextTablet: {
    fontSize: 18,
  },
  participantsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  sectionTitleTablet: {
    fontSize: 20,
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  reviewsSection: {
    marginBottom: 20,
  },
  reviewItem: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewItemTablet: {
    padding: 20,
    borderRadius: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  reviewAvatarTablet: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  reviewerNameTablet: {
    fontSize: 18,
  },
  reviewRating: {
    flexDirection: 'row',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  registerButton: {
    ...buttonStyles.primary,
    flex: 1,
  },
  registerButtonText: {
    ...buttonStyles.primaryText,
  },
  unregisterButton: {
    ...buttonStyles.secondary,
    flex: 1,
  },
  unregisterButtonText: {
    ...buttonStyles.secondaryText,
  },
  reviewButton: {
    ...buttonStyles.outline,
    flex: 1,
  },
  reviewButtonText: {
    ...buttonStyles.outlineText,
  },
  subscriptionRequired: {
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  subscriptionRequiredTablet: {
    padding: 20,
    borderRadius: 16,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  subscriptionTitleTablet: {
    fontSize: 20,
  },
  subscriptionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  subscriptionTextTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
  savingsExample: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  savingsExampleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  savingsExampleTextTablet: {
    fontSize: 16,
  },
  subscribeButton: {
    ...buttonStyles.primary,
    paddingVertical: 12,
  },
  subscribeButtonText: {
    ...buttonStyles.primaryText,
    fontSize: 14,
  },
});

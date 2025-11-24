
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useAuth } from '../contexts/AuthContext';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Icon from '../components/Icon';
import { router } from 'expo-router';
import { useResponsive } from '../hooks/useResponsive';

export default function SubscriptionScreen() {
  const { subscribeUser, hasActiveSubscription } = useAuth();
  const { isTablet, spacing } = useResponsive();
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    'Inscription illimitée aux événements',
    'Réduction de 30€ sur tous les événements',
    'Accès prioritaire aux nouveaux événements',
    'Support client prioritaire',
    'Événements exclusifs réservés aux abonnés',
    'Recettes exclusives des chefs partenaires',
    'Invitations aux événements spéciaux',
    'Annulation flexible',
  ];

  const benefits = [
    'Accès à tous les événements culinaires de Les Dîners Parisiens',
    'Économisez 30€ sur chaque événement (prix standard : 150€)',
    'Inscription prioritaire avant les non-abonnés',
    'Notifications exclusives pour les nouveaux événements',
    'Accès à la communauté privée des membres',
    'Invitations aux dégustations privées',
  ];

  const handleSubscribe = async () => {
    if (hasActiveSubscription()) {
      Alert.alert(
        'Abonnement actif',
        'Vous avez déjà un abonnement actif. Votre abonnement se renouvellera automatiquement chaque année.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);
    try {
      await subscribeUser();
      Alert.alert(
        'Abonnement activé !',
        'Félicitations ! Votre abonnement annuel a été activé avec succès. Vous bénéficiez maintenant d\'une réduction de 30€ sur tous les événements et votre abonnement se renouvellera automatiquement chaque année.',
        [
          {
            text: 'Découvrir les événements',
            onPress: () => router.replace('/(tabs)/events'),
          },
        ]
      );
    } catch (error) {
      console.log('Subscription error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'activation de votre abonnement.');
    } finally {
      setIsLoading(false);
    }
  };

  const contentMaxWidth = isTablet ? 900 : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingHorizontal: spacing }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-left" size={isTablet ? 28 : 24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>Abonnement</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[{ maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%', paddingHorizontal: spacing }]}>
          <View style={[styles.heroSection, isTablet && styles.heroSectionTablet]}>
            <Text style={[styles.heroTitle, isTablet && styles.heroTitleTablet]}>
              Rejoignez Les Dîners Parisiens
            </Text>
            <Text style={[styles.heroSubtitle, isTablet && styles.heroSubtitleTablet]}>
              Accédez à tous nos événements culinaires exclusifs avec une réduction de 30€ sur chaque événement
            </Text>
          </View>

          <View style={[styles.planCard, isTablet && styles.planCardTablet]}>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>Abonnement Annuel</Text>
            </View>
            
            <View style={styles.planHeader}>
              <View>
                <Text style={[styles.planPrice, isTablet && styles.planPriceTablet]}>197€</Text>
                <Text style={[styles.planPeriod, isTablet && styles.planPeriodTablet]}>/an</Text>
              </View>
              <View style={styles.savingsBox}>
                <Text style={[styles.savingsText, isTablet && styles.savingsTextTablet]}>
                  Économisez 30€ par événement
                </Text>
              </View>
            </View>
            
            <Text style={[styles.planDescription, isTablet && styles.planDescriptionTablet]}>
              Prélèvement automatique annuel • Annulation flexible
            </Text>
            
            <View style={styles.priceComparison}>
              <View style={styles.comparisonItem}>
                <Text style={[styles.comparisonLabel, isTablet && styles.comparisonLabelTablet]}>
                  Sans abonnement
                </Text>
                <Text style={[styles.comparisonPrice, styles.oldPrice, isTablet && styles.comparisonPriceTablet]}>
                  150€
                </Text>
              </View>
              <Icon name="arrow-right" size={isTablet ? 28 : 24} color={colors.primary} />
              <View style={styles.comparisonItem}>
                <Text style={[styles.comparisonLabel, isTablet && styles.comparisonLabelTablet]}>
                  Avec abonnement
                </Text>
                <Text style={[styles.comparisonPrice, styles.newPrice, isTablet && styles.comparisonPriceTablet]}>
                  120€
                </Text>
              </View>
            </View>

            <View style={styles.featuresContainer}>
              <Text style={[styles.featuresTitle, isTablet && styles.featuresTitleTablet]}>
                Avantages inclus :
              </Text>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon
                    name="check"
                    size={isTablet ? 18 : 16}
                    color={colors.primary}
                    style={styles.featureIcon}
                  />
                  <Text style={[styles.featureText, isTablet && styles.featureTextTablet]}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.benefitsSection, isTablet && styles.benefitsSectionTablet]}>
            <Text style={[styles.benefitsTitle, isTablet && styles.benefitsTitleTablet]}>
              Pourquoi s&apos;abonner ?
            </Text>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Icon
                  name="star"
                  size={isTablet ? 18 : 16}
                  color={colors.primary}
                  style={styles.benefitIcon}
                />
                <Text style={[styles.benefitText, isTablet && styles.benefitTextTablet]}>{benefit}</Text>
              </View>
            ))}
          </View>

          <View style={styles.calculationBox}>
            <Text style={[styles.calculationTitle, isTablet && styles.calculationTitleTablet]}>
              Rentabilisez votre abonnement
            </Text>
            <Text style={[styles.calculationText, isTablet && styles.calculationTextTablet]}>
              Avec seulement 7 événements par an, votre abonnement est rentabilisé !
            </Text>
            <Text style={[styles.calculationDetail, isTablet && styles.calculationDetailTablet]}>
              7 événements × 30€ d&apos;économie = 210€ économisés
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.subscribeButton, 
              isLoading && { opacity: 0.7 }, 
              isTablet && styles.subscribeButtonTablet,
              hasActiveSubscription() && styles.subscribeButtonDisabled
            ]}
            onPress={handleSubscribe}
            disabled={isLoading || hasActiveSubscription()}
          >
            <Text style={[styles.subscribeButtonText, isTablet && styles.subscribeButtonTextTablet]}>
              {isLoading 
                ? 'Activation en cours...' 
                : hasActiveSubscription() 
                  ? 'Abonnement actif' 
                  : 'S\'abonner - 197€/an'}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.disclaimer, isTablet && styles.disclaimerTablet]}>
            Renouvellement automatique annuel. Vous pouvez annuler à tout moment depuis votre profil.
          </Text>

          <View style={{ height: 40 }} />
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
  },
  headerTitleTablet: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  heroSectionTablet: {
    paddingVertical: 60,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroTitleTablet: {
    fontSize: 36,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  heroSubtitleTablet: {
    fontSize: 18,
    lineHeight: 28,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  planCardTablet: {
    borderRadius: 20,
    padding: 32,
    marginVertical: 30,
  },
  planBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  planBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  planPriceTablet: {
    fontSize: 44,
  },
  planPeriod: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  planPeriodTablet: {
    fontSize: 20,
  },
  savingsBox: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  savingsTextTablet: {
    fontSize: 16,
  },
  planDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  planDescriptionTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
  priceComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  comparisonLabelTablet: {
    fontSize: 14,
  },
  comparisonPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  comparisonPriceTablet: {
    fontSize: 24,
  },
  oldPrice: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  newPrice: {
    color: colors.primary,
  },
  featuresContainer: {
    marginTop: 10,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  featuresTitleTablet: {
    fontSize: 18,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  featureTextTablet: {
    fontSize: 16,
  },
  benefitsSection: {
    marginVertical: 30,
  },
  benefitsSectionTablet: {
    marginVertical: 40,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  benefitsTitleTablet: {
    fontSize: 24,
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  benefitIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  benefitText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  benefitTextTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
  calculationBox: {
    backgroundColor: colors.primaryLight,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  calculationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  calculationTitleTablet: {
    fontSize: 18,
  },
  calculationText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  calculationTextTablet: {
    fontSize: 16,
  },
  calculationDetail: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  calculationDetailTablet: {
    fontSize: 16,
  },
  subscribeButton: {
    ...buttonStyles.primary,
    marginTop: 20,
  },
  subscribeButtonTablet: {
    paddingVertical: 18,
    marginTop: 30,
  },
  subscribeButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  subscribeButtonText: {
    ...buttonStyles.primaryText,
  },
  subscribeButtonTextTablet: {
    fontSize: 18,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
  disclaimerTablet: {
    fontSize: 14,
    lineHeight: 20,
  },
});

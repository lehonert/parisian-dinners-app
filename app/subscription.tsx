
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useAuth } from '../contexts/AuthContext';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Icon from '../components/Icon';
import { router } from 'expo-router';
import { useResponsive } from '../hooks/useResponsive';

export default function SubscriptionScreen() {
  const { subscribeUser } = useAuth();
  const { isTablet, spacing } = useResponsive();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: 'monthly',
      name: 'Mensuel',
      price: '19,99€',
      period: '/mois',
      description: 'Accès complet à tous les événements culinaires',
      features: [
        'Inscription illimitée aux événements',
        'Accès prioritaire aux nouveaux événements',
        'Support client prioritaire',
        'Annulation flexible',
      ],
    },
    {
      id: 'yearly',
      name: 'Annuel',
      price: '199,99€',
      period: '/an',
      description: 'Économisez 17% avec l\'abonnement annuel',
      features: [
        'Inscription illimitée aux événements',
        'Accès prioritaire aux nouveaux événements',
        'Support client prioritaire',
        'Annulation flexible',
        'Événements exclusifs réservés aux abonnés annuels',
        'Réductions sur les événements premium',
      ],
    },
  ];

  const benefits = [
    'Accès à tous les événements culinaires de Les Dîners Parisiens',
    'Inscription prioritaire avant les non-abonnés',
    'Notifications exclusives pour les nouveaux événements',
    'Accès à la communauté privée des membres',
    'Recettes exclusives des chefs partenaires',
    'Invitations aux événements spéciaux et dégustations privées',
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await subscribeUser(selectedPlan);
      Alert.alert(
        'Abonnement activé !',
        'Félicitations ! Votre abonnement a été activé avec succès. Vous pouvez maintenant vous inscrire à tous nos événements.',
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
              Accédez à tous nos événements culinaires exclusifs et découvrez une communauté passionnée de gastronomie
            </Text>
          </View>

          <View style={[styles.plansContainer, isTablet && styles.plansContainerTablet]}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.selectedPlan,
                  isTablet && styles.planCardTablet,
                ]}
                onPress={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
              >
                <View style={styles.planHeader}>
                  <Text style={[styles.planName, isTablet && styles.planNameTablet]}>{plan.name}</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.planPrice, isTablet && styles.planPriceTablet]}>{plan.price}</Text>
                    <Text style={[styles.planPeriod, isTablet && styles.planPeriodTablet]}>{plan.period}</Text>
                  </View>
                </View>
                
                <Text style={[styles.planDescription, isTablet && styles.planDescriptionTablet]}>{plan.description}</Text>
                
                <View style={styles.featuresContainer}>
                  {plan.features.map((feature, index) => (
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
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.benefitsSection, isTablet && styles.benefitsSectionTablet]}>
            <Text style={[styles.benefitsTitle, isTablet && styles.benefitsTitleTablet]}>Avantages inclus</Text>
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

          <TouchableOpacity
            style={[styles.subscribeButton, isLoading && { opacity: 0.7 }, isTablet && styles.subscribeButtonTablet]}
            onPress={handleSubscribe}
            disabled={isLoading}
          >
            <Text style={[styles.subscribeButtonText, isTablet && styles.subscribeButtonTextTablet]}>
              {isLoading ? 'Activation en cours...' : `S'abonner - ${plans.find(p => p.id === selectedPlan)?.price}`}
            </Text>
          </TouchableOpacity>

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
  plansContainer: {
    marginVertical: 30,
  },
  plansContainerTablet: {
    marginVertical: 40,
    flexDirection: 'row',
    gap: 20,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  planCardTablet: {
    flex: 1,
    marginBottom: 0,
    borderRadius: 20,
    padding: 28,
  },
  selectedPlan: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  planNameTablet: {
    fontSize: 24,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  planPriceTablet: {
    fontSize: 28,
  },
  planPeriod: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  planPeriodTablet: {
    fontSize: 16,
  },
  planDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  planDescriptionTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  subscribeButton: {
    ...buttonStyles.primary,
    marginTop: 20,
  },
  subscribeButtonTablet: {
    paddingVertical: 18,
    marginTop: 30,
  },
  subscribeButtonText: {
    ...buttonStyles.primaryText,
  },
  subscribeButtonTextTablet: {
    fontSize: 18,
  },
});

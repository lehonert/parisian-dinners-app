
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useAuth } from '../contexts/AuthContext';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Icon from '../components/Icon';
import { router } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  plansContainer: {
    marginVertical: 30,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
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
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  planPeriod: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  planDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
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
  subscribeButton: {
    ...buttonStyles.primary,
    marginTop: 20,
  },
  subscribeButtonText: {
    ...buttonStyles.primaryText,
  },
  benefitsSection: {
    marginVertical: 30,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
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
});

export default function SubscriptionScreen() {
  const { subscribeUser } = useAuth();
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Abonnement</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Rejoignez Les Dîners Parisiens
          </Text>
          <Text style={styles.heroSubtitle}>
            Accédez à tous nos événements culinaires exclusifs et découvrez une communauté passionnée de gastronomie
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlan,
              ]}
              onPress={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
              </View>
              
              <Text style={styles.planDescription}>{plan.description}</Text>
              
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Icon
                      name="check"
                      size={16}
                      color={colors.primary}
                      style={styles.featureIcon}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Avantages inclus</Text>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Icon
                name="star"
                size={16}
                color={colors.primary}
                style={styles.benefitIcon}
              />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.subscribeButton, isLoading && { opacity: 0.7 }]}
          onPress={handleSubscribe}
          disabled={isLoading}
        >
          <Text style={styles.subscribeButtonText}>
            {isLoading ? 'Activation en cours...' : `S'abonner - ${plans.find(p => p.id === selectedPlan)?.price}`}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}


import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../contexts/AuthContext';
import React from 'react';
import Icon from '../../components/Icon';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subscriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionIcon: {
    marginRight: 12,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  subscriptionStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  activeStatus: {
    backgroundColor: colors.success + '20',
    color: colors.success,
  },
  inactiveStatus: {
    backgroundColor: colors.error + '20',
    color: colors.error,
  },
  subscriptionDetails: {
    marginBottom: 16,
  },
  subscriptionPlan: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  subscriptionDates: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  subscriptionPrice: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  subscriptionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  manageButton: {
    ...buttonStyles.outline,
    flex: 1,
    paddingVertical: 12,
  },
  manageButtonText: {
    ...buttonStyles.outlineText,
    fontSize: 14,
  },
  subscribeButton: {
    ...buttonStyles.primary,
    flex: 1,
    paddingVertical: 12,
  },
  subscribeButtonText: {
    ...buttonStyles.primaryText,
    fontSize: 14,
  },
  noSubscriptionCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  noSubscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  noSubscriptionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  menuSection: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  menuArrow: {
    marginLeft: 8,
  },
  signOutButton: {
    ...buttonStyles.secondary,
    marginTop: 20,
    marginBottom: 40,
  },
  signOutButtonText: {
    ...buttonStyles.secondaryText,
  },
});

export default function ProfileScreen() {
  const { user, signOut, hasActiveSubscription } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Modifier le profil', 'Fonctionnalité en cours de développement.');
  };

  const handleManageSubscription = () => {
    Alert.alert('Gérer l\'abonnement', 'Fonctionnalité en cours de développement.');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)}€`;
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Chargement...</Text>
      </SafeAreaView>
    );
  }

  const isSubscribed = hasActiveSubscription();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{
              uri: user.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
        </View>

        <View style={styles.content}>
          {/* Subscription Section */}
          {isSubscribed && user.subscription ? (
            <View style={styles.subscriptionCard}>
              <View style={styles.subscriptionHeader}>
                <Icon
                  name="star"
                  size={24}
                  color={colors.primary}
                  style={styles.subscriptionIcon}
                />
                <Text style={styles.subscriptionTitle}>Mon Abonnement</Text>
                <Text style={[styles.subscriptionStatus, styles.activeStatus]}>
                  ACTIF
                </Text>
              </View>
              
              <View style={styles.subscriptionDetails}>
                <Text style={styles.subscriptionPlan}>
                  Plan {user.subscription.plan === 'monthly' ? 'Mensuel' : 'Annuel'}
                </Text>
                <Text style={styles.subscriptionDates}>
                  Expire le {formatDate(new Date(user.subscription.endDate))}
                </Text>
                <Text style={styles.subscriptionPrice}>
                  {formatPrice(user.subscription.price)} / {user.subscription.plan === 'monthly' ? 'mois' : 'an'}
                </Text>
              </View>

              <View style={styles.subscriptionActions}>
                <TouchableOpacity
                  style={styles.manageButton}
                  onPress={handleManageSubscription}
                >
                  <Text style={styles.manageButtonText}>Gérer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.noSubscriptionCard}>
              <Text style={styles.noSubscriptionTitle}>
                Aucun abonnement actif
              </Text>
              <Text style={styles.noSubscriptionText}>
                Souscrivez à un abonnement pour accéder à tous nos événements culinaires exclusifs et rejoindre notre communauté passionnée.
              </Text>
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={() => router.push('/subscription')}
              >
                <Text style={styles.subscribeButtonText}>
                  Découvrir nos abonnements
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
              <Icon name="user" size={20} color={colors.textSecondary} style={styles.menuIcon} />
              <Text style={styles.menuText}>Modifier le profil</Text>
              <Icon name="chevron-right" size={16} color={colors.textSecondary} style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => router.push('/(tabs)/registrations')}
            >
              <Icon name="calendar" size={20} color={colors.textSecondary} style={styles.menuIcon} />
              <Text style={styles.menuText}>Mes inscriptions</Text>
              <Icon name="chevron-right" size={16} color={colors.textSecondary} style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Notifications', 'Fonctionnalité en cours de développement.')}>
              <Icon name="bell" size={20} color={colors.textSecondary} style={styles.menuIcon} />
              <Text style={styles.menuText}>Notifications</Text>
              <Icon name="chevron-right" size={16} color={colors.textSecondary} style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Paramètres', 'Fonctionnalité en cours de développement.')}>
              <Icon name="settings" size={20} color={colors.textSecondary} style={styles.menuIcon} />
              <Text style={styles.menuText}>Paramètres</Text>
              <Icon name="chevron-right" size={16} color={colors.textSecondary} style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Aide', 'Fonctionnalité en cours de développement.')}>
              <Icon name="help-circle" size={20} color={colors.textSecondary} style={styles.menuIcon} />
              <Text style={styles.menuText}>Aide et support</Text>
              <Icon name="chevron-right" size={16} color={colors.textSecondary} style={styles.menuArrow} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

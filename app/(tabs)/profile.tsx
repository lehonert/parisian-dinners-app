
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../contexts/AuthContext';
import React from 'react';
import Icon from '../../components/Icon';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useResponsive } from '../../hooks/useResponsive';

export default function ProfileScreen() {
  const { user, signOut, hasActiveSubscription } = useAuth();
  const { isTablet, spacing } = useResponsive();

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
    router.push('/profile/edit-profile');
  };

  const handleManageSubscription = () => {
    router.push('/subscription');
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
        <Text style={styles.loadingText}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  const isSubscribed = hasActiveSubscription();
  const contentMaxWidth = isTablet ? 800 : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingHorizontal: spacing }]}>
          <Image
            source={{
              uri: user.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            }}
            style={[styles.avatar, isTablet && styles.avatarTablet]}
          />
          <Text style={[styles.name, isTablet && styles.nameTablet]}>
            {user.name}
          </Text>
          <Text style={[styles.email, isTablet && styles.emailTablet]}>
            {user.email}
          </Text>
          {user.bio && (
            <Text style={[styles.bio, isTablet && styles.bioTablet]}>
              {user.bio}
            </Text>
          )}
        </View>

        <View style={[styles.content, { paddingHorizontal: spacing, maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}>
          {/* Subscription Section */}
          {isSubscribed && user.subscription ? (
            <View style={[styles.subscriptionCard, isTablet && styles.subscriptionCardTablet]}>
              <View style={styles.subscriptionHeader}>
                <Icon
                  name="star"
                  size={isTablet ? 28 : 24}
                  color={colors.primary}
                  style={styles.subscriptionIcon}
                />
                <Text style={[styles.subscriptionTitle, isTablet && styles.subscriptionTitleTablet]}>
                  Mon Abonnement
                </Text>
                <Text style={[styles.subscriptionStatus, styles.activeStatus, isTablet && styles.subscriptionStatusTablet]}>
                  ACTIF
                </Text>
              </View>
              
              <View style={styles.subscriptionDetails}>
                <Text style={[styles.subscriptionPlan, isTablet && styles.subscriptionPlanTablet]}>
                  Plan {user.subscription.plan === 'monthly' ? 'Mensuel' : 'Annuel'}
                </Text>
                <Text style={[styles.subscriptionDates, isTablet && styles.subscriptionDatesTablet]}>
                  Expire le {formatDate(new Date(user.subscription.endDate))}
                </Text>
                <Text style={[styles.subscriptionPrice, isTablet && styles.subscriptionPriceTablet]}>
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
            <View style={[styles.noSubscriptionCard, isTablet && styles.noSubscriptionCardTablet]}>
              <Text style={[styles.noSubscriptionTitle, isTablet && styles.noSubscriptionTitleTablet]}>
                Aucun abonnement actif
              </Text>
              <Text style={[styles.noSubscriptionText, isTablet && styles.noSubscriptionTextTablet]}>
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
            <TouchableOpacity 
              style={[styles.menuItem, isTablet && styles.menuItemTablet]} 
              onPress={handleEditProfile}
            >
              <Icon 
                name="person-circle-outline" 
                size={isTablet ? 24 : 20} 
                color={colors.textSecondary} 
                style={styles.menuIcon} 
              />
              <Text style={[styles.menuText, isTablet && styles.menuTextTablet]}>
                Modifier le profil
              </Text>
              <Icon 
                name="chevron-forward" 
                size={isTablet ? 20 : 16} 
                color={colors.textSecondary} 
                style={styles.menuArrow} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, isTablet && styles.menuItemTablet]} 
              onPress={() => router.push('/(tabs)/registrations')}
            >
              <Icon 
                name="calendar-outline" 
                size={isTablet ? 24 : 20} 
                color={colors.textSecondary} 
                style={styles.menuIcon} 
              />
              <Text style={[styles.menuText, isTablet && styles.menuTextTablet]}>
                Mes inscriptions
              </Text>
              <Icon 
                name="chevron-forward" 
                size={isTablet ? 20 : 16} 
                color={colors.textSecondary} 
                style={styles.menuArrow} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, isTablet && styles.menuItemTablet]} 
              onPress={() => router.push('/profile/notifications')}
            >
              <Icon 
                name="notifications-outline" 
                size={isTablet ? 24 : 20} 
                color={colors.textSecondary} 
                style={styles.menuIcon} 
              />
              <Text style={[styles.menuText, isTablet && styles.menuTextTablet]}>
                Notifications
              </Text>
              <Icon 
                name="chevron-forward" 
                size={isTablet ? 20 : 16} 
                color={colors.textSecondary} 
                style={styles.menuArrow} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, isTablet && styles.menuItemTablet]} 
              onPress={() => router.push('/profile/settings')}
            >
              <Icon 
                name="settings-outline" 
                size={isTablet ? 24 : 20} 
                color={colors.textSecondary} 
                style={styles.menuIcon} 
              />
              <Text style={[styles.menuText, isTablet && styles.menuTextTablet]}>
                Paramètres
              </Text>
              <Icon 
                name="chevron-forward" 
                size={isTablet ? 20 : 16} 
                color={colors.textSecondary} 
                style={styles.menuArrow} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, isTablet && styles.menuItemTablet]} 
              onPress={() => router.push('/profile/help-support')}
            >
              <Icon 
                name="help-circle-outline" 
                size={isTablet ? 24 : 20} 
                color={colors.textSecondary} 
                style={styles.menuIcon} 
              />
              <Text style={[styles.menuText, isTablet && styles.menuTextTablet]}>
                Aide et support
              </Text>
              <Icon 
                name="chevron-forward" 
                size={isTablet ? 20 : 16} 
                color={colors.textSecondary} 
                style={styles.menuArrow} 
              />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarTablet: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  nameTablet: {
    fontSize: 32,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emailTablet: {
    fontSize: 20,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  bioTablet: {
    fontSize: 18,
    lineHeight: 26,
  },
  content: {
    flex: 1,
  },
  subscriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subscriptionCardTablet: {
    padding: 24,
    borderRadius: 20,
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
  subscriptionTitleTablet: {
    fontSize: 22,
  },
  subscriptionStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  subscriptionStatusTablet: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
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
  subscriptionPlanTablet: {
    fontSize: 20,
  },
  subscriptionDates: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  subscriptionDatesTablet: {
    fontSize: 16,
  },
  subscriptionPrice: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  subscriptionPriceTablet: {
    fontSize: 16,
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
  noSubscriptionCardTablet: {
    padding: 24,
    borderRadius: 20,
  },
  noSubscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  noSubscriptionTitleTablet: {
    fontSize: 20,
  },
  noSubscriptionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  noSubscriptionTextTablet: {
    fontSize: 16,
    lineHeight: 24,
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
  menuItemTablet: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  menuTextTablet: {
    fontSize: 18,
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

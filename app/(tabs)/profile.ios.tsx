
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const theme = useTheme();
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <Text style={{ color: theme.colors.text }}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  const isSubscribed = hasActiveSubscription();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <GlassView style={styles.profileHeader} glassEffectStyle="regular">
          <Image
            source={{
              uri: user.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            }}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: theme.colors.text }]}>{user.name}</Text>
          <Text style={[styles.email, { color: theme.dark ? '#98989D' : '#666' }]}>{user.email}</Text>
          {user.bio && (
            <Text style={[styles.bio, { color: theme.colors.text }]}>{user.bio}</Text>
          )}
        </GlassView>

        {/* Subscription Section */}
        {isSubscribed && user.subscription ? (
          <GlassView style={styles.subscriptionCard} glassEffectStyle="regular">
            <View style={styles.subscriptionHeader}>
              <IconSymbol ios_icon_name="star.fill" android_material_icon_name="star" size={24} color={theme.colors.primary} />
              <Text style={[styles.subscriptionTitle, { color: theme.colors.text }]}>
                Mon Abonnement
              </Text>
              <View style={[styles.subscriptionStatus, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={[styles.subscriptionStatusText, { color: theme.colors.primary }]}>
                  ACTIF
                </Text>
              </View>
            </View>
            
            <View style={styles.subscriptionDetails}>
              <Text style={[styles.subscriptionPlan, { color: theme.colors.primary }]}>
                Plan {user.subscription.plan === 'monthly' ? 'Mensuel' : 'Annuel'}
              </Text>
              <Text style={[styles.subscriptionDates, { color: theme.dark ? '#98989D' : '#666' }]}>
                Expire le {formatDate(new Date(user.subscription.endDate))}
              </Text>
              <Text style={[styles.subscriptionPrice, { color: theme.dark ? '#98989D' : '#666' }]}>
                {formatPrice(user.subscription.price)} / {user.subscription.plan === 'monthly' ? 'mois' : 'an'}
              </Text>
            </View>
          </GlassView>
        ) : (
          <GlassView style={styles.noSubscriptionCard} glassEffectStyle="regular">
            <Text style={[styles.noSubscriptionTitle, { color: theme.colors.primary }]}>
              Aucun abonnement actif
            </Text>
            <Text style={[styles.noSubscriptionText, { color: theme.colors.text }]}>
              Souscrivez à un abonnement pour accéder à tous nos événements culinaires exclusifs.
            </Text>
            <TouchableOpacity
              style={[styles.subscribeButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => router.push('/subscription')}
            >
              <Text style={styles.subscribeButtonText}>
                Découvrir nos abonnements
              </Text>
            </TouchableOpacity>
          </GlassView>
        )}

        {/* Menu Items */}
        <GlassView style={styles.menuSection} glassEffectStyle="regular">
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/profile/edit-profile')}
          >
            <IconSymbol ios_icon_name="person.fill" android_material_icon_name="person" size={20} color={theme.dark ? '#98989D' : '#666'} />
            <Text style={[styles.menuText, { color: theme.colors.text }]}>
              Modifier le profil
            </Text>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={16} color={theme.dark ? '#98989D' : '#666'} />
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: theme.dark ? '#333' : '#E5E5EA' }]} />

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/(tabs)/registrations')}
          >
            <IconSymbol ios_icon_name="calendar" android_material_icon_name="calendar-today" size={20} color={theme.dark ? '#98989D' : '#666'} />
            <Text style={[styles.menuText, { color: theme.colors.text }]}>
              Mes inscriptions
            </Text>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={16} color={theme.dark ? '#98989D' : '#666'} />
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: theme.dark ? '#333' : '#E5E5EA' }]} />

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/profile/notifications')}
          >
            <IconSymbol ios_icon_name="bell.fill" android_material_icon_name="notifications" size={20} color={theme.dark ? '#98989D' : '#666'} />
            <Text style={[styles.menuText, { color: theme.colors.text }]}>
              Notifications
            </Text>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={16} color={theme.dark ? '#98989D' : '#666'} />
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: theme.dark ? '#333' : '#E5E5EA' }]} />

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/profile/settings')}
          >
            <IconSymbol ios_icon_name="gearshape.fill" android_material_icon_name="settings" size={20} color={theme.dark ? '#98989D' : '#666'} />
            <Text style={[styles.menuText, { color: theme.colors.text }]}>
              Paramètres
            </Text>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={16} color={theme.dark ? '#98989D' : '#666'} />
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: theme.dark ? '#333' : '#E5E5EA' }]} />

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/profile/help-support')}
          >
            <IconSymbol ios_icon_name="questionmark.circle.fill" android_material_icon_name="help" size={20} color={theme.dark ? '#98989D' : '#666'} />
            <Text style={[styles.menuText, { color: theme.colors.text }]}>
              Aide et support
            </Text>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={16} color={theme.dark ? '#98989D' : '#666'} />
          </TouchableOpacity>
        </GlassView>

        <TouchableOpacity 
          style={[styles.signOutButton, { backgroundColor: theme.colors.card }]} 
          onPress={handleSignOut}
        >
          <Text style={[styles.signOutButtonText, { color: '#FF3B30' }]}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 32,
    marginBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  subscriptionCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  subscriptionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subscriptionDetails: {
    gap: 4,
  },
  subscriptionPlan: {
    fontSize: 16,
    fontWeight: '600',
  },
  subscriptionDates: {
    fontSize: 14,
  },
  subscriptionPrice: {
    fontSize: 14,
  },
  noSubscriptionCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  noSubscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  noSubscriptionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  subscribeButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuSection: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  separator: {
    height: 1,
    marginLeft: 48,
  },
  signOutButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

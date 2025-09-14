
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/welcome');
          }
        },
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/(auth)/profile-setup');
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profil</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {user.photo ? (
                <Image source={{ uri: user.photo }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="person" size={40} color={colors.textLight} />
                </View>
              )}
            </View>
            
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            
            {user.bio && (
              <Text style={styles.bio}>{user.bio}</Text>
            )}

            {user.isAdmin && (
              <View style={styles.adminBadge}>
                <Icon name="shield-checkmark" size={16} color={colors.white} />
                <Text style={styles.adminText}>Administrateur</Text>
              </View>
            )}
          </View>

          <View style={styles.actionsSection}>
            <TouchableOpacity 
              style={[buttonStyles.secondary, styles.actionButton]}
              onPress={handleEditProfile}
            >
              <Icon name="create-outline" size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>Modifier le profil</Text>
            </TouchableOpacity>

            {user.isAdmin && (
              <TouchableOpacity 
                style={[buttonStyles.outline, styles.actionButton]}
                onPress={() => router.push('/admin')}
              >
                <Icon name="settings-outline" size={20} color={colors.text} />
                <Text style={styles.actionButtonTextOutline}>Administration</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.signOutButton]}
              onPress={handleSignOut}
            >
              <Icon name="log-out-outline" size={20} color={colors.error} />
              <Text style={styles.signOutText}>Se déconnecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  adminText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },
  actionsSection: {
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  actionButtonTextOutline: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
    marginTop: 20,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.error,
  },
});

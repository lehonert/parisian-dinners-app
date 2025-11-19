
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { useResponsive } from '../../hooks/useResponsive';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function NotificationsScreen() {
  const { isTablet, spacing } = useResponsive();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'new_events',
      title: 'Nouveaux événements',
      description: 'Recevez une notification lors de la création d\'un nouvel événement',
      enabled: true,
    },
    {
      id: 'event_reminders',
      title: 'Rappels d\'événements',
      description: 'Recevez un rappel 24h avant un événement auquel vous êtes inscrit',
      enabled: true,
    },
    {
      id: 'registration_confirmed',
      title: 'Confirmation d\'inscription',
      description: 'Recevez une notification lorsque votre inscription est confirmée',
      enabled: true,
    },
    {
      id: 'waitlist_updates',
      title: 'Mises à jour liste d\'attente',
      description: 'Recevez une notification si une place se libère',
      enabled: true,
    },
    {
      id: 'event_updates',
      title: 'Modifications d\'événements',
      description: 'Recevez une notification si un événement est modifié ou annulé',
      enabled: true,
    },
    {
      id: 'review_reminders',
      title: 'Rappels d\'avis',
      description: 'Recevez un rappel pour laisser un avis après un événement',
      enabled: false,
    },
    {
      id: 'subscription_updates',
      title: 'Abonnement',
      description: 'Recevez des notifications concernant votre abonnement',
      enabled: true,
    },
    {
      id: 'promotional',
      title: 'Offres promotionnelles',
      description: 'Recevez des offres spéciales et des promotions',
      enabled: false,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const handleSave = () => {
    console.log('Saving notification settings:', settings);
    Alert.alert(
      'Paramètres enregistrés',
      'Vos préférences de notifications ont été mises à jour.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const contentMaxWidth = isTablet ? 800 : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Notifications
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingHorizontal: spacing, maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Icon name="mail-outline" size={isTablet ? 28 : 24} color={colors.primary} style={styles.infoIcon} />
          <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>
            Gérez vos préférences de notifications pour rester informé des événements qui vous intéressent.
          </Text>
        </View>

        <View style={styles.settingsSection}>
          {settings.map((setting, index) => (
            <React.Fragment key={setting.id}>
              <View style={[styles.settingItem, isTablet && styles.settingItemTablet]}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, isTablet && styles.settingTitleTablet]}>
                    {setting.title}
                  </Text>
                  <Text style={[styles.settingDescription, isTablet && styles.settingDescriptionTablet]}>
                    {setting.description}
                  </Text>
                </View>
                <Switch
                  value={setting.enabled}
                  onValueChange={() => toggleSetting(setting.id)}
                  trackColor={{ false: colors.border, true: colors.primary + '80' }}
                  thumbColor={setting.enabled ? colors.primary : colors.surface}
                  ios_backgroundColor={colors.border}
                />
              </View>
              {index < settings.length - 1 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Enregistrer les préférences</Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  contentContainer: {
    paddingVertical: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  infoTextTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
  settingsSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingItemTablet: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingTitleTablet: {
    fontSize: 18,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  settingDescriptionTablet: {
    fontSize: 16,
    lineHeight: 22,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

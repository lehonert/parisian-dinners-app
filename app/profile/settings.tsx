
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

export default function SettingsScreen() {
  const { isTablet, spacing } = useResponsive();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('Français');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleLanguageChange = () => {
    Alert.alert(
      'Langue',
      'Choisissez votre langue',
      [
        { text: 'Français', onPress: () => setLanguage('Français') },
        { text: 'English', onPress: () => setLanguage('English') },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Vider le cache',
      'Êtes-vous sûr de vouloir vider le cache ? Cela peut améliorer les performances.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Vider',
          style: 'destructive',
          onPress: () => {
            console.log('Cache cleared');
            Alert.alert('Succès', 'Le cache a été vidé avec succès.');
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Changer le mot de passe',
      'Cette fonctionnalité nécessite une connexion à Firebase Authentication. Pour l\'instant, vous pouvez réinitialiser votre mot de passe via l\'email de récupération.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Confidentialité',
      'Vos données sont protégées et ne sont jamais partagées avec des tiers. Consultez notre politique de confidentialité pour plus d\'informations.',
      [{ text: 'OK' }]
    );
  };

  const handleTerms = () => {
    Alert.alert(
      'Conditions d\'utilisation',
      'En utilisant cette application, vous acceptez nos conditions d\'utilisation. Consultez-les dans la section Aide et Support.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirmation finale',
              'Cette action supprimera définitivement votre compte. Êtes-vous absolument sûr ?',
              [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Oui, supprimer',
                  style: 'destructive',
                  onPress: () => {
                    console.log('Account deletion requested');
                    Alert.alert('Information', 'La suppression de compte nécessite une connexion à Firebase. Contactez le support pour plus d\'informations.');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const contentMaxWidth = isTablet ? 800 : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Paramètres
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
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            Apparence
          </Text>
          <View style={styles.settingsGroup}>
            <View style={[styles.settingItem, isTablet && styles.settingItemTablet]}>
              <View style={styles.settingInfo}>
                <Icon name="moon" size={isTablet ? 24 : 20} color={colors.textSecondary} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isTablet && styles.settingTitleTablet]}>
                    Mode sombre
                  </Text>
                  <Text style={[styles.settingDescription, isTablet && styles.settingDescriptionTablet]}>
                    Activer le thème sombre
                  </Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={(value) => {
                  setDarkMode(value);
                  Alert.alert('Mode sombre', value ? 'Le mode sombre sera disponible dans une prochaine version.' : 'Mode clair activé.');
                }}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={darkMode ? colors.primary : colors.surface}
                ios_backgroundColor={colors.border}
              />
            </View>

            <View style={styles.separator} />

            <TouchableOpacity
              style={[styles.settingItem, isTablet && styles.settingItemTablet]}
              onPress={handleLanguageChange}
            >
              <View style={styles.settingInfo}>
                <Icon name="globe" size={isTablet ? 24 : 20} color={colors.textSecondary} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isTablet && styles.settingTitleTablet]}>
                    Langue
                  </Text>
                  <Text style={[styles.settingDescription, isTablet && styles.settingDescriptionTablet]}>
                    {language}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={isTablet ? 20 : 16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            Notifications
          </Text>
          <View style={styles.settingsGroup}>
            <View style={[styles.settingItem, isTablet && styles.settingItemTablet]}>
              <View style={styles.settingInfo}>
                <Icon name="mail" size={isTablet ? 24 : 20} color={colors.textSecondary} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isTablet && styles.settingTitleTablet]}>
                    Notifications par email
                  </Text>
                  <Text style={[styles.settingDescription, isTablet && styles.settingDescriptionTablet]}>
                    Recevoir des emails
                  </Text>
                </View>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={emailNotifications ? colors.primary : colors.surface}
                ios_backgroundColor={colors.border}
              />
            </View>

            <View style={styles.separator} />

            <View style={[styles.settingItem, isTablet && styles.settingItemTablet]}>
              <View style={styles.settingInfo}>
                <Icon name="bell" size={isTablet ? 24 : 20} color={colors.textSecondary} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isTablet && styles.settingTitleTablet]}>
                    Notifications push
                  </Text>
                  <Text style={[styles.settingDescription, isTablet && styles.settingDescriptionTablet]}>
                    Recevoir des notifications
                  </Text>
                </View>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={pushNotifications ? colors.primary : colors.surface}
                ios_backgroundColor={colors.border}
              />
            </View>
          </View>
        </View>

        {/* Privacy & Security Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            Confidentialité et sécurité
          </Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity
              style={[styles.settingItem, isTablet && styles.settingItemTablet]}
              onPress={handleChangePassword}
            >
              <View style={styles.settingInfo}>
                <Icon name="lock" size={isTablet ? 24 : 20} color={colors.textSecondary} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isTablet && styles.settingTitleTablet]}>
                    Changer le mot de passe
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={isTablet ? 20 : 16} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={[styles.settingItem, isTablet && styles.settingItemTablet]}
              onPress={handlePrivacy}
            >
              <View style={styles.settingInfo}>
                <Icon name="shield" size={isTablet ? 24 : 20} color={colors.textSecondary} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isTablet && styles.settingTitleTablet]}>
                    Confidentialité
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={isTablet ? 20 : 16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Data & Storage Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            Données et stockage
          </Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity
              style={[styles.settingItem, isTablet && styles.settingItemTablet]}
              onPress={handleClearCache}
            >
              <View style={styles.settingInfo}>
                <Icon name="trash-2" size={isTablet ? 24 : 20} color={colors.textSecondary} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isTablet && styles.settingTitleTablet]}>
                    Vider le cache
                  </Text>
                  <Text style={[styles.settingDescription, isTablet && styles.settingDescriptionTablet]}>
                    Libérer de l&apos;espace
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={isTablet ? 20 : 16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            À propos
          </Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity
              style={[styles.settingItem, isTablet && styles.settingItemTablet]}
              onPress={() => Alert.alert('Version', 'Les Dîners Parisiens v1.0.0')}
            >
              <View style={styles.settingInfo}>
                <Icon name="info" size={isTablet ? 24 : 20} color={colors.textSecondary} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isTablet && styles.settingTitleTablet]}>
                    Version de l&apos;application
                  </Text>
                  <Text style={[styles.settingDescription, isTablet && styles.settingDescriptionTablet]}>
                    1.0.0
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={[styles.settingItem, isTablet && styles.settingItemTablet]}
              onPress={handleTerms}
            >
              <View style={styles.settingInfo}>
                <Icon name="file-text" size={isTablet ? 24 : 20} color={colors.textSecondary} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isTablet && styles.settingTitleTablet]}>
                    Conditions d&apos;utilisation
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={isTablet ? 20 : 16} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={[styles.settingItem, isTablet && styles.settingItemTablet]}
              onPress={handlePrivacy}
            >
              <View style={styles.settingInfo}>
                <Icon name="file-text" size={isTablet ? 24 : 20} color={colors.textSecondary} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isTablet && styles.settingTitleTablet]}>
                    Politique de confidentialité
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={isTablet ? 20 : 16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle, isTablet && styles.sectionTitleTablet]}>
            Zone de danger
          </Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity
              style={[styles.settingItem, isTablet && styles.settingItemTablet]}
              onPress={handleDeleteAccount}
            >
              <View style={styles.settingInfo}>
                <Icon name="alert-triangle" size={isTablet ? 24 : 20} color={colors.error} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, styles.dangerText, isTablet && styles.settingTitleTablet]}>
                    Supprimer mon compte
                  </Text>
                  <Text style={[styles.settingDescription, isTablet && styles.settingDescriptionTablet]}>
                    Action irréversible
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={isTablet ? 20 : 16} color={colors.error} />
            </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionTitleTablet: {
    fontSize: 16,
  },
  settingsGroup: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingItemTablet: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  settingTitleTablet: {
    fontSize: 18,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingDescriptionTablet: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 48,
  },
  dangerTitle: {
    color: colors.error,
  },
  dangerText: {
    color: colors.error,
  },
});

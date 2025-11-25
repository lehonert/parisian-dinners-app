
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import { useResponsive } from '../../hooks/useResponsive';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const { isTablet, spacing } = useResponsive();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre adresse email');
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent to:', email);
      setEmailSent(true);
      Alert.alert(
        'Email envoyé',
        'Un email de réinitialisation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Une erreur est survenue';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Adresse email invalide';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte trouvé avec cet email';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
      }
      
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const contentMaxWidth = isTablet ? 600 : undefined;

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, { paddingHorizontal: spacing, maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}>
            {/* Logo and Title */}
            <View style={styles.logoContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop' }}
                style={[styles.logo, isTablet && styles.logoTablet]}
              />
              <Text style={[styles.title, isTablet && styles.titleTablet]}>
                Mot de passe oublié
              </Text>
              <Text style={[styles.subtitle, isTablet && styles.subtitleTablet]}>
                Entrez votre email pour recevoir un lien de réinitialisation
              </Text>
            </View>

            {/* Email Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={[commonStyles.label, isTablet && styles.labelTablet]}>Email</Text>
                <TextInput
                  style={[commonStyles.input, isTablet && styles.inputTablet]}
                  placeholder="votre@email.com"
                  placeholderTextColor={colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading && !emailSent}
                />
              </View>

              <TouchableOpacity
                style={[
                  buttonStyles.primary,
                  styles.button,
                  (isLoading || emailSent) && styles.buttonDisabled,
                  isTablet && styles.buttonTablet
                ]}
                onPress={handleResetPassword}
                disabled={isLoading || emailSent}
              >
                <Text style={[buttonStyles.primaryText, isTablet && styles.buttonTextTablet]}>
                  {isLoading ? 'Envoi en cours...' : emailSent ? 'Email envoyé' : 'Envoyer le lien'}
                </Text>
              </TouchableOpacity>

              {emailSent && (
                <View style={styles.successContainer}>
                  <Icon name="checkmark-circle" size={isTablet ? 28 : 24} color={colors.success} />
                  <Text style={[styles.successText, isTablet && styles.successTextTablet]}>
                    Email envoyé avec succès ! Vérifiez votre boîte de réception.
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                disabled={isLoading}
              >
                <Icon name="arrow-back" size={isTablet ? 20 : 16} color={colors.textSecondary} />
                <Text style={[styles.backButtonText, isTablet && styles.backButtonTextTablet]}>
                  Retour à la connexion
                </Text>
              </TouchableOpacity>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Icon name="information-circle-outline" size={isTablet ? 24 : 20} color={colors.primary} />
              <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>
                Vous recevrez un email avec un lien pour créer un nouveau mot de passe. 
                Le lien est valide pendant 1 heure.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 24,
  },
  logoTablet: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  titleTablet: {
    fontSize: 36,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subtitleTablet: {
    fontSize: 20,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputTablet: {
    fontSize: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  labelTablet: {
    fontSize: 16,
  },
  button: {
    marginTop: 8,
  },
  buttonTablet: {
    paddingVertical: 18,
  },
  buttonTextTablet: {
    fontSize: 18,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    gap: 12,
  },
  successText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  successTextTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  backButtonTextTablet: {
    fontSize: 16,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  infoTextTablet: {
    fontSize: 15,
    lineHeight: 22,
  },
});

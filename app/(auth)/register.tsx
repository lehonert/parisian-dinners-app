
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import { useResponsive } from '../../hooks/useResponsive';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();
  const router = useRouter();
  const { isTablet, spacing } = useResponsive();

  // Redirect when user is authenticated
  useEffect(() => {
    console.log('RegisterScreen: User state changed:', user?.email);
    if (user) {
      console.log('RegisterScreen: User authenticated, redirecting to profile setup');
      // After registration, always go to profile setup
      router.replace('/(auth)/profile-setup');
    }
  }, [user]);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    try {
      console.log('RegisterScreen: Attempting registration for:', email);
      await signUp(email, password, name);
      console.log('RegisterScreen: Registration successful');
      // Navigation will be handled by useEffect when user state updates
    } catch (error: any) {
      console.error('RegisterScreen: Registration error:', error);
      Alert.alert('Erreur d\'inscription', error.message || 'Une erreur est survenue');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    Alert.alert(
      'Inscription avec Google',
      'L\'inscription avec Google sera bientôt disponible. Pour le moment, veuillez utiliser votre email et mot de passe.',
      [{ text: 'OK' }]
    );
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
                source={require('../../assets/images/8a1bc83c-cbbc-4d4c-9c70-01cd7f76a731.jpeg')}
                style={[styles.logo, isTablet && styles.logoTablet]}
                resizeMode="contain"
              />
              <Text style={[styles.title, isTablet && styles.titleTablet]}>Les Dîners Parisiens</Text>
              <Text style={[styles.subtitle, isTablet && styles.subtitleTablet]}>
                Inscription
              </Text>
            </View>

            {/* Google Sign In Button */}
            <TouchableOpacity
              style={[styles.googleButton, isTablet && styles.googleButtonTablet]}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Icon name="logo-google" size={isTablet ? 24 : 20} color="#DB4437" />
              <Text style={[styles.googleButtonText, isTablet && styles.googleButtonTextTablet]}>
                S&apos;inscrire avec Google
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={[styles.dividerText, isTablet && styles.dividerTextTablet]}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email/Password Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={[commonStyles.label, isTablet && styles.labelTablet]}>Nom complet</Text>
                <TextInput
                  style={[commonStyles.input, isTablet && styles.inputTablet]}
                  placeholder="Jean Dupont"
                  placeholderTextColor={colors.textLight}
                  value={name}
                  onChangeText={setName}
                  editable={!isLoading}
                />
              </View>

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
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[commonStyles.label, isTablet && styles.labelTablet]}>Mot de passe</Text>
                <TextInput
                  style={[commonStyles.input, isTablet && styles.inputTablet]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[commonStyles.label, isTablet && styles.labelTablet]}>Confirmer le mot de passe</Text>
                <TextInput
                  style={[commonStyles.input, isTablet && styles.inputTablet]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textLight}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity
                style={[buttonStyles.primary, styles.button, isLoading && styles.buttonDisabled, isTablet && styles.buttonTablet]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text style={[buttonStyles.primaryText, isTablet && styles.buttonTextTablet]}>
                  {isLoading ? 'Inscription...' : 'S\'inscrire'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[buttonStyles.outline, styles.button, isTablet && styles.buttonTablet]}
                onPress={() => router.push('/(auth)/login')}
                disabled={isLoading}
              >
                <Text style={[buttonStyles.outlineText, isTablet && styles.buttonTextTablet]}>
                  J&apos;ai déjà un compte
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                disabled={isLoading}
              >
                <Icon name="arrow-back" size={isTablet ? 20 : 16} color={colors.textSecondary} />
                <Text style={[styles.backButtonText, isTablet && styles.backButtonTextTablet]}>
                  Retour
                </Text>
              </TouchableOpacity>
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
    marginBottom: 20,
  },
  logoTablet: {
    width: 140,
    height: 140,
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  titleTablet: {
    fontSize: 32,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  subtitleTablet: {
    fontSize: 22,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  googleButtonTablet: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  googleButtonTextTablet: {
    fontSize: 18,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  dividerTextTablet: {
    fontSize: 16,
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
});

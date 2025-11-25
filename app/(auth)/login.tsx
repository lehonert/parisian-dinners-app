
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import { useResponsive } from '../../hooks/useResponsive';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const { isTablet, spacing } = useResponsive();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      console.log('Login successful, navigating to home');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Erreur de connexion', error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    Alert.alert(
      'Connexion avec Google',
      'La connexion avec Google sera bientôt disponible. Pour le moment, veuillez utiliser votre email et mot de passe.',
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
                source={{ uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop' }}
                style={[styles.logo, isTablet && styles.logoTablet]}
              />
              <Text style={[styles.title, isTablet && styles.titleTablet]}>Connexion</Text>
              <Text style={[styles.subtitle, isTablet && styles.subtitleTablet]}>
                Bienvenue aux Dîners Parisiens
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
                Se connecter avec Google
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

              <TouchableOpacity
                style={[buttonStyles.primary, styles.button, isLoading && styles.buttonDisabled, isTablet && styles.buttonTablet]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={[buttonStyles.primaryText, isTablet && styles.buttonTextTablet]}>
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[buttonStyles.outline, styles.button, isTablet && styles.buttonTablet]}
                onPress={() => router.push('/(auth)/register')}
                disabled={isLoading}
              >
                <Text style={[buttonStyles.outlineText, isTablet && styles.buttonTextTablet]}>
                  Créer un compte
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
  },
  subtitleTablet: {
    fontSize: 20,
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

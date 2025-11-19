
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useResponsive } from '../../hooks/useResponsive';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../config/firebase';

// Required for Google Sign-In to work properly
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signIn, isLoading } = useAuth();
  const { isTablet, spacing } = useResponsive();

  const handleLogin = async () => {
    console.log('Login button pressed');
    
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      console.log('Attempting login...');
      await signIn(email.trim(), password);
      console.log('Login successful, navigating to events...');
      router.replace('/(tabs)/events');
    } catch (error: any) {
      console.error('Login error in component:', error);
      Alert.alert('Erreur de connexion', error.message || 'Email ou mot de passe incorrect');
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Google login button pressed');
    setIsGoogleLoading(true);

    try {
      if (Platform.OS === 'web') {
        // Web: Use popup-based authentication
        console.log('Using web popup authentication');
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        
        try {
          const result = await signInWithPopup(auth, provider);
          console.log('Google sign-in successful:', result.user.email);
          
          // Navigate to events page
          router.replace('/(tabs)/events');
        } catch (popupError: any) {
          console.error('Popup error:', popupError);
          throw popupError;
        }
      } else {
        // Mobile: Show instructions for now
        Alert.alert(
          'Connexion Google',
          'Pour activer la connexion Google sur mobile:\n\n' +
          '1. Configurez OAuth 2.0 dans Google Cloud Console\n' +
          '2. Ajoutez les SHA-1/SHA-256 de votre app\n' +
          '3. Installez @react-native-google-signin/google-signin\n\n' +
          'Pour le moment, veuillez utiliser l\'authentification par email.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      let errorMessage = 'Une erreur est survenue lors de la connexion avec Google';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Connexion annulée';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'La fenêtre de connexion a été bloquée. Veuillez autoriser les popups pour ce site.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Connexion annulée';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erreur de connexion réseau. Vérifiez votre connexion internet.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Erreur de connexion Google', errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  const contentMaxWidth = isTablet ? 600 : undefined;

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingHorizontal: spacing }}>
        <View style={[styles.header, isTablet && styles.headerTablet]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={isTablet ? 28 : 24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, isTablet && styles.titleTablet]}>Connexion</Text>
        </View>

        <View style={[styles.form, { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Email</Text>
            <TextInput
              style={[styles.input, isTablet && styles.inputTablet]}
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              placeholderTextColor={colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput, isTablet && styles.inputTablet]}
                value={password}
                onChangeText={setPassword}
                placeholder="Votre mot de passe"
                placeholderTextColor={colors.textLight}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={isTablet ? 22 : 20} 
                  color={colors.textLight} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[buttonStyles.primary, styles.loginButton, isTablet && styles.loginButtonTablet]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={[styles.dividerText, isTablet && styles.dividerTextTablet]}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={[buttonStyles.outline, styles.googleButton, isTablet && styles.googleButtonTablet]}
            onPress={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <Icon name="logo-google" size={isTablet ? 22 : 20} color={colors.text} />
                <Text style={[styles.googleButtonText, isTablet && styles.googleButtonTextTablet]}>
                  Continuer avec Google
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.footer, isTablet && styles.footerTablet]}>
          <Text style={[styles.footerText, isTablet && styles.footerTextTablet]}>
            Pas encore de compte ?{' '}
            <Text 
              style={styles.linkText}
              onPress={() => router.push('/(auth)/register')}
            >
              Créer un compte
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerTablet: {
    paddingVertical: 30,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  titleTablet: {
    fontSize: 32,
  },
  form: {
    flex: 1,
    paddingTop: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  labelTablet: {
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.text,
  },
  inputTablet: {
    fontSize: 18,
    paddingVertical: 14,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
  loginButton: {
    marginTop: 20,
    paddingVertical: 16,
  },
  loginButtonTablet: {
    paddingVertical: 18,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  buttonTextTablet: {
    fontSize: 18,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.textLight,
  },
  dividerTextTablet: {
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  googleButtonTablet: {
    paddingVertical: 18,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  googleButtonTextTablet: {
    fontSize: 18,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerTablet: {
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: colors.textLight,
  },
  footerTextTablet: {
    fontSize: 16,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '500',
  },
});

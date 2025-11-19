
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

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signUp, isLoading } = useAuth();
  const { isTablet, spacing } = useResponsive();

  const handleRegister = async () => {
    console.log('Register button pressed');
    
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

    try {
      console.log('Attempting registration...');
      await signUp(email.trim(), password, name.trim());
      console.log('Registration successful, navigating to events...');
      // Navigation will be handled by the index.tsx redirect
    } catch (error: any) {
      console.error('Registration error in component:', error);
      Alert.alert('Erreur d\'inscription', error.message || 'Une erreur est survenue');
    }
  };

  const handleGoogleRegister = async () => {
    console.log('Google register button pressed');
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
          
          // Navigation will be handled by the index.tsx redirect
        } catch (popupError: any) {
          console.error('Popup error:', popupError);
          
          // If popup is blocked, show a helpful message
          if (popupError.code === 'auth/popup-blocked') {
            Alert.alert(
              'Popup bloqué',
              'Votre navigateur a bloqué la fenêtre d\'inscription. Veuillez autoriser les popups pour ce site et réessayer.',
              [{ text: 'OK' }]
            );
          } else if (popupError.code !== 'auth/popup-closed-by-user' && popupError.code !== 'auth/cancelled-popup-request') {
            throw popupError;
          }
        }
      } else {
        // Mobile: Show instructions for now
        Alert.alert(
          'Inscription avec Google',
          'L\'inscription avec Google sur mobile nécessite une configuration supplémentaire:\n\n' +
          '1. Configurez OAuth 2.0 dans Google Cloud Console\n' +
          '2. Ajoutez les SHA-1/SHA-256 de votre app Android\n' +
          '3. Configurez le Bundle ID pour iOS\n' +
          '4. Installez @react-native-google-signin/google-signin\n\n' +
          'Pour le moment, veuillez utiliser l\'inscription par email.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      let errorMessage = 'Une erreur est survenue lors de l\'inscription avec Google';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Inscription annulée';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'La fenêtre d\'inscription a été bloquée. Veuillez autoriser les popups pour ce site.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Inscription annulée';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erreur de connexion réseau. Vérifiez votre connexion internet.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'Ce domaine n\'est pas autorisé. Veuillez ajouter ce domaine dans la console Firebase.';
      } else if (error.message && error.code !== 'auth/popup-closed-by-user') {
        errorMessage = error.message;
      }
      
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        Alert.alert('Erreur d\'inscription Google', errorMessage);
      }
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
          <Text style={[styles.title, isTablet && styles.titleTablet]}>Créer un compte</Text>
        </View>

        <View style={[styles.form, { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Nom complet</Text>
            <TextInput
              style={[styles.input, isTablet && styles.inputTablet]}
              value={name}
              onChangeText={setName}
              placeholder="Jean Dupont"
              placeholderTextColor={colors.textLight}
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

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
                placeholder="Au moins 6 caractères"
                placeholderTextColor={colors.textLight}
                secureTextEntry={!showPassword}
                autoComplete="password-new"
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

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Confirmer le mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput, isTablet && styles.inputTablet]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Retapez votre mot de passe"
                placeholderTextColor={colors.textLight}
                secureTextEntry={!showConfirmPassword}
                autoComplete="password-new"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Icon 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={isTablet ? 22 : 20} 
                  color={colors.textLight} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[buttonStyles.primary, styles.registerButton, isTablet && styles.registerButtonTablet]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={[styles.dividerText, isTablet && styles.dividerTextTablet]}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={[buttonStyles.outline, styles.googleButton, isTablet && styles.googleButtonTablet]}
            onPress={handleGoogleRegister}
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <Icon name="logo-google" size={isTablet ? 22 : 20} color={colors.text} />
                <Text style={[styles.googleButtonText, isTablet && styles.googleButtonTextTablet]}>
                  S&apos;inscrire avec Google
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.footer, isTablet && styles.footerTablet]}>
          <Text style={[styles.footerText, isTablet && styles.footerTextTablet]}>
            Déjà un compte ?{' '}
            <Text 
              style={styles.linkText}
              onPress={() => router.push('/(auth)/login')}
            >
              Se connecter
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
  registerButton: {
    marginTop: 20,
    paddingVertical: 16,
  },
  registerButtonTablet: {
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

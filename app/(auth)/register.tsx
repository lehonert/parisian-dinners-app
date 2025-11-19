
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../contexts/AuthContext';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import LoadingSpinner from '../../components/LoadingSpinner';
import React, { useState } from 'react';
import Icon from '../../components/Icon';
import { router } from 'expo-router';
import { useResponsive } from '../../hooks/useResponsive';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, isLoading } = useAuth();
  const { isTablet, spacing } = useResponsive();

  const handleRegister = async () => {
    console.log('Register button pressed');
    
    // Validation
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom.');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre email.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un mot de passe.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    try {
      console.log('Calling signUp function...');
      await signUp(email.trim(), password, name.trim());
      
      console.log('Sign up successful, showing alert...');
      Alert.alert(
        'Inscription réussie !',
        'Votre compte a été créé avec succès. Pour accéder aux événements, vous devez souscrire à un abonnement.',
        [
          {
            text: 'Découvrir les abonnements',
            onPress: () => {
              console.log('Navigating to subscription page...');
              router.replace('/subscription');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Registration error in component:', error);
      Alert.alert('Erreur d\'inscription', error.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const handleGoogleRegister = () => {
    console.log('Google register button pressed');
    Alert.alert(
      'Connexion Google',
      'La connexion avec Google n\'est pas encore disponible. Cette fonctionnalité sera ajoutée prochainement.\n\nPour le moment, veuillez créer un compte avec votre email.',
      [{ text: 'OK' }]
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const contentMaxWidth = isTablet ? 600 : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: spacing }}>
        <View style={[styles.header, isTablet && styles.headerTablet]}>
          <Text style={[styles.title, isTablet && styles.titleTablet]}>Créer un compte</Text>
          <Text style={[styles.subtitle, isTablet && styles.subtitleTablet]}>
            Rejoignez la communauté des Dîners Parisiens
          </Text>
        </View>

        <View style={[styles.form, { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Nom complet</Text>
            <TextInput
              style={[styles.input, isTablet && styles.inputTablet]}
              value={name}
              onChangeText={setName}
              placeholder="Votre nom complet"
              placeholderTextColor={colors.textLight}
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

          <View style={styles.inputGroup}>
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

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput, isTablet && styles.inputTablet]}
                value={password}
                onChangeText={setPassword}
                placeholder="Minimum 6 caractères"
                placeholderTextColor={colors.textLight}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
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

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Confirmer le mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput, isTablet && styles.inputTablet]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirmez votre mot de passe"
                placeholderTextColor={colors.textLight}
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
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
            style={[styles.registerButton, isTablet && styles.registerButtonTablet]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={[styles.registerButtonText, isTablet && styles.registerButtonTextTablet]}>
              {isLoading ? 'Création en cours...' : 'Créer mon compte'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={[styles.dividerText, isTablet && styles.dividerTextTablet]}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={[styles.googleButton, isTablet && styles.googleButtonTablet]} 
            onPress={handleGoogleRegister}
            disabled={isLoading}
          >
            <Icon name="logo-google" size={isTablet ? 22 : 20} color={colors.text} />
            <Text style={[styles.googleButtonText, isTablet && styles.googleButtonTextTablet]}>
              Continuer avec Google
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.footer, isTablet && styles.footerTablet]}>
          <Text style={[styles.footerText, isTablet && styles.footerTextTablet]}>
            Vous avez déjà un compte ?{' '}
            <Text style={styles.loginLink} onPress={() => router.replace('/(auth)/login')}>
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
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  headerTablet: {
    paddingVertical: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
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
    fontSize: 18,
  },
  form: {
    flex: 1,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
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
    color: colors.text,
    backgroundColor: colors.white,
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
    ...buttonStyles.primary,
    marginTop: 20,
    paddingVertical: 16,
  },
  registerButtonTablet: {
    marginTop: 30,
    paddingVertical: 18,
  },
  registerButtonText: {
    ...buttonStyles.primaryText,
  },
  registerButtonTextTablet: {
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
    color: colors.textSecondary,
  },
  dividerTextTablet: {
    fontSize: 16,
  },
  googleButton: {
    ...buttonStyles.secondary,
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
    ...buttonStyles.secondaryText,
    marginLeft: 0,
  },
  googleButtonTextTablet: {
    fontSize: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerTablet: {
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerTextTablet: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

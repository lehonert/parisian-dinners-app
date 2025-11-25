
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function TestFirebaseAuthScreen() {
  const { user, isLoading, signIn, signUp, signOut } = useAuth();
  const router = useRouter();
  
  // Test credentials
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('test123456');
  const [testName, setTestName] = useState('Test User');
  
  // Status messages
  const [statusMessage, setStatusMessage] = useState('');
  const [isTestRunning, setIsTestRunning] = useState(false);

  const showStatus = (message: string, isError = false) => {
    console.log(isError ? 'ERROR:' : 'SUCCESS:', message);
    setStatusMessage(message);
    if (isError) {
      Alert.alert('Erreur', message);
    }
  };

  const testSignUp = async () => {
    setIsTestRunning(true);
    showStatus('Test d\'inscription en cours...');
    
    try {
      await signUp(testEmail, testPassword, testName);
      showStatus('✅ Inscription réussie! Utilisateur créé dans Firebase Auth et Firestore.');
    } catch (error: any) {
      showStatus(`❌ Erreur d'inscription: ${error.message}`, true);
    } finally {
      setIsTestRunning(false);
    }
  };

  const testSignIn = async () => {
    setIsTestRunning(true);
    showStatus('Test de connexion en cours...');
    
    try {
      await signIn(testEmail, testPassword);
      showStatus('✅ Connexion réussie! Utilisateur authentifié avec Firebase.');
    } catch (error: any) {
      showStatus(`❌ Erreur de connexion: ${error.message}`, true);
    } finally {
      setIsTestRunning(false);
    }
  };

  const testSignOut = async () => {
    setIsTestRunning(true);
    showStatus('Test de déconnexion en cours...');
    
    try {
      await signOut();
      showStatus('✅ Déconnexion réussie!');
    } catch (error: any) {
      showStatus(`❌ Erreur de déconnexion: ${error.message}`, true);
    } finally {
      setIsTestRunning(false);
    }
  };

  const runFullTest = async () => {
    setIsTestRunning(true);
    showStatus('🧪 Démarrage des tests complets...');
    
    try {
      // Test 1: Sign Out (if logged in)
      if (user) {
        showStatus('Test 1/3: Déconnexion...');
        await signOut();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Test 2: Sign Up
      showStatus('Test 2/3: Inscription...');
      try {
        await signUp(testEmail, testPassword, testName);
        showStatus('✅ Inscription réussie!');
      } catch (error: any) {
        if (error.message.includes('déjà utilisé')) {
          showStatus('ℹ️ Compte déjà existant, passage au test de connexion...');
        } else {
          throw error;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test 3: Sign Out
      showStatus('Test 3/3: Déconnexion...');
      await signOut();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test 4: Sign In
      showStatus('Test 4/3: Connexion...');
      await signIn(testEmail, testPassword);
      
      showStatus('✅ Tous les tests sont passés avec succès! Firebase fonctionne correctement.');
    } catch (error: any) {
      showStatus(`❌ Échec des tests: ${error.message}`, true);
    } finally {
      setIsTestRunning(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, '#1a0a0a']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Test Firebase Auth</Text>
          <Text style={styles.subtitle}>Vérification de l&apos;authentification</Text>
        </View>

        {/* Current User Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>État actuel</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Statut:</Text>
              <Text style={[styles.statusValue, user ? styles.statusSuccess : styles.statusError]}>
                {isLoading ? '⏳ Chargement...' : user ? '✅ Connecté' : '❌ Déconnecté'}
              </Text>
            </View>
            
            {user && (
              <>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>ID:</Text>
                  <Text style={styles.statusValue}>{user.id}</Text>
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Email:</Text>
                  <Text style={styles.statusValue}>{user.email}</Text>
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Nom:</Text>
                  <Text style={styles.statusValue}>{user.name || 'Non défini'}</Text>
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Admin:</Text>
                  <Text style={styles.statusValue}>{user.isAdmin ? 'Oui' : 'Non'}</Text>
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Profil complet:</Text>
                  <Text style={styles.statusValue}>{user.hasCompletedProfile ? 'Oui' : 'Non'}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Test Credentials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identifiants de test</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={testName}
              onChangeText={setTestName}
              placeholder="Nom complet"
              placeholderTextColor={colors.textSecondary}
              editable={!isTestRunning}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={testEmail}
              onChangeText={setTestEmail}
              placeholder="email@example.com"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isTestRunning}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={testPassword}
              onChangeText={setTestPassword}
              placeholder="Minimum 6 caractères"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              editable={!isTestRunning}
            />
          </View>
        </View>

        {/* Individual Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tests individuels</Text>
          
          <TouchableOpacity
            style={[styles.testButton, isTestRunning && styles.buttonDisabled]}
            onPress={testSignUp}
            disabled={isTestRunning}
          >
            <Text style={styles.testButtonText}>1. Tester l&apos;inscription</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testButton, isTestRunning && styles.buttonDisabled]}
            onPress={testSignIn}
            disabled={isTestRunning}
          >
            <Text style={styles.testButtonText}>2. Tester la connexion</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testButton, isTestRunning && styles.buttonDisabled]}
            onPress={testSignOut}
            disabled={isTestRunning || !user}
          >
            <Text style={styles.testButtonText}>3. Tester la déconnexion</Text>
          </TouchableOpacity>
        </View>

        {/* Full Test Suite */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test complet</Text>
          <TouchableOpacity
            style={[styles.fullTestButton, isTestRunning && styles.buttonDisabled]}
            onPress={runFullTest}
            disabled={isTestRunning}
          >
            <Text style={styles.fullTestButtonText}>
              {isTestRunning ? '⏳ Tests en cours...' : '🧪 Lancer tous les tests'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status Messages */}
        {statusMessage ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Résultat</Text>
            <View style={styles.statusMessageCard}>
              <Text style={styles.statusMessageText}>{statusMessage}</Text>
            </View>
          </View>
        ) : null}

        {/* Firebase Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuration Firebase</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Projet:</Text> les-diners-parisiens-4bb9c
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Auth:</Text> Email/Password activé
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Firestore:</Text> Collection &apos;users&apos;
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Persistence:</Text> AsyncStorage (React Native)
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionText}>
              1. Vérifiez que Firebase est configuré dans la console Firebase
            </Text>
            <Text style={styles.instructionText}>
              2. Assurez-vous que l&apos;authentification Email/Password est activée
            </Text>
            <Text style={styles.instructionText}>
              3. Vérifiez que Firestore est créé avec la collection &apos;users&apos;
            </Text>
            <Text style={styles.instructionText}>
              4. Lancez les tests pour vérifier la connexion
            </Text>
            <Text style={styles.instructionText}>
              5. Consultez les logs de la console pour plus de détails
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  statusSuccess: {
    color: '#4ade80',
  },
  statusError: {
    color: '#f87171',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
  },
  testButton: {
    backgroundColor: 'rgba(139, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  testButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  fullTestButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  fullTestButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  statusMessageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusMessageText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '600',
    color: colors.primary,
  },
  instructionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  instructionText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});

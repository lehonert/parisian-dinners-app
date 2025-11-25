
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../styles/commonStyles';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function TestFirebaseAuthScreen() {
  const router = useRouter();
  const { user, signIn, signUp, signOut, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [testResult, setTestResult] = useState('');
  const [isTestLoading, setIsTestLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsTestLoading(true);
    setTestResult('');
    
    try {
      await signUp(email, password, name);
      setTestResult('✅ Inscription réussie !');
      Alert.alert('Succès', 'Compte créé avec succès !');
    } catch (error: any) {
      setTestResult(`❌ Erreur d'inscription: ${error.message}`);
      Alert.alert('Erreur', error.message);
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir email et mot de passe');
      return;
    }

    setIsTestLoading(true);
    setTestResult('');
    
    try {
      await signIn(email, password);
      setTestResult('✅ Connexion réussie !');
      Alert.alert('Succès', 'Connexion réussie !');
    } catch (error: any) {
      setTestResult(`❌ Erreur de connexion: ${error.message}`);
      Alert.alert('Erreur', error.message);
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsTestLoading(true);
    setTestResult('');
    
    try {
      await signOut();
      setTestResult('✅ Déconnexion réussie !');
      Alert.alert('Succès', 'Déconnexion réussie !');
      setEmail('');
      setPassword('');
      setName('');
    } catch (error: any) {
      setTestResult(`❌ Erreur de déconnexion: ${error.message}`);
      Alert.alert('Erreur', error.message);
    } finally {
      setIsTestLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre email');
      return;
    }

    setIsTestLoading(true);
    setTestResult('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setTestResult('✅ Email de réinitialisation envoyé !');
      Alert.alert('Succès', 'Un email de réinitialisation a été envoyé à ' + email);
    } catch (error: any) {
      setTestResult(`❌ Erreur: ${error.message}`);
      Alert.alert('Erreur', error.message);
    } finally {
      setIsTestLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Test Firebase Auth</Text>
      </View>

      {/* État de connexion */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>État de connexion</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : user ? (
          <View>
            <Text style={styles.statusText}>✅ Connecté</Text>
            <Text style={styles.userInfo}>Email: {user.email}</Text>
            <Text style={styles.userInfo}>Nom: {user.name}</Text>
            <Text style={styles.userInfo}>ID: {user.id}</Text>
            <Text style={styles.userInfo}>Admin: {user.isAdmin ? 'Oui' : 'Non'}</Text>
          </View>
        ) : (
          <Text style={styles.statusText}>❌ Non connecté</Text>
        )}
      </View>

      {/* Résultat du dernier test */}
      {testResult ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>{testResult}</Text>
        </View>
      ) : null}

      {/* Formulaire de test */}
      {!user ? (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Tester l&apos;authentification</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nom (pour inscription)"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Mot de passe (min. 6 caractères)"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSignUp}
            disabled={isTestLoading}
          >
            {isTestLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>S&apos;inscrire</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleSignIn}
            disabled={isTestLoading}
          >
            {isTestLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.tertiaryButton]}
            onPress={handlePasswordReset}
            disabled={isTestLoading}
          >
            <Text style={[styles.buttonText, styles.tertiaryButtonText]}>
              Réinitialiser le mot de passe
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Actions</Text>
          
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleSignOut}
            disabled={isTestLoading}
          >
            {isTestLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Se déconnecter</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>📋 Instructions</Text>
        <Text style={styles.instructionText}>
          1. Entrez un email et un mot de passe (min. 6 caractères)
        </Text>
        <Text style={styles.instructionText}>
          2. Cliquez sur &quot;S&apos;inscrire&quot; pour créer un compte
        </Text>
        <Text style={styles.instructionText}>
          3. Ou cliquez sur &quot;Se connecter&quot; si vous avez déjà un compte
        </Text>
        <Text style={styles.instructionText}>
          4. Testez la réinitialisation du mot de passe
        </Text>
        <Text style={styles.instructionText}>
          5. Vérifiez que les données apparaissent dans Firestore
        </Text>
      </View>

      {/* Configuration Firebase */}
      <View style={styles.configCard}>
        <Text style={styles.configTitle}>⚙️ Configuration Firebase</Text>
        <Text style={styles.configText}>
          Project ID: les-diners-parisiens-4bb9c
        </Text>
        <Text style={styles.configText}>
          Auth Domain: les-diners-parisiens-4bb9c.firebaseapp.com
        </Text>
        <Text style={styles.configText}>
          iOS Bundle ID: com.ldplehonert.ldp
        </Text>
        <Text style={styles.configText}>
          Android Package: com.LDP.LesDinersParisiens
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  userInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  resultText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  tertiaryButtonText: {
    color: colors.textSecondary,
  },
  instructionsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  configCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  configTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  configText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
    fontFamily: 'monospace',
  },
});


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { auth, db, storage, isConfigured } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { colors } from '../styles/commonStyles';
import BackButton from '../components/BackButton';

export default function TestFirebaseConfig() {
  const [results, setResults] = useState<{ test: string; status: 'success' | 'error' | 'pending'; message: string }[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test: string, status: 'success' | 'error' | 'pending', message: string) => {
    setResults(prev => [...prev, { test, status, message }]);
  };

  const runTests = async () => {
    setResults([]);
    setTesting(true);

    // Test 1 : Configuration
    addResult('Configuration', 'pending', 'Vérification de la configuration...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (isConfigured) {
      addResult('Configuration', 'success', 'Firebase est configuré ✓');
    } else {
      addResult('Configuration', 'error', 'Firebase n\'est pas configuré. Consultez config/firebase.ts');
      setTesting(false);
      return;
    }

    // Test 2 : Authentication
    addResult('Authentication', 'pending', 'Test de l\'authentification...');
    try {
      const testEmail = `test-${Date.now()}@test.com`;
      const testPassword = 'Test123456!';
      
      // Créer un compte
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      addResult('Authentication', 'success', `Compte créé : ${userCredential.user.uid}`);
      
      // Se déconnecter
      await signOut(auth);
      
      // Se reconnecter
      await signInWithEmailAndPassword(auth, testEmail, testPassword);
      addResult('Authentication', 'success', 'Connexion réussie ✓');
      
      // Se déconnecter à nouveau
      await signOut(auth);
    } catch (error: any) {
      addResult('Authentication', 'error', `Erreur : ${error.message}`);
    }

    // Test 3 : Firestore
    addResult('Firestore', 'pending', 'Test de Firestore...');
    try {
      // Créer un document de test
      const testCollection = collection(db, 'test');
      const docRef = await addDoc(testCollection, {
        test: true,
        timestamp: new Date().toISOString(),
        platform: Platform.OS
      });
      addResult('Firestore', 'success', `Document créé : ${docRef.id}`);
      
      // Lire les documents
      const querySnapshot = await getDocs(testCollection);
      addResult('Firestore', 'success', `${querySnapshot.size} document(s) trouvé(s) ✓`);
      
      // Supprimer le document de test
      await deleteDoc(doc(db, 'test', docRef.id));
      addResult('Firestore', 'success', 'Document supprimé ✓');
    } catch (error: any) {
      addResult('Firestore', 'error', `Erreur : ${error.message}`);
    }

    // Test 4 : Storage
    addResult('Storage', 'pending', 'Test de Storage...');
    try {
      // Vérifier que Storage est accessible
      if (storage) {
        addResult('Storage', 'success', 'Storage est accessible ✓');
      } else {
        addResult('Storage', 'error', 'Storage n\'est pas accessible');
      }
    } catch (error: any) {
      addResult('Storage', 'error', `Erreur : ${error.message}`);
    }

    setTesting(false);
  };

  const getStatusColor = (status: 'success' | 'error' | 'pending') => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'pending': return '#FF9800';
    }
  };

  const getStatusIcon = (status: 'success' | 'error' | 'pending') => {
    switch (status) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'pending': return '⋯';
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Test de Configuration Firebase</Text>
        <Text style={styles.subtitle}>
          Ce test vérifie que Firebase est correctement configuré
        </Text>

        <TouchableOpacity
          style={[styles.button, testing && styles.buttonDisabled]}
          onPress={runTests}
          disabled={testing}
        >
          <Text style={styles.buttonText}>
            {testing ? 'Test en cours...' : 'Lancer les tests'}
          </Text>
        </TouchableOpacity>

        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Résultats :</Text>
            {results.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={[styles.resultIcon, { color: getStatusColor(result.status) }]}>
                    {getStatusIcon(result.status)}
                  </Text>
                  <Text style={styles.resultTest}>{result.test}</Text>
                </View>
                <Text style={styles.resultMessage}>{result.message}</Text>
              </View>
            ))}
          </View>
        )}

        {!isConfigured && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningTitle}>⚠️ Configuration requise</Text>
            <Text style={styles.warningText}>
              Firebase n'est pas encore configuré. Suivez ces étapes :
            </Text>
            <Text style={styles.warningStep}>
              1. Allez sur Firebase Console
            </Text>
            <Text style={styles.warningStep}>
              2. Créez un projet "Les Dîners Parisiens"
            </Text>
            <Text style={styles.warningStep}>
              3. Activez Authentication, Firestore et Storage
            </Text>
            <Text style={styles.warningStep}>
              4. Copiez votre configuration dans config/firebase.ts
            </Text>
            <Text style={styles.warningText}>
              Consultez GUIDE_FINALISATION.md pour plus de détails.
            </Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>ℹ️ Informations</Text>
          <Text style={styles.infoText}>
            Plateforme : {Platform.OS}
          </Text>
          <Text style={styles.infoText}>
            Configuration : {isConfigured ? 'Configuré' : 'Non configuré'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  resultItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  resultTest: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  resultMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 28,
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 12,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 8,
  },
  warningStep: {
    fontSize: 14,
    color: '#856404',
    marginLeft: 8,
    marginBottom: 4,
  },
  infoContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});

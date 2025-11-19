
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configuration Firebase - Les Dîners Parisiens
const firebaseConfig = {
  apiKey: "AIzaSyAPJQ-KaudBnAQRcDe70IEuFa9nKort-6s",
  authDomain: "les-diners-parisiens-70cd4.firebaseapp.com",
  projectId: "les-diners-parisiens-70cd4",
  storageBucket: "les-diners-parisiens-70cd4.firebasestorage.app",
  messagingSenderId: "198421275271",
  appId: "1:198421275271:android:2df5e598f84801a553ce22"
};

console.log('Initializing Firebase...');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Platform:', Platform.OS);

// Initialiser Firebase seulement si pas déjà initialisé
let app;
try {
  if (getApps().length === 0) {
    console.log('Creating new Firebase app...');
    app = initializeApp(firebaseConfig);
    console.log('Firebase app created successfully');
  } else {
    console.log('Using existing Firebase app');
    app = getApps()[0];
  }
} catch (error) {
  console.error('Error initializing Firebase app:', error);
  throw error;
}

// Initialiser Auth avec persistence pour React Native
let auth;
try {
  if (Platform.OS === 'web') {
    console.log('Initializing auth for web...');
    auth = getAuth(app);
    console.log('Web auth initialized successfully');
  } else {
    console.log('Initializing auth for native with AsyncStorage persistence...');
    // Pour React Native, utiliser initializeAuth avec persistence
    // Check if auth is already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
      try {
        auth = getAuth(app);
        console.log('Auth already initialized, using existing instance');
      } catch (authError) {
        // Auth not initialized yet, create new instance
        console.log('Creating new auth instance with persistence');
        auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage)
        });
        console.log('Native auth initialized successfully');
      }
    } else {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
      console.log('Native auth initialized successfully');
    }
  }
} catch (error) {
  console.error('Error initializing auth:', error);
  // Fallback to getAuth if initializeAuth fails
  try {
    auth = getAuth(app);
    console.log('Using fallback auth initialization');
  } catch (fallbackError) {
    console.error('Fallback auth initialization also failed:', fallbackError);
    throw fallbackError;
  }
}

// Initialiser Firestore
console.log('Initializing Firestore...');
let db;
try {
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Error initializing Firestore:', error);
  throw error;
}

// Log pour vérifier que tout est bien configuré
console.log('Firebase configuration complete');
console.log('Auth domain:', firebaseConfig.authDomain);

export { auth, db };
export default app;

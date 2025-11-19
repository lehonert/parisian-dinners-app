
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
if (getApps().length === 0) {
  console.log('Creating new Firebase app...');
  app = initializeApp(firebaseConfig);
  console.log('Firebase app created successfully');
} else {
  console.log('Using existing Firebase app');
  app = getApps()[0];
}

// Initialiser Auth avec persistence pour React Native
let auth;
try {
  if (Platform.OS === 'web') {
    console.log('Initializing auth for web...');
    auth = getAuth(app);
  } else {
    console.log('Initializing auth for native with AsyncStorage persistence...');
    // Pour React Native, utiliser initializeAuth avec persistence
    const existingAuth = getApps().length > 0 ? getAuth(app) : null;
    
    if (existingAuth) {
      auth = existingAuth;
    } else {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
    }
  }
  console.log('Auth initialized successfully');
} catch (error) {
  console.error('Error initializing auth:', error);
  // Fallback to getAuth if initializeAuth fails
  auth = getAuth(app);
  console.log('Using fallback auth initialization');
}

// Initialiser Firestore
console.log('Initializing Firestore...');
const db = getFirestore(app);
console.log('Firestore initialized successfully');

// Log pour vérifier que tout est bien configuré
console.log('Firebase configuration complete');
console.log('Auth domain:', firebaseConfig.authDomain);

export { auth, db };
export default app;

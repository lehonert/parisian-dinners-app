
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

// Initialiser Firebase seulement si pas déjà initialisé
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialiser Auth avec persistence pour React Native
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = getAuth(app);
  } catch (error) {
    // Si getAuth échoue, utiliser initializeAuth
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
}

// Initialiser Firestore
const db = getFirestore(app);

console.log('Firebase initialized successfully');
console.log('Project ID:', firebaseConfig.projectId);

export { auth, db };
export default app;

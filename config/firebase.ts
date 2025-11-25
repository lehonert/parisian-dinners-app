
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configuration Firebase - Les Dîners Parisiens
const firebaseConfig = {
  apiKey: "AIzaSyDE8DStLjqrrEM54fkuh67kctzxeafiggM",
  authDomain: "les-diners-parisiens-4bb9c.firebaseapp.com",
  projectId: "les-diners-parisiens-4bb9c",
  storageBucket: "les-diners-parisiens-4bb9c.firebasestorage.app",
  messagingSenderId: "494305117412",
  appId: "1:494305117412:ios:bb8f702a80b8cf078d18f1"
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

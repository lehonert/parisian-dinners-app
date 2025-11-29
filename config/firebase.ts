
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
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
  console.log('Firebase initialized successfully');
} else {
  app = getApps()[0];
  console.log('Firebase already initialized');
}

// Initialiser Auth avec persistence appropriée selon la plateforme
let auth;
if (Platform.OS === 'web') {
  // Pour le web, utiliser la persistence du navigateur
  auth = getAuth(app);
  console.log('Firebase Auth initialized for web with browser persistence');
} else {
  // Pour React Native, utiliser AsyncStorage
  try {
    auth = getAuth(app);
  } catch (error) {
    console.log('Initializing Auth with AsyncStorage persistence');
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
}

// Initialiser Firestore
const db = getFirestore(app);

// Activer la persistence offline pour Firestore (web uniquement)
if (Platform.OS === 'web') {
  enableMultiTabIndexedDbPersistence(db)
    .then(() => {
      console.log('Firestore offline persistence enabled (multi-tab)');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.log('Firestore persistence failed: Multiple tabs open');
        // Fallback to single tab persistence
        enableIndexedDbPersistence(db)
          .then(() => {
            console.log('Firestore offline persistence enabled (single-tab)');
          })
          .catch((error) => {
            console.log('Firestore persistence error:', error);
          });
      } else if (err.code === 'unimplemented') {
        console.log('Firestore persistence not available in this browser');
      }
    });
}

console.log('Firebase configuration complete');
console.log('Platform:', Platform.OS);
console.log('Project ID:', firebaseConfig.projectId);

export { auth, db };
export default app;

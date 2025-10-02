
import { initializeApp } from 'firebase/app';
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

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Auth avec persistence pour React Native
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialiser Firestore
const db = getFirestore(app);

export { auth, db };
export default app;

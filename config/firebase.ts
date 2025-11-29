
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// 🔥 CONFIGURATION FIREBASE
// ⚠️ IMPORTANT : Remplacez ces valeurs par celles de votre projet Firebase
// 
// Pour obtenir votre configuration :
// 1. Allez sur https://console.firebase.google.com/
// 2. Sélectionnez votre projet "Les Dîners Parisiens"
// 3. Cliquez sur l'icône Web (</>) dans les paramètres du projet
// 4. Copiez la configuration et remplacez les valeurs ci-dessous
//
// Pour Android : Assurez-vous que google-services.json est à la racine du projet
// Pour Web : Utilisez la configuration ci-dessous

const firebaseConfig = {
  // 🔑 Remplacez ces valeurs par les vôtres
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT_ID.appspot.com",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID",
  
  // Optionnel pour Analytics
  // measurementId: "G-XXXXXXXXXX"
};

// Vérifier si la configuration est valide
const isConfigured = firebaseConfig.apiKey !== "VOTRE_API_KEY";

if (!isConfigured) {
  console.warn('⚠️ Firebase n\'est pas encore configuré !');
  console.warn('📝 Suivez les instructions dans config/firebase.ts');
  console.warn('📚 Consultez GUIDE_FINALISATION.md pour plus de détails');
}

// Initialiser Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialisé avec succès');
} else {
  app = getApp();
  console.log('✅ Firebase déjà initialisé');
}

// Initialiser Auth avec persistence pour React Native
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (error) {
    // Si déjà initialisé, récupérer l'instance existante
    auth = getAuth(app);
  }
}

// Initialiser Firestore
const db = getFirestore(app);

// Initialiser Storage
const storage = getStorage(app);

// Exporter les services
export { auth, db, storage, isConfigured };
export default app;

// 📝 NOTES IMPORTANTES :
//
// 1. ANDROID :
//    - Assurez-vous que google-services.json est à la racine du projet
//    - Le package name doit être : com.LDP.LesDinersParisiens
//
// 2. WEB :
//    - Utilisez la configuration ci-dessus
//    - Ajoutez votre domaine dans Firebase Console → Authentication → Settings → Authorized domains
//
// 3. SÉCURITÉ :
//    - Ne commitez JAMAIS vos vraies clés dans un repo public
//    - Utilisez des variables d'environnement pour la production
//    - Configurez les règles Firestore (voir GUIDE_FINALISATION.md)
//
// 4. SERVICES À ACTIVER DANS FIREBASE :
//    - Authentication (Email/Password)
//    - Firestore Database
//    - Storage
//
// 5. RÈGLES FIRESTORE :
//    - Copiez les règles depuis GUIDE_FINALISATION.md
//    - Publiez-les dans Firebase Console → Firestore → Rules

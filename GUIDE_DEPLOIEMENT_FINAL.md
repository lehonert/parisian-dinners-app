
# 🚀 Guide de Déploiement Final - Les Dîners Parisiens

## ✅ État Actuel de l'Application

### Problèmes Résolus
- ✅ **Écran blanc corrigé** : Suppression du `projectId` EAS dans `app.json`
- ✅ **Configuration Expo** : Tous les paramètres sont corrects
- ✅ **Scripts package.json** : Configurés correctement
- ✅ **Structure de navigation** : Fonctionnelle avec Expo Router
- ✅ **iOS deployment target** : Configuré à 15.1+
- ✅ **expo-build-properties** : Installé et configuré

### Ce Qui Reste à Faire

#### 🔥 1. Configuration Firebase (OBLIGATOIRE)

**Fichier à modifier** : `config/firebase.ts`

Actuellement, Firebase utilise des valeurs placeholder. Vous devez :

1. **Aller sur** : https://console.firebase.google.com/
2. **Sélectionner** votre projet "Les Dîners Parisiens"
3. **Cliquer** sur l'icône Web (</>) dans les paramètres
4. **Copier** la configuration et remplacer dans `config/firebase.ts` :

```typescript
const firebaseConfig = {
  apiKey: "VOTRE_VRAIE_API_KEY",
  authDomain: "votre-project-id.firebaseapp.com",
  projectId: "votre-project-id",
  storageBucket: "votre-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};
```

**Services Firebase à activer** :
- ✅ Authentication (Email/Password)
- ✅ Firestore Database
- ✅ Storage

**Règles Firestore à configurer** :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les utilisateurs
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Règles pour les événements
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      
      // Sous-collection des inscriptions
      match /registrations/{registrationId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update, delete: if request.auth.uid == resource.data.userId;
      }
      
      // Sous-collection des avis
      match /reviews/{reviewId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update, delete: if request.auth.uid == resource.data.userId ||
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      }
    }
  }
}
```

---

## 📱 Déploiement par Plateforme

### 🤖 Android

#### Prérequis
- ✅ `google-services.json` présent à la racine
- ✅ Package name : `com.LDP.LesDinersParisiens`
- ✅ Firebase configuré

#### Commandes de Build

**1. Build de développement (APK)**
```bash
npx expo run:android
```

**2. Build de production avec EAS**
```bash
# Installer EAS CLI si pas déjà fait
npm install -g eas-cli

# Se connecter à Expo
eas login

# Configurer le projet
eas build:configure

# Lancer le build Android
eas build --platform android --profile production
```

**3. Build local (si vous avez Android Studio)**
```bash
npx expo prebuild -p android
cd android
./gradlew assembleRelease
```

#### Publication sur Google Play Store
1. Créer un compte développeur Google Play (25$ one-time)
2. Créer une nouvelle application
3. Uploader l'APK/AAB généré
4. Remplir les informations requises (description, screenshots, etc.)
5. Soumettre pour review

---

### 🍎 iOS

#### Prérequis
- ✅ `GoogleService-Info.plist` présent à la racine
- ✅ Bundle identifier : `com.LDP.LesDinersParisiens`
- ✅ Compte Apple Developer (99$/an)
- ✅ Firebase configuré

#### Commandes de Build

**1. Build de développement**
```bash
npx expo run:ios
```

**2. Build de production avec EAS**
```bash
# Lancer le build iOS
eas build --platform ios --profile production
```

**3. Build local (si vous avez Xcode sur Mac)**
```bash
npx expo prebuild -p ios
cd ios
pod install
# Ouvrir le projet dans Xcode
open LesDinersParisiens.xcworkspace
```

#### Publication sur App Store
1. Avoir un compte Apple Developer actif
2. Créer l'app dans App Store Connect
3. Configurer les certificats et provisioning profiles
4. Uploader le build via Xcode ou EAS
5. Remplir les métadonnées
6. Soumettre pour review

---

### 🌐 Web

#### Build et Déploiement

**1. Build de production**
```bash
npm run build:web
```

Cela génère un dossier `dist/` avec tous les fichiers statiques.

**2. Test local**
```bash
npm run serve:web
```

**3. Déploiement sur Vercel**
```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
npm run deploy:vercel
```

**4. Déploiement sur Netlify**
```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Déployer
npm run deploy:netlify
```

#### Configuration Firebase pour Web
Dans Firebase Console → Authentication → Settings → Authorized domains :
- Ajouter votre domaine de production (ex: `votre-app.vercel.app`)
- Ajouter `localhost` pour le développement

---

## 🧪 Tests Avant Déploiement

### Checklist de Vérification

#### ✅ Fonctionnalités Core
- [ ] Inscription avec email/password
- [ ] Connexion avec email/password
- [ ] Déconnexion
- [ ] Création de profil
- [ ] Modification de profil
- [ ] Liste des événements (à venir / passés)
- [ ] Détails d'un événement
- [ ] Inscription à un événement
- [ ] Désinscription d'un événement
- [ ] Liste d'attente (si événement complet)
- [ ] Mes inscriptions
- [ ] Laisser un avis (après événement)
- [ ] Voir les avis d'un événement

#### ✅ Fonctionnalités Admin
- [ ] Créer un événement
- [ ] Modifier un événement
- [ ] Supprimer un événement
- [ ] Approuver/supprimer des avis

#### ✅ Tests Techniques
- [ ] L'app démarre sans erreur
- [ ] Pas d'écran blanc
- [ ] Navigation fluide
- [ ] Images chargent correctement
- [ ] Formulaires fonctionnent
- [ ] Données Firebase se synchronisent
- [ ] Mode sombre/clair fonctionne
- [ ] Responsive sur tablette (si applicable)

---

## 🔧 Commandes Utiles

### Développement
```bash
# Démarrer le serveur de développement
npm run dev

# Démarrer sur Android
npm run android

# Démarrer sur iOS
npm run ios

# Démarrer sur Web
npm run web
```

### Build
```bash
# Build Web
npm run build:web

# Prebuild Android
npm run build:android

# Build avec EAS (Android)
eas build --platform android

# Build avec EAS (iOS)
eas build --platform ios

# Build les deux plateformes
eas build --platform all
```

### Déploiement
```bash
# Déployer sur Vercel
npm run deploy:vercel

# Déployer sur Netlify
npm run deploy:netlify
```

---

## 📊 Statut de Préparation au Déploiement

| Plateforme | Configuration | Build | Prêt au Déploiement |
|------------|--------------|-------|---------------------|
| **Android** | ✅ Complet | ⚠️ Nécessite Firebase | 🟡 Presque prêt |
| **iOS** | ✅ Complet | ⚠️ Nécessite Firebase | 🟡 Presque prêt |
| **Web** | ✅ Complet | ⚠️ Nécessite Firebase | 🟡 Presque prêt |

### Légende
- ✅ **Complet** : Tout est configuré
- ⚠️ **Nécessite Firebase** : Configuration Firebase requise
- 🟡 **Presque prêt** : Juste Firebase à configurer
- 🟢 **Prêt** : Peut être déployé immédiatement

---

## 🎯 Prochaines Étapes

### Immédiat (Avant Déploiement)
1. **Configurer Firebase** dans `config/firebase.ts`
2. **Activer les services** Firebase (Auth, Firestore, Storage)
3. **Configurer les règles** Firestore
4. **Tester l'authentification** sur toutes les plateformes
5. **Vérifier** que les données se synchronisent

### Court Terme (Après Premier Déploiement)
1. Créer un premier utilisateur admin
2. Créer quelques événements de test
3. Tester le flow complet d'inscription
4. Configurer les notifications push (optionnel)
5. Ajouter Google Analytics (optionnel)

### Moyen Terme (Améliorations)
1. Implémenter Google Sign-In
2. Implémenter Apple Sign-In (iOS)
3. Ajouter des paiements (Stripe)
4. Optimiser les performances
5. Ajouter des tests automatisés

---

## 🆘 Support et Dépannage

### Problèmes Courants

**Écran blanc**
- ✅ Résolu : `projectId` EAS supprimé de `app.json`

**Firebase non configuré**
- ⚠️ À faire : Remplacer les valeurs placeholder dans `config/firebase.ts`

**Build Android échoue**
- Vérifier que `google-services.json` est présent
- Vérifier le package name : `com.LDP.LesDinersParisiens`

**Build iOS échoue**
- Vérifier que `GoogleService-Info.plist` est présent
- Vérifier le bundle identifier : `com.LDP.LesDinersParisiens`
- Vérifier que vous avez un compte Apple Developer

**Erreurs de navigation**
- Vérifier que tous les fichiers de routes existent
- Vérifier les imports dans `_layout.tsx`

---

## 📞 Ressources

- **Documentation Expo** : https://docs.expo.dev/
- **Documentation Firebase** : https://firebase.google.com/docs
- **EAS Build** : https://docs.expo.dev/build/introduction/
- **Expo Router** : https://docs.expo.dev/router/introduction/

---

## ✨ Conclusion

Votre application est **presque prête** pour le déploiement ! 

**Il ne reste qu'une seule étape critique** : configurer Firebase avec vos vraies clés.

Une fois Firebase configuré, vous pourrez :
1. Tester l'application complètement
2. Lancer les builds de production
3. Déployer sur les stores

**Temps estimé pour finaliser** : 30 minutes (configuration Firebase + tests)

Bonne chance avec le déploiement ! 🚀

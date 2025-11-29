
# Guide de Finalisation - Les Dîners Parisiens

## 📋 Vue d'ensemble

Votre application est presque prête ! Voici les étapes restantes pour la rendre pleinement fonctionnelle sur Android et Web.

---

## 🔥 Étape 1 : Configuration Firebase (Sans Mac/Xcode)

### 1.1 Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez-le "Les Dîners Parisiens"
4. Suivez les étapes de création

### 1.2 Activer les services Firebase

Dans votre projet Firebase :

**Authentication :**
- Allez dans "Authentication" → "Sign-in method"
- Activez "Email/Password"
- Activez "Google" (optionnel pour Android)

**Firestore Database :**
- Allez dans "Firestore Database"
- Cliquez sur "Créer une base de données"
- Choisissez "Commencer en mode test" (pour le développement)
- Sélectionnez une région proche (europe-west)

**Storage :**
- Allez dans "Storage"
- Cliquez sur "Commencer"
- Utilisez les règles par défaut pour le développement

### 1.3 Configuration Android (Sans Xcode)

1. **Dans Firebase Console :**
   - Cliquez sur l'icône Android
   - Nom du package : `com.LDP.LesDinersParisiens` (déjà dans votre app.json)
   - Téléchargez le fichier `google-services.json`
   - Placez-le à la racine de votre projet (déjà fait ✓)

2. **Vérifiez votre fichier google-services.json :**
   - Il doit contenir votre configuration Firebase
   - Le package_name doit être `com.LDP.LesDinersParisiens`

### 1.4 Configuration Web

1. **Dans Firebase Console :**
   - Cliquez sur l'icône Web (</>) 
   - Nommez l'app "Les Dîners Parisiens Web"
   - Copiez la configuration Firebase

2. **Mettez à jour config/firebase.ts :**
   - Remplacez les valeurs de `firebaseConfig` par celles de votre projet
   - Les clés à remplacer : apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId

---

## 🔧 Étape 2 : Configuration des règles Firestore

Dans Firebase Console → Firestore Database → Règles, copiez ces règles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow update, delete: if request.auth != null && 
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      
      // Registrations subcollection
      match /registrations/{registrationId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow delete: if request.auth != null && 
                        (request.auth.uid == resource.data.userId || 
                         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      }
      
      // Reviews subcollection
      match /reviews/{reviewId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update, delete: if request.auth != null && 
                              (request.auth.uid == resource.data.userId || 
                               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      }
    }
  }
}
```

---

## 📱 Étape 3 : Test sur Android

### 3.1 Préparer l'environnement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run android
```

### 3.2 Tester les fonctionnalités

**Test d'authentification :**
1. Ouvrez l'app sur votre appareil Android
2. Créez un compte avec email/password
3. Vérifiez que vous êtes redirigé vers la configuration du profil
4. Complétez votre profil
5. Déconnectez-vous et reconnectez-vous

**Test des événements :**
1. Allez dans l'onglet "Événements"
2. Vérifiez que la liste s'affiche (vide au début)
3. Si vous êtes admin, créez un événement
4. Inscrivez-vous à un événement
5. Vérifiez "Mes inscriptions"

**Test du profil :**
1. Allez dans l'onglet "Profil"
2. Modifiez votre profil
3. Testez les paramètres

### 3.3 Créer un utilisateur admin

Pour tester les fonctionnalités admin :

1. Créez un compte normalement
2. Allez dans Firebase Console → Firestore Database
3. Trouvez votre document utilisateur dans la collection `users`
4. Ajoutez un champ `isAdmin: true`
5. Redémarrez l'app
6. L'onglet "Admin" devrait maintenant être visible

---

## 🌐 Étape 4 : Test sur Web

### 4.1 Lancer la version Web

```bash
# Lancer le serveur web
npm run web
```

L'app s'ouvrira dans votre navigateur à `http://localhost:8081`

### 4.2 Tester les fonctionnalités Web

- Testez l'authentification
- Vérifiez que toutes les pages fonctionnent
- Testez la navigation
- Vérifiez la responsivité (redimensionnez la fenêtre)

### 4.3 Build pour production Web

```bash
# Créer le build de production
npm run build:web

# Tester le build localement
npm run serve:web
```

---

## 🚀 Étape 5 : Déploiement Web

### Option A : Vercel (Recommandé)

1. Créez un compte sur [Vercel](https://vercel.com)
2. Installez Vercel CLI : `npm install -g vercel`
3. Déployez : `npm run deploy:vercel`
4. Suivez les instructions

### Option B : Netlify

1. Créez un compte sur [Netlify](https://netlify.com)
2. Installez Netlify CLI : `npm install -g netlify-cli`
3. Déployez : `npm run deploy:netlify`
4. Suivez les instructions

### Option C : Firebase Hosting

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser Firebase Hosting
firebase init hosting

# Déployer
firebase deploy --only hosting
```

---

## 📦 Étape 6 : Build Android (APK)

### 6.1 Configuration EAS Build

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter à Expo
eas login

# Configurer le projet
eas build:configure
```

### 6.2 Créer un build Android

```bash
# Build APK pour test
eas build --platform android --profile preview

# Build AAB pour Google Play Store
eas build --platform android --profile production
```

Le build prendra quelques minutes. Vous recevrez un lien pour télécharger l'APK.

---

## ✅ Étape 7 : Checklist finale

### Fonctionnalités à vérifier :

- [ ] **Authentification**
  - [ ] Inscription avec email/password
  - [ ] Connexion
  - [ ] Déconnexion
  - [ ] Mot de passe oublié
  - [ ] Configuration du profil après inscription

- [ ] **Événements**
  - [ ] Liste des événements (À venir / Passés)
  - [ ] Détails d'un événement
  - [ ] Inscription à un événement
  - [ ] Désinscription
  - [ ] Liste d'attente si complet

- [ ] **Inscriptions**
  - [ ] Voir mes inscriptions
  - [ ] Annuler une inscription

- [ ] **Avis**
  - [ ] Laisser un avis après un événement
  - [ ] Voir les avis d'un événement

- [ ] **Admin**
  - [ ] Créer un événement
  - [ ] Modifier un événement
  - [ ] Supprimer un événement
  - [ ] Gérer les avis

- [ ] **Profil**
  - [ ] Voir son profil
  - [ ] Modifier son profil
  - [ ] Changer sa photo
  - [ ] Paramètres
  - [ ] Aide et support

### Tests sur différentes plateformes :

- [ ] **Android**
  - [ ] Toutes les fonctionnalités marchent
  - [ ] Navigation fluide
  - [ ] Pas de crash

- [ ] **Web**
  - [ ] Toutes les fonctionnalités marchent
  - [ ] Responsive design
  - [ ] Compatible avec Chrome, Firefox, Safari

---

## 🐛 Dépannage

### Problème : Firebase ne se connecte pas

**Solution :**
1. Vérifiez que `google-services.json` est à la racine
2. Vérifiez que le package name correspond
3. Vérifiez votre configuration dans `config/firebase.ts`
4. Redémarrez le serveur de développement

### Problème : L'app crash au démarrage

**Solution :**
1. Vérifiez les logs : `npx expo start`
2. Nettoyez le cache : `npx expo start --clear`
3. Réinstallez les dépendances : `rm -rf node_modules && npm install`

### Problème : Les images ne s'affichent pas

**Solution :**
1. Vérifiez que les URLs des images sont valides
2. Pour le web, utilisez des URLs absolues
3. Pour Android, vérifiez les permissions

### Problème : La navigation ne fonctionne pas

**Solution :**
1. Vérifiez que tous les fichiers de navigation existent
2. Vérifiez la structure des dossiers dans `app/`
3. Redémarrez le serveur

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez les fichiers README dans le projet
2. Vérifiez les logs dans la console
3. Consultez la documentation Firebase
4. Consultez la documentation Expo

---

## 🎉 Prochaines étapes

Une fois tout fonctionnel :

1. **Ajoutez des données de test** dans Firestore
2. **Testez avec plusieurs utilisateurs**
3. **Optimisez les performances**
4. **Ajoutez des analytics** (Firebase Analytics)
5. **Configurez les notifications push** (optionnel)
6. **Publiez sur Google Play Store**

---

## 📚 Ressources utiles

- [Documentation Firebase](https://firebase.google.com/docs)
- [Documentation Expo](https://docs.expo.dev/)
- [Documentation React Native](https://reactnative.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

---

**Bon courage ! Votre application est presque prête ! 🚀**


# 🛠️ Commandes Utiles

Toutes les commandes dont vous aurez besoin pour développer et déployer votre app.

---

## 🚀 Développement

### Démarrer l'app

```bash
# Android
npm run android

# Web
npm run web

# iOS (nécessite un Mac)
npm run ios

# Choisir la plateforme manuellement
npm run dev
# Puis appuyez sur 'a' pour Android, 'w' pour Web
```

### Nettoyer le cache

```bash
# Nettoyer et redémarrer
npx expo start --clear

# Nettoyer complètement
rm -rf node_modules
rm -rf .expo
npm install
npx expo start --clear
```

### Installer les dépendances

```bash
# Installer toutes les dépendances
npm install

# Installer une dépendance spécifique
npm install nom-du-package

# Mettre à jour les dépendances
npm update
```

---

## 🧪 Tests

### Tester Firebase

```bash
# Lancer l'app
npm run android  # ou npm run web

# Dans l'app :
# 1. Aller dans Profil
# 2. Cliquer sur "🔧 Tester Configuration Firebase"
# 3. Lancer les tests
```

### Voir les logs

```bash
# Logs en temps réel
npx expo start

# Logs Android spécifiques
adb logcat

# Logs Web
# Ouvrir la console du navigateur (F12)
```

---

## 📦 Build

### Build Android (APK)

```bash
# Installer EAS CLI (une fois)
npm install -g eas-cli

# Se connecter
eas login

# Configurer le projet (une fois)
eas build:configure

# Build APK pour test
eas build --platform android --profile preview

# Build AAB pour Google Play
eas build --platform android --profile production
```

### Build Web

```bash
# Build de production
npm run build:web

# Tester le build localement
npm run serve:web

# Le build sera dans le dossier 'dist/'
```

---

## 🌐 Déploiement

### Déployer sur Vercel

```bash
# Installer Vercel CLI (une fois)
npm install -g vercel

# Build
npm run build:web

# Déployer
npm run deploy:vercel

# Ou manuellement
vercel --prod
```

### Déployer sur Netlify

```bash
# Installer Netlify CLI (une fois)
npm install -g netlify-cli

# Build
npm run build:web

# Déployer
npm run deploy:netlify

# Ou manuellement
netlify deploy --prod --dir=dist
```

### Déployer sur Firebase Hosting

```bash
# Installer Firebase CLI (une fois)
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser (une fois)
firebase init hosting
# Choisir 'dist' comme dossier public

# Build
npm run build:web

# Déployer
firebase deploy --only hosting
```

---

## 🔧 Firebase

### Commandes Firebase CLI

```bash
# Se connecter
firebase login

# Lister les projets
firebase projects:list

# Sélectionner un projet
firebase use nom-du-projet

# Déployer les règles Firestore
firebase deploy --only firestore:rules

# Déployer les règles Storage
firebase deploy --only storage

# Déployer tout
firebase deploy
```

### Gérer Firestore

```bash
# Exporter les données
firebase firestore:export gs://votre-bucket/backup

# Importer les données
firebase firestore:import gs://votre-bucket/backup

# Supprimer toutes les données (ATTENTION !)
firebase firestore:delete --all-collections
```

---

## 🐛 Dépannage

### Problèmes courants

```bash
# Erreur de dépendances
rm -rf node_modules package-lock.json
npm install

# Erreur de cache Expo
rm -rf .expo
npx expo start --clear

# Erreur de build Android
cd android
./gradlew clean
cd ..
npx expo start --clear

# Erreur de permissions
# Sur Linux/Mac
sudo chown -R $USER node_modules
```

### Réinitialiser complètement

```bash
# Supprimer tout
rm -rf node_modules
rm -rf .expo
rm -rf android
rm -rf ios
rm -rf dist
rm package-lock.json

# Réinstaller
npm install

# Reconstruire
npx expo prebuild --clean
npx expo start --clear
```

---

## 📱 Gestion des appareils

### Android

```bash
# Lister les appareils connectés
adb devices

# Installer l'APK manuellement
adb install chemin/vers/app.apk

# Désinstaller l'app
adb uninstall com.LDP.LesDinersParisiens

# Redémarrer ADB
adb kill-server
adb start-server

# Voir les logs
adb logcat
```

### Émulateur Android

```bash
# Lister les émulateurs
emulator -list-avds

# Démarrer un émulateur
emulator -avd nom_de_l_emulateur

# Ou via Android Studio
# Tools → AVD Manager → Play
```

---

## 🔍 Inspection

### Inspecter l'app

```bash
# React Native Debugger
# Télécharger depuis : https://github.com/jhen0409/react-native-debugger

# Expo Dev Tools
npx expo start
# Puis ouvrir http://localhost:19002 dans le navigateur

# Inspecter le Web
# Ouvrir la console du navigateur (F12)
```

### Analyser les performances

```bash
# Analyser le bundle Web
npm run build:web
npx webpack-bundle-analyzer dist/stats.json

# Profiler React Native
# Dans l'app, secouer le téléphone → Enable Performance Monitor
```

---

## 📊 Statistiques

### Taille du projet

```bash
# Taille des node_modules
du -sh node_modules

# Taille du build Web
du -sh dist

# Taille de l'APK
ls -lh *.apk
```

### Compter les lignes de code

```bash
# Installer cloc (une fois)
# Mac : brew install cloc
# Linux : sudo apt install cloc
# Windows : choco install cloc

# Compter les lignes
cloc app components contexts
```

---

## 🔐 Sécurité

### Variables d'environnement

```bash
# Créer un fichier .env
cp .env.example .env

# Éditer avec vos valeurs
nano .env  # ou votre éditeur préféré

# Ne JAMAIS commiter .env dans Git !
# Il est déjà dans .gitignore
```

### Secrets EAS

```bash
# Ajouter un secret
eas secret:create --scope project --name NOM_SECRET --value valeur

# Lister les secrets
eas secret:list

# Supprimer un secret
eas secret:delete --name NOM_SECRET
```

---

## 📝 Git

### Commandes Git utiles

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Description des changements"

# Pousser vers GitHub
git push origin main

# Créer une branche
git checkout -b nom-de-la-branche

# Voir l'historique
git log --oneline

# Annuler les changements
git checkout -- .
```

---

## 🎨 Personnalisation

### Changer les couleurs

```bash
# Éditer le fichier de styles
nano styles/commonStyles.ts

# Ou avec votre éditeur préféré
code styles/commonStyles.ts
```

### Changer les icônes

```bash
# Générer des icônes
# Utilisez un outil comme : https://www.appicon.co/

# Remplacer les icônes dans
# assets/images/
```

---

## 📚 Documentation

### Générer la documentation

```bash
# Installer TypeDoc (une fois)
npm install -g typedoc

# Générer la doc
typedoc --out docs app

# Ouvrir la doc
open docs/index.html
```

---

## 🔄 Mises à jour

### Mettre à jour Expo

```bash
# Vérifier les mises à jour
npx expo-doctor

# Mettre à jour Expo
npx expo upgrade

# Mettre à jour les dépendances
npm update
```

### Mettre à jour Firebase

```bash
# Mettre à jour Firebase
npm update firebase

# Mettre à jour les règles
firebase deploy --only firestore:rules
```

---

## 🎯 Raccourcis utiles

### Dans le terminal Expo

```
a - Ouvrir sur Android
w - Ouvrir sur Web
i - Ouvrir sur iOS
r - Recharger l'app
m - Ouvrir le menu
c - Nettoyer le cache
d - Ouvrir les Dev Tools
```

---

## 📞 Aide

### Obtenir de l'aide

```bash
# Aide Expo
npx expo --help

# Aide EAS
eas --help

# Aide Firebase
firebase --help

# Aide npm
npm help
```

---

## 🎉 Commandes de production

### Avant de déployer

```bash
# 1. Tester localement
npm run android
npm run web

# 2. Vérifier les erreurs
npx expo-doctor

# 3. Build
npm run build:web
eas build --platform android --profile production

# 4. Tester le build
npm run serve:web
# Installer l'APK sur un appareil

# 5. Déployer
npm run deploy:vercel
firebase deploy --only hosting
```

---

**Gardez ce fichier à portée de main ! 📌**

Vous pouvez le consulter à tout moment pour trouver la commande dont vous avez besoin.

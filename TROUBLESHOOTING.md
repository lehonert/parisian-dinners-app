
# 🔧 Guide de Dépannage

## Problèmes courants et solutions

---

## 🔥 Firebase

### ❌ Erreur : "Firebase not initialized"

**Cause :** Configuration Firebase incorrecte

**Solution :**
1. Vérifiez `config/firebase.ts`
2. Assurez-vous que toutes les clés sont remplies
3. Vérifiez que `google-services.json` existe à la racine
4. Redémarrez : `npx expo start --clear`

### ❌ Erreur : "Auth domain not whitelisted"

**Cause :** Domaine non autorisé pour l'authentification

**Solution :**
1. Firebase Console → Authentication → Settings
2. Ajoutez votre domaine dans "Authorized domains"
3. Pour le web local, ajoutez `localhost`

### ❌ Erreur : "Permission denied" dans Firestore

**Cause :** Règles de sécurité trop strictes

**Solution :**
1. Firebase Console → Firestore → Rules
2. Utilisez les règles du fichier `GUIDE_FINALISATION.md`
3. Publiez les règles

---

## 📱 Android

### ❌ L'app ne démarre pas

**Solution :**
```bash
# Nettoyer le cache
npx expo start --clear

# Réinstaller les dépendances
rm -rf node_modules
npm install

# Redémarrer
npm run android
```

### ❌ Erreur : "Package name mismatch"

**Cause :** Le package name ne correspond pas

**Solution :**
1. Vérifiez `app.json` : `"package": "com.LDP.LesDinersParisiens"`
2. Vérifiez `google-services.json` : même package name
3. Recréez le build : `npx expo prebuild --clean`

### ❌ L'app crash au lancement

**Solution :**
1. Vérifiez les logs : `npx expo start`
2. Cherchez les erreurs en rouge
3. Vérifiez que Firebase est bien configuré
4. Testez sur un autre appareil

---

## 🌐 Web

### ❌ Page blanche

**Solution :**
1. Ouvrez la console du navigateur (F12)
2. Cherchez les erreurs
3. Vérifiez que Firebase Web est configuré
4. Videz le cache du navigateur

### ❌ Erreur : "Module not found"

**Solution :**
```bash
# Réinstaller les dépendances
rm -rf node_modules
npm install

# Redémarrer
npm run web
```

### ❌ Les images ne s'affichent pas

**Cause :** Chemins d'images incorrects pour le web

**Solution :**
- Utilisez des URLs absolues pour les images
- Ou utilisez `require()` pour les images locales
- Vérifiez que les images existent dans `assets/images/`

---

## 🔐 Authentification

### ❌ Impossible de se connecter

**Solution :**
1. Vérifiez que Authentication est activé dans Firebase
2. Vérifiez que Email/Password est activé
3. Vérifiez votre connexion internet
4. Essayez de créer un nouveau compte

### ❌ "User not found" après inscription

**Cause :** Le document utilisateur n'a pas été créé dans Firestore

**Solution :**
1. Vérifiez les règles Firestore
2. Vérifiez que le code crée bien le document dans `AuthContext.tsx`
3. Créez manuellement le document dans Firebase Console

### ❌ Mot de passe oublié ne fonctionne pas

**Solution :**
1. Vérifiez que l'email existe dans Firebase Authentication
2. Vérifiez vos spams
3. Vérifiez que le domaine est autorisé dans Firebase

---

## 🎨 Interface

### ❌ Les couleurs sont bizarres

**Solution :**
- Vérifiez `styles/commonStyles.ts`
- Assurez-vous que les couleurs sont bien définies
- Redémarrez l'app

### ❌ La navigation ne fonctionne pas

**Solution :**
1. Vérifiez la structure des dossiers dans `app/`
2. Vérifiez que tous les fichiers `_layout.tsx` existent
3. Redémarrez : `npx expo start --clear`

### ❌ Les icônes ne s'affichent pas

**Solution :**
- Utilisez le composant `IconSymbol`
- Vérifiez les noms d'icônes (iOS et Android différents)
- Consultez la liste des icônes disponibles

---

## 📦 Build

### ❌ EAS Build échoue

**Solution :**
```bash
# Vérifier la configuration
eas build:configure

# Nettoyer et rebuild
eas build --platform android --profile preview --clear-cache
```

### ❌ "Invalid credentials"

**Solution :**
```bash
# Se reconnecter
eas logout
eas login
```

### ❌ Build trop long

**Cause :** Normal, le premier build peut prendre 15-30 minutes

**Solution :**
- Soyez patient
- Les builds suivants seront plus rapides
- Vérifiez votre connexion internet

---

## 💾 Données

### ❌ Les données ne se sauvegardent pas

**Solution :**
1. Vérifiez les règles Firestore
2. Vérifiez que l'utilisateur est connecté
3. Vérifiez les logs pour les erreurs
4. Testez avec Firebase Console directement

### ❌ Les événements ne s'affichent pas

**Solution :**
1. Créez un événement manuellement dans Firebase Console
2. Vérifiez les règles de lecture Firestore
3. Vérifiez que l'utilisateur est connecté
4. Vérifiez les logs

---

## 🔍 Debugging

### Voir les logs

**Android :**
```bash
npx expo start
# Appuyez sur 'a' pour ouvrir sur Android
# Les logs s'affichent dans le terminal
```

**Web :**
```bash
npm run web
# Ouvrez la console du navigateur (F12)
```

### Nettoyer complètement

```bash
# Supprimer tout
rm -rf node_modules
rm -rf .expo
rm -rf android
rm -rf ios

# Réinstaller
npm install

# Redémarrer proprement
npx expo start --clear
```

---

## 📞 Besoin d'aide ?

1. **Consultez les logs** - Ils contiennent souvent la solution
2. **Vérifiez Firebase Console** - Assurez-vous que tout est activé
3. **Testez sur un autre appareil** - Pour isoler le problème
4. **Consultez la documentation** :
   - [Expo Docs](https://docs.expo.dev/)
   - [Firebase Docs](https://firebase.google.com/docs)
   - [React Native Docs](https://reactnative.dev/)

---

## ✅ Checklist de dépannage

Avant de chercher plus loin, vérifiez :

- [ ] Firebase est configuré (Authentication, Firestore, Storage activés)
- [ ] `google-services.json` est à la racine du projet
- [ ] `config/firebase.ts` contient votre configuration
- [ ] Les règles Firestore sont configurées
- [ ] Vous avez une connexion internet
- [ ] Vous avez redémarré l'app avec `--clear`
- [ ] Les dépendances sont installées (`npm install`)
- [ ] Vous êtes sur la dernière version du code

---

**La plupart des problèmes se résolvent avec un bon nettoyage et un redémarrage ! 🔄**

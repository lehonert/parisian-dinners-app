
# 📱 Les Dîners Parisiens - Application Mobile

Bienvenue dans l'application **Les Dîners Parisiens** ! 🍽️

---

## 🎯 Qu'est-ce que c'est ?

Une application mobile pour gérer une communauté culinaire parisienne :

- 👥 **Authentification** : Créez votre compte et connectez-vous
- 🍽️ **Événements** : Découvrez et inscrivez-vous aux dîners
- ⭐ **Avis** : Partagez votre expérience après chaque événement
- 👨‍💼 **Admin** : Créez et gérez les événements (pour les admins)
- 👤 **Profil** : Gérez votre profil et vos inscriptions

---

## 🚀 Démarrage

### Option 1 : Démarrage Ultra-Rapide (10 minutes)

Suivez le guide **DEMARRAGE_RAPIDE.md** pour être opérationnel en 10 minutes !

### Option 2 : Guide Complet

Consultez **GUIDE_FINALISATION.md** pour un guide détaillé de toutes les étapes.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Un compte Firebase (gratuit)
- ✅ Node.js installé sur votre ordinateur
- ✅ Un téléphone Android OU un navigateur web

**Note :** Vous n'avez PAS besoin de Mac ou Xcode ! 🎉

---

## 🔧 Installation

```bash
# Installer les dépendances
npm install

# Lancer sur Android
npm run android

# Lancer sur Web
npm run web
```

---

## 📚 Documentation

- **DEMARRAGE_RAPIDE.md** - Démarrez en 10 minutes
- **GUIDE_FINALISATION.md** - Guide complet étape par étape
- **ETAPES_RAPIDES.md** - Résumé des étapes essentielles
- **TROUBLESHOOTING.md** - Solutions aux problèmes courants
- **FIREBASE_SETUP.md** - Configuration détaillée de Firebase

---

## 🎨 Fonctionnalités

### Pour tous les utilisateurs :

- ✅ Créer un compte et se connecter
- ✅ Configurer son profil (photo, nom, bio)
- ✅ Voir la liste des événements (à venir et passés)
- ✅ S'inscrire à un événement
- ✅ Se désinscrire d'un événement
- ✅ Voir ses inscriptions
- ✅ Laisser un avis après un événement
- ✅ Gérer son profil et ses paramètres

### Pour les administrateurs :

- ✅ Créer un événement
- ✅ Modifier un événement
- ✅ Supprimer un événement
- ✅ Voir les participants
- ✅ Gérer les avis

---

## 🧪 Tests

L'application inclut des outils de test intégrés :

1. **Test de Configuration Firebase**
   - Profil → "🔧 Tester Configuration Firebase"
   - Vérifie que Firebase est correctement configuré

2. **Test d'Authentification**
   - Profil → "🧪 Tester Firebase Auth"
   - Teste toutes les fonctionnalités d'authentification

---

## 🌐 Plateformes supportées

- ✅ **Android** - Pleinement fonctionnel
- ✅ **Web** - Pleinement fonctionnel
- ⚠️ **iOS** - Nécessite un Mac avec Xcode (non disponible actuellement)

---

## 🔐 Sécurité

- Authentification sécurisée avec Firebase
- Règles Firestore pour protéger les données
- Validation côté serveur
- Mots de passe chiffrés

---

## 📱 Build Android (APK)

Pour créer un fichier APK installable :

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter
eas login

# Créer un build
eas build --platform android --profile preview
```

Vous recevrez un lien pour télécharger l'APK !

---

## 🌐 Déploiement Web

### Vercel (Recommandé)

```bash
npm run build:web
npm run deploy:vercel
```

### Netlify

```bash
npm run build:web
npm run deploy:netlify
```

### Firebase Hosting

```bash
firebase init hosting
firebase deploy --only hosting
```

---

## 🐛 Problèmes ?

Consultez **TROUBLESHOOTING.md** pour les solutions aux problèmes courants.

Les problèmes les plus fréquents :

1. **Firebase ne fonctionne pas** → Vérifiez votre configuration
2. **L'app ne démarre pas** → Nettoyez le cache : `npx expo start --clear`
3. **Les images ne s'affichent pas** → Vérifiez les URLs
4. **Erreur de navigation** → Redémarrez l'app

---

## 📞 Support

- 📧 Email : contact@lesdinersparisiens.fr
- 📱 WhatsApp : +33 6 12 34 56 78
- 📸 Instagram : [@dinersparisiens](https://www.instagram.com/dinersparisiens)

---

## 🎉 Prochaines étapes

Une fois l'app fonctionnelle :

1. Créez des événements de test
2. Invitez des amis à tester
3. Collectez des retours
4. Ajoutez des fonctionnalités
5. Publiez sur Google Play Store

---

## 📄 Licence

© 2024 Les Dîners Parisiens. Tous droits réservés.

---

**Bon appétit et bon développement ! 🍽️👨‍💻**

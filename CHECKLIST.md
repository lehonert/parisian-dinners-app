
# ✅ Checklist de Configuration

Cochez les cases au fur et à mesure que vous avancez !

---

## 🔥 Configuration Firebase

### Créer le projet
- [ ] Aller sur https://console.firebase.google.com/
- [ ] Cliquer sur "Ajouter un projet"
- [ ] Nommer le projet "Les Dîners Parisiens"
- [ ] Créer le projet

### Activer Authentication
- [ ] Aller dans Authentication
- [ ] Cliquer sur "Commencer"
- [ ] Aller dans "Sign-in method"
- [ ] Activer "Email/Password"
- [ ] Enregistrer

### Activer Firestore
- [ ] Aller dans Firestore Database
- [ ] Cliquer sur "Créer une base de données"
- [ ] Choisir "Mode test"
- [ ] Sélectionner la région "europe-west"
- [ ] Activer

### Activer Storage
- [ ] Aller dans Storage
- [ ] Cliquer sur "Commencer"
- [ ] Choisir "Mode test"
- [ ] Activer

### Configurer Android
- [ ] Cliquer sur l'icône Android
- [ ] Entrer le package : `com.LDP.LesDinersParisiens`
- [ ] Télécharger `google-services.json`
- [ ] Remplacer le fichier à la racine du projet

### Configurer Web
- [ ] Cliquer sur l'icône Web
- [ ] Nommer l'app "Les Dîners Parisiens Web"
- [ ] Copier la configuration `firebaseConfig`
- [ ] Ouvrir `config/firebase.ts`
- [ ] Remplacer les valeurs dans `firebaseConfig`
- [ ] Enregistrer le fichier

### Configurer les règles Firestore
- [ ] Aller dans Firestore → Règles
- [ ] Copier les règles depuis `GUIDE_FINALISATION.md`
- [ ] Coller dans l'éditeur
- [ ] Cliquer sur "Publier"

---

## 🧪 Tests

### Test de configuration
- [ ] Lancer l'app : `npm run android` ou `npm run web`
- [ ] Aller dans Profil
- [ ] Cliquer sur "🔧 Tester Configuration Firebase"
- [ ] Lancer les tests
- [ ] Vérifier que tous les tests sont verts ✓

### Test d'authentification
- [ ] Créer un compte
- [ ] Se déconnecter
- [ ] Se reconnecter
- [ ] Tester "Mot de passe oublié"

### Test du profil
- [ ] Modifier son profil
- [ ] Changer sa photo
- [ ] Modifier sa bio

---

## 👨‍💼 Configuration Admin (optionnel)

- [ ] Aller dans Firebase Console → Firestore
- [ ] Trouver votre utilisateur dans la collection `users`
- [ ] Ajouter le champ `isAdmin: true`
- [ ] Redémarrer l'app
- [ ] Vérifier que l'onglet "Admin" apparaît

---

## 🎨 Test des fonctionnalités

### Événements
- [ ] Voir la liste des événements
- [ ] Créer un événement (si admin)
- [ ] Voir les détails d'un événement
- [ ] S'inscrire à un événement
- [ ] Se désinscrire d'un événement

### Inscriptions
- [ ] Voir ses inscriptions
- [ ] Annuler une inscription

### Avis
- [ ] Laisser un avis sur un événement passé
- [ ] Voir les avis d'un événement

### Admin (si admin)
- [ ] Créer un événement
- [ ] Modifier un événement
- [ ] Supprimer un événement
- [ ] Voir les participants

---

## 🚀 Déploiement (optionnel)

### Android
- [ ] Installer EAS CLI : `npm install -g eas-cli`
- [ ] Se connecter : `eas login`
- [ ] Créer un build : `eas build --platform android --profile preview`
- [ ] Télécharger l'APK
- [ ] Installer sur un appareil Android

### Web
- [ ] Build : `npm run build:web`
- [ ] Choisir une plateforme (Vercel, Netlify, Firebase)
- [ ] Déployer
- [ ] Tester l'URL de production

---

## 📊 Progression

```
Configuration Firebase    [░░░░░░░░░░] 0%
Tests                     [░░░░░░░░░░] 0%
Configuration Admin       [░░░░░░░░░░] 0%
Test des fonctionnalités  [░░░░░░░░░░] 0%
Déploiement              [░░░░░░░░░░] 0%
```

Mettez à jour cette progression au fur et à mesure !

---

## 🎉 Félicitations !

Une fois toutes les cases cochées, votre application est **100% fonctionnelle** !

Vous pouvez maintenant :
- Inviter des utilisateurs
- Créer des événements
- Organiser des dîners
- Développer votre communauté

**Bravo ! 🎊**

---

## 📝 Notes

Utilisez cet espace pour noter vos observations :

```
Date de début : _______________

Problèmes rencontrés :
- 
- 
- 

Solutions trouvées :
- 
- 
- 

Date de fin : _______________

Temps total : _______________
```

---

**Bon courage ! Vous allez y arriver ! 💪**

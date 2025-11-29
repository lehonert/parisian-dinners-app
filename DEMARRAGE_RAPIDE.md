
# 🚀 Démarrage Rapide - Les Dîners Parisiens

## ⏱️ En 10 minutes, votre app sera fonctionnelle !

---

## Étape 1 : Firebase (5 minutes)

### A. Créer le projet Firebase

1. Ouvrez https://console.firebase.google.com/
2. Cliquez sur **"Ajouter un projet"**
3. Nom : **Les Dîners Parisiens**
4. Désactivez Google Analytics (optionnel)
5. Cliquez sur **"Créer le projet"**

### B. Activer les services

**Authentication :**
- Menu de gauche → **Authentication**
- Onglet **"Sign-in method"**
- Activez **"Email/Password"** (cliquez sur le crayon, activez, enregistrez)

**Firestore :**
- Menu de gauche → **Firestore Database**
- Cliquez sur **"Créer une base de données"**
- Choisissez **"Commencer en mode test"**
- Région : **europe-west** (ou la plus proche)
- Cliquez sur **"Activer"**

**Storage :**
- Menu de gauche → **Storage**
- Cliquez sur **"Commencer"**
- Choisissez **"Commencer en mode test"**
- Cliquez sur **"Suivant"** puis **"OK"**

### C. Configurer Android

1. Dans Firebase Console, cliquez sur l'icône **Android** (robot)
2. Nom du package Android : `com.LDP.LesDinersParisiens`
3. Cliquez sur **"Enregistrer l'application"**
4. **Téléchargez google-services.json**
5. Remplacez le fichier `google-services.json` à la racine de votre projet

### D. Configurer Web

1. Dans Firebase Console, cliquez sur l'icône **Web** (`</>`)
2. Nom de l'app : **Les Dîners Parisiens Web**
3. Cliquez sur **"Enregistrer l'application"**
4. **Copiez la configuration** (le bloc `firebaseConfig`)
5. Ouvrez le fichier `config/firebase.ts` dans votre projet
6. Remplacez les valeurs dans `firebaseConfig` par les vôtres

**Exemple de ce que vous devez copier :**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "les-diners-parisiens.firebaseapp.com",
  projectId: "les-diners-parisiens",
  storageBucket: "les-diners-parisiens.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

## Étape 2 : Règles Firestore (2 minutes)

1. Dans Firebase Console → **Firestore Database**
2. Cliquez sur l'onglet **"Règles"**
3. Copiez-collez ces règles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      
      match /registrations/{registrationId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow delete: if request.auth != null;
      }
      
      match /reviews/{reviewId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update, delete: if request.auth != null;
      }
    }
  }
}
```

4. Cliquez sur **"Publier"**

---

## Étape 3 : Tester l'app (3 minutes)

### Sur Android :

```bash
npm install
npm run android
```

### Sur Web :

```bash
npm install
npm run web
```

### Test de configuration :

1. Ouvrez l'app
2. Allez dans **Profil** (onglet du bas)
3. Cliquez sur **"🔧 Tester Configuration Firebase"**
4. Cliquez sur **"Lancer les tests"**
5. Tous les tests doivent être verts ✓

---

## Étape 4 : Créer votre compte (1 minute)

1. Sur l'écran d'accueil, cliquez sur **"Créer un compte"**
2. Entrez votre email et mot de passe
3. Configurez votre profil (nom, photo, bio)
4. Vous êtes connecté ! 🎉

---

## Étape 5 : Devenir Admin (optionnel)

Pour créer des événements, vous devez être admin :

1. Allez dans **Firebase Console** → **Firestore Database**
2. Cliquez sur la collection **users**
3. Trouvez votre document utilisateur (votre UID)
4. Cliquez sur **"Ajouter un champ"**
   - Nom du champ : `isAdmin`
   - Type : `boolean`
   - Valeur : `true`
5. Cliquez sur **"Mettre à jour"**
6. Redémarrez l'app
7. L'onglet **"Admin"** apparaît maintenant ! 🎉

---

## ✅ Vérification

Votre app est prête si :

- ✓ Vous pouvez créer un compte
- ✓ Vous pouvez vous connecter
- ✓ Vous pouvez modifier votre profil
- ✓ Les tests Firebase sont tous verts
- ✓ (Admin) Vous pouvez créer un événement

---

## 🎯 Prochaines étapes

1. **Créez des événements** (si vous êtes admin)
2. **Invitez des amis** à tester l'app
3. **Testez les inscriptions** aux événements
4. **Laissez des avis** après les événements

---

## 🐛 Problème ?

### L'app ne démarre pas
```bash
npx expo start --clear
```

### Firebase ne fonctionne pas
- Vérifiez que vous avez bien copié la configuration dans `config/firebase.ts`
- Vérifiez que `google-services.json` est à la racine du projet
- Utilisez l'outil de test : **Profil** → **"🔧 Tester Configuration Firebase"**

### Autres problèmes
Consultez `TROUBLESHOOTING.md` pour plus de solutions

---

## 📞 Besoin d'aide ?

- 📧 Email : contact@lesdinersparisiens.fr
- 📱 WhatsApp : +33 6 12 34 56 78
- 📸 Instagram : @dinersparisiens

---

**Félicitations ! Votre app est prête ! 🎉🍽️**

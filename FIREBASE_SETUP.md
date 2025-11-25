
# 🔥 Configuration Firebase pour Les Dîners Parisiens

## ✅ Statut actuel

Votre application est **presque prête** ! Voici ce qui est déjà configuré :

- ✅ Firebase SDK installé (`firebase` v12.6.0)
- ✅ Configuration Firebase dans `config/firebase.ts`
- ✅ Fichiers de configuration Google Services présents
- ✅ AuthContext configuré avec toutes les méthodes d'authentification
- ✅ Écran de test Firebase disponible

## ⚠️ Action requise : Corriger le package name

**Problème identifié :** Le package name Android ne correspond pas entre les fichiers.

### Dans `google-services.json` :
```
"package_name": "com.LDP.LesDinersParisiens"
```

### Dans `app.json` :
```
"package": "com.ldplehonert.ldp"
```

### Solution appliquée :
Le fichier `app.json` a été mis à jour pour utiliser `com.LDP.LesDinersParisiens` afin de correspondre à votre configuration Firebase.

## 📱 Tester l'authentification Firebase

1. **Lancez l'application :**
   ```bash
   npm run dev
   ```

2. **Accédez à l'écran de test :**
   - Naviguez vers `/test-firebase-auth` dans votre application
   - Ou ajoutez un bouton temporaire dans votre app pour y accéder

3. **Testez les fonctionnalités :**
   - ✅ Inscription avec email/mot de passe
   - ✅ Connexion
   - ✅ Déconnexion
   - ✅ Réinitialisation du mot de passe

## 🔧 Configuration Firebase Console

### 1. Activer l'authentification par email

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet : **les-diners-parisiens-4bb9c**
3. Dans le menu latéral, cliquez sur **Authentication**
4. Allez dans l'onglet **Sign-in method**
5. Activez **Email/Password**

### 2. Créer les collections Firestore

1. Dans Firebase Console, allez dans **Firestore Database**
2. Si ce n'est pas déjà fait, créez une base de données en mode **production**
3. Les collections seront créées automatiquement lors de la première inscription

### 3. Configurer les règles de sécurité Firestore

Dans Firebase Console > Firestore Database > Rules, copiez ces règles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function pour vérifier si l'utilisateur est admin
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users - Les utilisateurs peuvent lire et modifier leur propre profil
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events - Lecture publique, écriture pour les admins
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create, update, delete: if isAdmin();
      
      // Registrations - Les utilisateurs peuvent gérer leurs propres inscriptions
      match /registrations/{registrationId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow delete: if request.auth != null && 
          resource.data.userId == request.auth.uid;
      }
      
      // Reviews - Les utilisateurs peuvent créer, les admins peuvent tout faire
      match /reviews/{reviewId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update, delete: if isAdmin();
      }
    }
  }
}
```

## 📊 Structure des données Firestore

### Collection `users`
```typescript
{
  id: string,                    // UID Firebase Auth
  email: string,
  name: string,
  photoURL?: string,
  bio?: string,
  phone?: string,
  profession?: string,
  howDidYouHear?: string,
  isAdmin: boolean,
  createdAt: Timestamp,
  hasCompletedProfile: boolean,
  subscription?: {
    id: string,
    userId: string,
    plan: 'annual',
    status: 'active' | 'inactive',
    startDate: Timestamp,
    endDate: Timestamp,
    price: number,
    paymentMethod: string,
    autoRenewal: boolean
  }
}
```

### Collection `events`
```typescript
{
  id: string,
  title: string,
  description: string,
  chef: string,
  date: Timestamp,
  location: string,
  capacity: number,
  price: number,
  imageUrl: string,
  createdBy: string,            // userId de l'admin créateur
  createdAt: Timestamp,
  updatedAt: Timestamp,
  registeredCount: number,
  waitlistCount: number,
  ratingAvg: number,
  ratingCount: number
}
```

### Sous-collection `events/{eventId}/registrations`
```typescript
{
  id: string,
  userId: string,
  status: 'confirmed' | 'waitlist',
  registeredAt: Timestamp
}
```

### Sous-collection `events/{eventId}/reviews`
```typescript
{
  id: string,
  userId: string,
  rating: number,               // 1-5
  comment: string,
  status: 'pending' | 'approved',
  createdAt: Timestamp,
  approvedAt?: Timestamp
}
```

## 🚀 Prochaines étapes

1. **Testez l'authentification** avec l'écran `/test-firebase-auth`
2. **Vérifiez dans Firebase Console** que les utilisateurs sont créés
3. **Créez un utilisateur admin** :
   - Inscrivez-vous avec un compte
   - Allez dans Firestore Console
   - Trouvez votre document utilisateur
   - Modifiez `isAdmin` à `true`
4. **Testez la création d'événements** avec votre compte admin
5. **Testez les inscriptions** avec un compte utilisateur normal

## 🐛 Dépannage

### Erreur : "Firebase: Error (auth/invalid-api-key)"
- Vérifiez que l'API key dans `config/firebase.ts` correspond à celle de Firebase Console

### Erreur : "Firebase: Error (auth/network-request-failed)"
- Vérifiez votre connexion internet
- Assurez-vous que Firebase Authentication est activé dans la console

### Les données ne s'affichent pas dans Firestore
- Vérifiez les règles de sécurité Firestore
- Regardez les logs de la console pour voir les erreurs

### Erreur de package name sur Android
- Assurez-vous que le package dans `app.json` correspond à celui dans `google-services.json`
- Rebuild l'application après avoir changé le package name

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs de la console (`console.log`)
2. Consultez l'écran de test Firebase (`/test-firebase-auth`)
3. Vérifiez Firebase Console pour les erreurs
4. Assurez-vous que toutes les règles de sécurité sont correctement configurées

## 🎉 Configuration terminée !

Une fois que vous avez :
- ✅ Activé l'authentification par email dans Firebase Console
- ✅ Configuré les règles de sécurité Firestore
- ✅ Testé l'inscription et la connexion
- ✅ Créé un compte admin

Votre application est prête à être utilisée ! 🚀

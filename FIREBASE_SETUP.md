
# Configuration Firebase pour Les Dîners Parisiens

## Étapes de configuration pour Expo

### 1. Placer le fichier google-services.json

1. Créez un dossier `google-services` à la racine de votre projet
2. Placez votre fichier `google-services.json` (fourni par Firebase) dans ce dossier
3. Pour iOS, placez également le fichier `GoogleService-Info.plist` dans le même dossier

### 2. Configuration automatique avec Expo

Expo gère automatiquement la configuration des plugins Gradle Firebase. Les plugins suivants sont déjà configurés dans `app.json` :
- `@react-native-firebase/app`
- `@react-native-firebase/auth` 
- `@react-native-firebase/firestore`

### 3. Structure Firestore requise

Créez ces collections dans votre base de données Firestore :

#### Collection `users`
```
users/{userId}
├── email: string
├── name: string
├── photoURL: string
├── bio: string
├── isAdmin: boolean
├── createdAt: timestamp
├── updatedAt: timestamp
├── hasCompletedProfile: boolean
└── subscription: {
    ├── isActive: boolean
    ├── plan: string
    ├── startDate: timestamp
    └── endDate: timestamp
}
```

#### Collection `events`
```
events/{eventId}
├── title: string
├── description: string
├── chef: string
├── date: timestamp
├── location: string
├── capacity: number
├── price: number
├── imageUrl: string
├── createdBy: string (userId)
├── createdAt: timestamp
├── updatedAt: timestamp
├── registeredCount: number
├── waitlistCount: number
├── ratingAvg: number
└── ratingCount: number
```

#### Sous-collection `registrations`
```
events/{eventId}/registrations/{registrationId}
├── userId: string
├── status: string ("confirmed" | "waitlist")
└── registeredAt: timestamp
```

#### Sous-collection `reviews`
```
events/{eventId}/reviews/{reviewId}
├── userId: string
├── rating: number (1-5)
├── comment: string
├── status: string ("pending" | "approved")
├── createdAt: timestamp
└── approvedAt: timestamp (optionnel)
```

### 4. Règles de sécurité Firestore

Ajoutez ces règles dans la console Firebase :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users peuvent lire et écrire leur propre profil
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Lecture publique pour les profils
    }
    
    // Events - lecture publique, écriture pour les admins
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      
      // Registrations - les utilisateurs peuvent gérer leurs propres inscriptions
      match /registrations/{registrationId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null && request.auth.uid == resource.data.userId;
        allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
      }
      
      // Reviews - les utilisateurs peuvent créer, les admins peuvent approuver/supprimer
      match /reviews/{reviewId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
        allow update, delete: if request.auth != null && 
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      }
    }
  }
}
```

### 5. Configuration de l'authentification

Dans la console Firebase, activez les méthodes d'authentification :
- Email/Password ✅
- Google (optionnel)

### 6. Commandes pour tester

```bash
# Développement
npm run dev

# Build Android (nécessite le fichier google-services.json)
npm run build:android

# Build iOS (nécessite le fichier GoogleService-Info.plist)
expo build:ios
```

### 7. Vérification de la configuration

Une fois configuré, l'application devrait :
- ✅ Permettre l'inscription et la connexion
- ✅ Synchroniser les données avec Firestore
- ✅ Gérer les inscriptions aux événements
- ✅ Permettre la création d'avis
- ✅ Gérer les abonnements utilisateurs

### 8. Troubleshooting

Si vous rencontrez des erreurs :

1. **Erreur "google-services.json not found"** : Vérifiez que le fichier est dans `google-services/google-services.json`
2. **Erreur d'authentification** : Vérifiez que les méthodes d'auth sont activées dans Firebase Console
3. **Erreur Firestore** : Vérifiez les règles de sécurité Firestore

### 9. Structure des fichiers

```
votre-projet/
├── google-services/
│   ├── google-services.json (Android)
│   └── GoogleService-Info.plist (iOS)
├── config/
│   └── firebase.ts
└── app.json (avec plugins Firebase)
```

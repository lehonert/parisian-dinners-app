
# Configuration Firebase pour Les Dîners Parisiens

## Étapes de configuration

### 1. Remplacer la configuration Firebase

Dans le fichier `config/firebase.ts`, remplacez les valeurs de `firebaseConfig` par celles de votre fichier JSON Firebase :

```typescript
const firebaseConfig = {
  apiKey: "votre-api-key",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX" // optionnel pour Analytics
};
```

### 2. Structure Firestore requise

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
└── hasCompletedProfile: boolean
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

### 3. Règles de sécurité Firestore

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

### 4. Configuration de l'authentification

Dans la console Firebase, activez les méthodes d'authentification :
- Email/Password
- Google (optionnel)

### 5. Test de la configuration

Une fois configuré, l'application devrait :
- Permettre l'inscription et la connexion
- Synchroniser les données avec Firestore
- Gérer les inscriptions aux événements
- Permettre la création d'avis

### 6. Données de test (optionnel)

Vous pouvez importer quelques événements de test dans Firestore pour commencer.

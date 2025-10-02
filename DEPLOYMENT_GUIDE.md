
# Guide de Déploiement Android - Les Dîners Parisiens

## Prérequis

1. **Compte Expo/EAS** : Créez un compte sur [expo.dev](https://expo.dev)
2. **Compte Google Play Developer** : Créez un compte sur [Google Play Console](https://play.google.com/console) (25$ de frais unique)
3. **EAS CLI** : Installez globalement avec `npm install -g eas-cli`

## Étapes de Déploiement

### 1. Configuration initiale

```bash
# Connectez-vous à votre compte Expo
eas login

# Configurez votre projet
eas build:configure
```

### 2. Mise à jour de la configuration

Modifiez le fichier `app.json` pour ajouter votre Project ID EAS :
```json
"extra": {
  "eas": {
    "projectId": "votre-project-id-ici"
  }
}
```

### 3. Configuration Firebase

Assurez-vous que vos fichiers Firebase sont en place :
- `google-services/google-services.json` pour Android
- Configuration Firebase dans `config/firebase.ts`

### 4. Build de développement (APK)

```bash
# Build APK pour tests
eas build --platform android --profile preview
```

### 5. Build de production (AAB)

```bash
# Build AAB pour Google Play Store
eas build --platform android --profile production
```

### 6. Soumission au Google Play Store

#### Option A : Soumission manuelle
1. Téléchargez le fichier AAB depuis votre dashboard EAS
2. Connectez-vous à [Google Play Console](https://play.google.com/console)
3. Créez une nouvelle application
4. Uploadez le fichier AAB
5. Remplissez les informations de l'app (description, screenshots, etc.)

#### Option B : Soumission automatique avec EAS
```bash
# Configurez d'abord votre service account Google Play
eas submit --platform android
```

## Configuration Google Play Store

### Informations requises :

**Titre de l'app :** Les Dîners Parisiens

**Description courte :**
Rejoignez notre communauté de passionnés de gastronomie et participez à des expériences culinaires uniques dans la capitale.

**Description complète :**
Les Dîners Parisiens est l'application incontournable pour tous les amateurs de gastronomie parisienne. 

🍽️ **Fonctionnalités principales :**
- Découvrez des événements culinaires exclusifs
- Inscrivez-vous aux dîners qui vous intéressent
- Rencontrez d'autres passionnés de gastronomie
- Laissez vos avis sur les événements
- Interface élégante et intuitive

👨‍🍳 **Pour les organisateurs :**
- Créez et gérez vos événements
- Suivez les inscriptions en temps réel
- Modérez les avis des participants

🔐 **Sécurisé et fiable :**
- Authentification sécurisée
- Données protégées avec Firebase
- Système d'abonnement intégré

Rejoignez dès maintenant la communauté des Dîners Parisiens et découvrez l'art culinaire parisien comme jamais auparavant !

**Catégorie :** Food & Drink

**Tags :** gastronomie, paris, événements, cuisine, communauté, dîners

### Screenshots requis :
- 2-8 screenshots de l'application
- Taille recommandée : 1080 x 1920 pixels
- Format : PNG ou JPEG

### Icône de l'app :
- Taille : 512 x 512 pixels
- Format : PNG (32-bit)
- Déjà configurée : `./assets/images/natively-dark.png`

## Commandes utiles

```bash
# Vérifier le statut des builds
eas build:list

# Voir les détails d'un build
eas build:view [BUILD_ID]

# Mettre à jour l'app
eas update

# Soumettre une nouvelle version
eas submit --platform android --latest
```

## Gestion des versions

- **Version** : Incrémentez dans `app.json` (ex: 1.0.0 → 1.0.1)
- **Version Code** : Auto-incrémenté avec `autoIncrement: true`

## Dépannage

### Erreurs communes :

1. **Keystore manquant** : EAS génère automatiquement un keystore
2. **Permissions manquantes** : Vérifiez les permissions dans `app.json`
3. **Firebase non configuré** : Vérifiez les fichiers `google-services.json`

### Support :
- Documentation EAS : [docs.expo.dev/build/introduction](https://docs.expo.dev/build/introduction/)
- Forum Expo : [forums.expo.dev](https://forums.expo.dev)

## Checklist avant déploiement

- [ ] Tests sur différents appareils Android
- [ ] Vérification des permissions
- [ ] Configuration Firebase complète
- [ ] Screenshots et descriptions prêts
- [ ] Politique de confidentialité (si nécessaire)
- [ ] Conditions d'utilisation (si nécessaire)

## Coûts

- **Expo/EAS** : Gratuit pour les builds limités, plans payants disponibles
- **Google Play Developer** : 25$ (frais unique)
- **Firebase** : Plan gratuit disponible, facturation selon l'usage

---

Votre application est maintenant prête pour le déploiement Android ! 🚀

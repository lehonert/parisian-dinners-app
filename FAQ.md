
# ❓ Questions Fréquentes (FAQ)

---

## 🔥 Firebase

### Qu'est-ce que Firebase ?
Firebase est un service de Google qui fournit un backend (serveur) pour votre application. Il gère l'authentification, la base de données et le stockage de fichiers.

### Pourquoi Firebase ?
- ✅ Gratuit pour commencer
- ✅ Facile à configurer
- ✅ Sécurisé
- ✅ Scalable (peut grandir avec votre app)
- ✅ Bien documenté

### Firebase est-il gratuit ?
Oui ! Le plan gratuit (Spark) inclut :
- 10 000 utilisateurs actifs/mois
- 1 GB de stockage
- 50 000 lectures/jour
- 20 000 écritures/jour

C'est largement suffisant pour commencer !

### Que se passe-t-il si je dépasse les limites gratuites ?
Firebase vous prévient avant. Vous pouvez alors :
- Passer au plan payant (Blaze - pay as you go)
- Optimiser votre app pour réduire l'utilisation
- Limiter le nombre d'utilisateurs

### Mes données sont-elles sécurisées ?
Oui ! Firebase utilise :
- Chiffrement des données
- Règles de sécurité configurables
- Authentification sécurisée
- Hébergement sur les serveurs de Google

---

## 💻 Développement

### J'ai besoin d'un Mac ?
**Non !** Vous pouvez tout faire sans Mac :
- ✅ Développer sur Windows/Linux
- ✅ Tester sur Android
- ✅ Tester sur Web
- ⚠️ iOS nécessite un Mac (optionnel)

### Puis-je développer sur Windows ?
Oui ! Tout fonctionne sur Windows :
- Android
- Web
- Tous les outils de développement

### Puis-je développer sur Linux ?
Oui ! Tout fonctionne sur Linux également.

### Comment tester l'app sans téléphone ?
Vous pouvez utiliser :
- Un émulateur Android (Android Studio)
- La version Web (navigateur)
- Expo Go sur votre téléphone

### L'app fonctionne-t-elle hors ligne ?
Partiellement. Firebase Firestore a un cache hors ligne, mais certaines fonctionnalités nécessitent une connexion internet.

---

## 📱 Plateformes

### Pourquoi pas iOS ?
iOS nécessite :
- Un Mac avec Xcode
- Un compte Apple Developer (99$/an)
- Un iPhone pour tester

Vous n'avez pas de Mac, donc on se concentre sur Android et Web.

### Puis-je ajouter iOS plus tard ?
Oui ! Le code est déjà compatible iOS. Il suffit de :
1. Avoir accès à un Mac
2. Installer Xcode
3. Configurer Firebase pour iOS
4. Build l'app

### L'app Web est-elle aussi bonne que l'app mobile ?
Oui ! L'app Web a toutes les fonctionnalités de l'app mobile. Elle est responsive et fonctionne sur tous les navigateurs modernes.

### Puis-je installer l'app Web sur mon téléphone ?
Oui ! C'est une PWA (Progressive Web App). Vous pouvez l'ajouter à l'écran d'accueil de votre téléphone.

---

## 🚀 Déploiement

### Comment distribuer l'app Android ?
Plusieurs options :
1. **APK direct** - Partager le fichier APK
2. **Google Play Store** - Publication officielle
3. **Lien Expo** - Partager via Expo Go

### Combien coûte la publication sur Google Play ?
25$ (paiement unique, à vie)

### Combien de temps prend la publication ?
- **APK direct** : Immédiat
- **Google Play** : 1-3 jours de review

### Comment déployer la version Web ?
Plusieurs options gratuites :
- **Vercel** - Recommandé, très simple
- **Netlify** - Alternative populaire
- **Firebase Hosting** - Intégré avec Firebase

### L'hébergement Web est-il gratuit ?
Oui ! Vercel, Netlify et Firebase Hosting ont des plans gratuits généreux.

---

## 🔧 Technique

### Quelles technologies sont utilisées ?
- **React Native** - Framework mobile
- **Expo** - Outils de développement
- **Firebase** - Backend
- **TypeScript** - Langage de programmation

### Puis-je modifier le code ?
Oui ! Le code est entièrement modifiable. Vous pouvez :
- Changer les couleurs
- Ajouter des fonctionnalités
- Modifier le design
- Personnaliser tout

### Comment ajouter une nouvelle fonctionnalité ?
1. Modifier le code
2. Tester localement
3. Déployer

Des guides sont disponibles dans la documentation Expo et React Native.

### Puis-je utiliser une autre base de données ?
Oui, mais Firebase est recommandé car :
- Déjà intégré
- Facile à utiliser
- Gratuit pour commencer

Vous pouvez migrer vers Supabase, MongoDB, etc. si nécessaire.

---

## 👥 Utilisateurs

### Comment créer un compte admin ?
1. Créez un compte normalement
2. Allez dans Firebase Console → Firestore
3. Trouvez votre utilisateur
4. Ajoutez le champ `isAdmin: true`
5. Redémarrez l'app

### Combien d'admins puis-je avoir ?
Autant que vous voulez ! Ajoutez simplement `isAdmin: true` à chaque utilisateur admin.

### Comment supprimer un utilisateur ?
1. Firebase Console → Authentication
2. Trouvez l'utilisateur
3. Cliquez sur les 3 points → Supprimer

### Les utilisateurs peuvent-ils changer leur mot de passe ?
Oui, via la fonction "Mot de passe oublié" sur l'écran de connexion.

### Comment gérer les inscriptions aux événements ?
Les utilisateurs s'inscrivent directement depuis l'app. Les admins peuvent voir la liste des participants dans les détails de l'événement.

---

## 🎨 Design

### Puis-je changer les couleurs ?
Oui ! Modifiez le fichier `styles/commonStyles.ts` :
```typescript
export const colors = {
  primary: '#8B0000',      // Rouge bordeaux
  background: '#FFFFFF',   // Blanc
  // ... autres couleurs
};
```

### Puis-je changer le logo ?
Oui ! Remplacez les images dans `assets/images/` et mettez à jour les références dans le code.

### L'app supporte-t-elle le mode sombre ?
Oui ! Le code inclut déjà le support du mode sombre. Les couleurs s'adaptent automatiquement.

### Puis-je changer la police ?
Oui ! Installez une police Google Fonts :
```bash
npm install @expo-google-fonts/nom-de-la-police
```
Puis utilisez-la dans votre code.

---

## 🐛 Problèmes

### L'app ne démarre pas
```bash
# Nettoyer le cache
npx expo start --clear

# Réinstaller les dépendances
rm -rf node_modules
npm install
```

### Firebase ne fonctionne pas
1. Vérifiez `config/firebase.ts`
2. Vérifiez `google-services.json`
3. Utilisez l'outil de test : Profil → "🔧 Tester Configuration Firebase"

### Les images ne s'affichent pas
- Vérifiez les URLs
- Vérifiez la connexion internet
- Vérifiez les permissions Storage dans Firebase

### L'app crash
1. Vérifiez les logs : `npx expo start`
2. Cherchez les erreurs en rouge
3. Consultez TROUBLESHOOTING.md

### Je ne peux pas me connecter
1. Vérifiez que Authentication est activé dans Firebase
2. Vérifiez que Email/Password est activé
3. Vérifiez votre connexion internet

---

## 💰 Coûts

### Combien coûte l'app ?
**Gratuit pour commencer !**
- Firebase : Gratuit (plan Spark)
- Expo : Gratuit
- Vercel/Netlify : Gratuit
- Développement : Gratuit

### Quand devrai-je payer ?
Seulement si vous dépassez les limites gratuites :
- Firebase : 10 000 utilisateurs actifs/mois
- Vercel : 100 GB de bande passante/mois
- Google Play : 25$ (une fois)

### Combien coûte Firebase au-delà du gratuit ?
Plan Blaze (pay as you go) :
- ~0.06$ par 100 000 lectures
- ~0.18$ par 100 000 écritures
- ~0.026$ par GB de stockage

Pour 1000 utilisateurs actifs : ~5-10$/mois

---

## 📊 Performance

### L'app est-elle rapide ?
Oui ! Optimisations incluses :
- Cache local
- Chargement lazy
- Images optimisées
- Code minifié

### Combien d'utilisateurs l'app peut-elle gérer ?
Avec Firebase :
- Plan gratuit : 10 000 utilisateurs actifs/mois
- Plan payant : Illimité (scalable)

### L'app consomme-t-elle beaucoup de données ?
Non. Optimisations :
- Images compressées
- Cache local
- Requêtes optimisées

---

## 🔐 Sécurité

### Les mots de passe sont-ils sécurisés ?
Oui ! Firebase utilise :
- Hachage bcrypt
- Salage automatique
- Chiffrement en transit

### Puis-je activer l'authentification à deux facteurs ?
Oui, Firebase supporte la 2FA. Consultez la documentation Firebase pour l'activer.

### Les données sont-elles chiffrées ?
Oui :
- En transit (HTTPS)
- Au repos (chiffrement Firebase)

### Comment protéger contre les attaques ?
Firebase inclut :
- Protection DDoS
- Rate limiting
- Règles de sécurité
- Validation des données

---

## 📚 Apprentissage

### Je ne connais pas React Native
Pas de problème ! Ressources :
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- Tutoriels YouTube

### Je ne connais pas Firebase
Pas de problème ! Ressources :
- [Firebase Docs](https://firebase.google.com/docs)
- Guides dans ce projet
- Tutoriels YouTube

### Où apprendre plus ?
- Documentation officielle
- YouTube
- Stack Overflow
- Discord/Reddit communautés

---

## 🎯 Prochaines étapes

### Que faire après la configuration ?
1. Tester toutes les fonctionnalités
2. Créer des événements de test
3. Inviter des amis à tester
4. Collecter des retours
5. Améliorer l'app

### Comment ajouter des fonctionnalités ?
1. Planifier la fonctionnalité
2. Modifier le code
3. Tester localement
4. Déployer

### Comment obtenir des utilisateurs ?
1. Réseaux sociaux (Instagram, Facebook)
2. Bouche-à-oreille
3. Événements locaux
4. Partenariats avec restaurants

---

## 📞 Support

### Où obtenir de l'aide ?
1. **TROUBLESHOOTING.md** - Solutions aux problèmes
2. **Documentation** - Guides détaillés
3. **Support** - contact@lesdinersparisiens.fr

### Puis-je contribuer au projet ?
Oui ! Le code est modifiable. Vous pouvez :
- Corriger des bugs
- Ajouter des fonctionnalités
- Améliorer le design
- Traduire l'app

---

**D'autres questions ? Consultez les guides ou contactez le support ! 📧**

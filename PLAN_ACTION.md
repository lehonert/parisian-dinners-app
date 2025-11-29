
# 📋 Plan d'Action - Étape par Étape

Suivez ce plan dans l'ordre pour avoir votre app fonctionnelle rapidement.

---

## 🎯 Objectif

Avoir une application **Les Dîners Parisiens** 100% fonctionnelle sur Android et Web.

**Temps estimé : 30 minutes**

---

## ✅ Phase 1 : Configuration Firebase (10 minutes)

### Étape 1.1 : Créer le projet Firebase (2 min)
- [ ] Aller sur https://console.firebase.google.com/
- [ ] Cliquer sur "Ajouter un projet"
- [ ] Nom : "Les Dîners Parisiens"
- [ ] Désactiver Google Analytics (optionnel)
- [ ] Créer le projet

**📍 Vous êtes ici :** Projet Firebase créé

---

### Étape 1.2 : Activer Authentication (2 min)
- [ ] Menu de gauche → Authentication
- [ ] Cliquer sur "Commencer"
- [ ] Onglet "Sign-in method"
- [ ] Activer "Email/Password"
- [ ] Enregistrer

**📍 Vous êtes ici :** Authentication activé

---

### Étape 1.3 : Activer Firestore (2 min)
- [ ] Menu de gauche → Firestore Database
- [ ] Cliquer sur "Créer une base de données"
- [ ] Choisir "Commencer en mode test"
- [ ] Région : "europe-west"
- [ ] Activer

**📍 Vous êtes ici :** Firestore activé

---

### Étape 1.4 : Activer Storage (1 min)
- [ ] Menu de gauche → Storage
- [ ] Cliquer sur "Commencer"
- [ ] Choisir "Commencer en mode test"
- [ ] Suivant → OK

**📍 Vous êtes ici :** Storage activé

---

### Étape 1.5 : Configurer Android (2 min)
- [ ] Paramètres du projet (icône engrenage)
- [ ] Cliquer sur l'icône Android
- [ ] Package : `com.LDP.LesDinersParisiens`
- [ ] Enregistrer l'application
- [ ] Télécharger `google-services.json`
- [ ] Remplacer le fichier à la racine du projet

**📍 Vous êtes ici :** Android configuré

---

### Étape 1.6 : Configurer Web (1 min)
- [ ] Paramètres du projet
- [ ] Cliquer sur l'icône Web (`</>`)
- [ ] Nom : "Les Dîners Parisiens Web"
- [ ] Enregistrer l'application
- [ ] Copier la configuration `firebaseConfig`
- [ ] Ouvrir `config/firebase.ts`
- [ ] Remplacer les valeurs
- [ ] Enregistrer le fichier

**📍 Vous êtes ici :** Web configuré

---

## ✅ Phase 2 : Configuration des règles (5 minutes)

### Étape 2.1 : Règles Firestore (3 min)
- [ ] Firebase Console → Firestore Database
- [ ] Onglet "Règles"
- [ ] Copier les règles depuis `GUIDE_FINALISATION.md`
- [ ] Coller dans l'éditeur
- [ ] Cliquer sur "Publier"

**📍 Vous êtes ici :** Règles Firestore configurées

---

### Étape 2.2 : Règles Storage (2 min)
- [ ] Firebase Console → Storage
- [ ] Onglet "Règles"
- [ ] Vérifier que les règles de test sont actives
- [ ] (Optionnel) Personnaliser les règles

**📍 Vous êtes ici :** Règles Storage configurées

---

## ✅ Phase 3 : Test de l'application (10 minutes)

### Étape 3.1 : Installer les dépendances (2 min)
```bash
npm install
```
- [ ] Attendre la fin de l'installation
- [ ] Vérifier qu'il n'y a pas d'erreurs

**📍 Vous êtes ici :** Dépendances installées

---

### Étape 3.2 : Lancer l'app (2 min)

**Sur Android :**
```bash
npm run android
```

**Sur Web :**
```bash
npm run web
```

- [ ] Attendre que l'app se lance
- [ ] Vérifier que l'écran d'accueil s'affiche

**📍 Vous êtes ici :** App lancée

---

### Étape 3.3 : Test de configuration Firebase (2 min)
- [ ] Dans l'app, aller dans "Profil" (onglet du bas)
- [ ] Cliquer sur "🔧 Tester Configuration Firebase"
- [ ] Cliquer sur "Lancer les tests"
- [ ] Vérifier que tous les tests sont verts ✓

**📍 Vous êtes ici :** Firebase testé et fonctionnel

---

### Étape 3.4 : Créer un compte (2 min)
- [ ] Sur l'écran d'accueil, cliquer sur "Créer un compte"
- [ ] Entrer un email et un mot de passe
- [ ] Cliquer sur "S'inscrire"
- [ ] Configurer le profil (nom, photo, bio)
- [ ] Enregistrer

**📍 Vous êtes ici :** Compte créé

---

### Étape 3.5 : Tester la navigation (2 min)
- [ ] Aller dans "Événements"
- [ ] Aller dans "Mes inscriptions"
- [ ] Aller dans "Profil"
- [ ] Modifier le profil
- [ ] Se déconnecter
- [ ] Se reconnecter

**📍 Vous êtes ici :** Navigation testée

---

## ✅ Phase 4 : Configuration Admin (5 minutes)

### Étape 4.1 : Devenir admin (3 min)
- [ ] Aller dans Firebase Console
- [ ] Firestore Database → Données
- [ ] Collection "users"
- [ ] Trouver votre document (votre UID)
- [ ] Cliquer sur "Ajouter un champ"
  - Nom : `isAdmin`
  - Type : `boolean`
  - Valeur : `true`
- [ ] Mettre à jour

**📍 Vous êtes ici :** Vous êtes admin

---

### Étape 4.2 : Tester les fonctions admin (2 min)
- [ ] Redémarrer l'app
- [ ] Vérifier que l'onglet "Admin" apparaît
- [ ] Aller dans "Admin"
- [ ] Cliquer sur "Créer un événement"
- [ ] Remplir le formulaire
- [ ] Créer l'événement
- [ ] Vérifier qu'il apparaît dans "Événements"

**📍 Vous êtes ici :** Fonctions admin testées

---

## ✅ Phase 5 : Test complet (10 minutes)

### Étape 5.1 : Test des événements (3 min)
- [ ] Créer 2-3 événements de test
- [ ] Voir la liste des événements
- [ ] Cliquer sur un événement
- [ ] Voir les détails
- [ ] S'inscrire à un événement
- [ ] Vérifier dans "Mes inscriptions"
- [ ] Se désinscrire

**📍 Vous êtes ici :** Événements testés

---

### Étape 5.2 : Test des avis (2 min)
- [ ] Créer un événement passé (date dans le passé)
- [ ] S'inscrire à cet événement
- [ ] Aller dans les détails de l'événement
- [ ] Laisser un avis (note + commentaire)
- [ ] Vérifier que l'avis apparaît

**📍 Vous êtes ici :** Avis testés

---

### Étape 5.3 : Test du profil (2 min)
- [ ] Aller dans "Profil"
- [ ] Modifier le profil
- [ ] Changer la photo
- [ ] Modifier la bio
- [ ] Enregistrer
- [ ] Vérifier les changements

**📍 Vous êtes ici :** Profil testé

---

### Étape 5.4 : Test sur différentes plateformes (3 min)

**Si vous avez testé sur Android :**
- [ ] Lancer sur Web : `npm run web`
- [ ] Tester les mêmes fonctionnalités
- [ ] Vérifier que tout fonctionne

**Si vous avez testé sur Web :**
- [ ] Lancer sur Android : `npm run android`
- [ ] Tester les mêmes fonctionnalités
- [ ] Vérifier que tout fonctionne

**📍 Vous êtes ici :** Multi-plateforme testé

---

## 🎉 Phase 6 : Finalisation (optionnel)

### Étape 6.1 : Personnalisation (optionnel)
- [ ] Changer les couleurs dans `styles/commonStyles.ts`
- [ ] Ajouter votre logo
- [ ] Personnaliser les textes

---

### Étape 6.2 : Build Android (optionnel)
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```
- [ ] Attendre le build (15-30 min)
- [ ] Télécharger l'APK
- [ ] Installer sur un appareil

---

### Étape 6.3 : Déploiement Web (optionnel)
```bash
npm run build:web
npm run deploy:vercel
```
- [ ] Attendre le déploiement
- [ ] Tester l'URL de production
- [ ] Partager le lien

---

## ✅ Checklist finale

Avant de considérer l'app comme terminée, vérifiez :

### Fonctionnalités de base
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Déconnexion fonctionne
- [ ] Mot de passe oublié fonctionne
- [ ] Modification du profil fonctionne

### Événements
- [ ] Liste des événements s'affiche
- [ ] Détails d'un événement s'affichent
- [ ] Inscription à un événement fonctionne
- [ ] Désinscription fonctionne
- [ ] Liste d'attente fonctionne (si événement complet)

### Avis
- [ ] Laisser un avis fonctionne
- [ ] Voir les avis fonctionne
- [ ] Note moyenne se calcule correctement

### Admin
- [ ] Créer un événement fonctionne
- [ ] Modifier un événement fonctionne
- [ ] Supprimer un événement fonctionne
- [ ] Voir les participants fonctionne

### Technique
- [ ] Pas d'erreurs dans la console
- [ ] Navigation fluide
- [ ] Images se chargent
- [ ] Données se sauvegardent
- [ ] Fonctionne sur Android
- [ ] Fonctionne sur Web

---

## 📊 Progression

Mettez à jour au fur et à mesure :

```
Phase 1 : Configuration Firebase      [░░░░░░░░░░] 0%
Phase 2 : Configuration des règles    [░░░░░░░░░░] 0%
Phase 3 : Test de l'application       [░░░░░░░░░░] 0%
Phase 4 : Configuration Admin         [░░░░░░░░░░] 0%
Phase 5 : Test complet                [░░░░░░░░░░] 0%
Phase 6 : Finalisation                [░░░░░░░░░░] 0%

TOTAL                                 [░░░░░░░░░░] 0%
```

---

## 🎯 Prochaines actions

Une fois tout terminé :

1. **Inviter des utilisateurs de test**
   - Amis
   - Famille
   - Collègues

2. **Collecter des retours**
   - Qu'est-ce qui fonctionne bien ?
   - Qu'est-ce qui pourrait être amélioré ?
   - Quelles fonctionnalités manquent ?

3. **Itérer**
   - Corriger les bugs
   - Ajouter des fonctionnalités
   - Améliorer l'UX

4. **Lancer officiellement**
   - Publier sur Google Play
   - Déployer le site web
   - Communiquer sur les réseaux sociaux

---

## 📞 Besoin d'aide ?

Si vous êtes bloqué à une étape :

1. **Consultez le guide correspondant**
   - DEMARRAGE_RAPIDE.md
   - GUIDE_FINALISATION.md
   - TROUBLESHOOTING.md

2. **Utilisez les outils de test**
   - Test de configuration Firebase
   - Test d'authentification

3. **Contactez le support**
   - Email : contact@lesdinersparisiens.fr
   - WhatsApp : +33 6 12 34 56 78

---

**Bon courage ! Vous allez y arriver ! 💪**

**Temps estimé restant : 30 minutes**

**Commencez maintenant ! 🚀**

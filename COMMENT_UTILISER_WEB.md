
# 🌐 Comment Utiliser l'Application sur Internet

## Pour les Utilisateurs 👥

### Accéder à l'Application

Ouvrez simplement votre navigateur web (Chrome, Firefox, Safari, Edge) et allez à l'adresse :

**https://votre-site.vercel.app**

C'est tout ! Aucune installation nécessaire.

---

### Installer comme Application (Optionnel)

Vous pouvez installer l'application sur votre appareil pour y accéder plus facilement :

#### Sur Ordinateur (Windows/Mac/Linux)
1. Ouvrez le site dans Chrome ou Edge
2. Regardez dans la barre d'adresse, vous verrez une icône d'installation ⊕
3. Cliquez dessus et sélectionnez "Installer"
4. L'application apparaîtra comme une application normale sur votre ordinateur

#### Sur iPhone/iPad
1. Ouvrez le site dans Safari
2. Appuyez sur le bouton "Partager" (carré avec flèche vers le haut)
3. Faites défiler et sélectionnez "Sur l'écran d'accueil"
4. Appuyez sur "Ajouter"
5. L'icône apparaîtra sur votre écran d'accueil

#### Sur Android
1. Ouvrez le site dans Chrome
2. Appuyez sur le menu (trois points verticaux)
3. Sélectionnez "Installer l'application" ou "Ajouter à l'écran d'accueil"
4. Confirmez l'installation

---

### Utilisation Hors Ligne

Après votre première visite, l'application fonctionnera même sans connexion Internet !

Les données seront synchronisées automatiquement quand vous serez de nouveau en ligne.

---

## Pour le Propriétaire de l'Application 🔧

### Tester Localement

```bash
# Ouvrir un terminal dans le dossier du projet
cd chemin/vers/les-diners-parisiens

# Installer les dépendances (première fois seulement)
npm install

# Lancer l'application web
npm run web
```

L'application s'ouvrira automatiquement dans votre navigateur à l'adresse :
**http://localhost:8081**

---

### Déployer sur Internet

#### Méthode Recommandée : Vercel (Gratuit et Simple)

1. **Créer un compte Vercel**
   - Allez sur https://vercel.com
   - Cliquez sur "Sign Up"
   - Connectez-vous avec votre compte GitHub

2. **Pousser votre code sur GitHub**
   ```bash
   # Dans le terminal, dans le dossier du projet
   git init
   git add .
   git commit -m "Version initiale"
   
   # Créez un nouveau repository sur GitHub
   # Puis exécutez (remplacez par votre URL GitHub) :
   git remote add origin https://github.com/votre-nom/les-diners-parisiens.git
   git push -u origin main
   ```

3. **Déployer sur Vercel**
   - Sur Vercel, cliquez sur "New Project"
   - Sélectionnez votre repository GitHub
   - Cliquez sur "Deploy"
   - Attendez 2-3 minutes
   - ✅ Votre site est en ligne !

4. **Obtenir l'URL**
   - Vercel vous donnera une URL comme : `https://les-diners-parisiens.vercel.app`
   - Partagez cette URL avec vos utilisateurs !

---

### Configurer Firebase pour le Web

**Important** : Pour que l'authentification fonctionne sur votre site en ligne :

1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet "Les Dîners Parisiens"
3. Dans le menu, cliquez sur "Authentication"
4. Allez dans l'onglet "Settings" (Paramètres)
5. Cliquez sur "Authorized domains" (Domaines autorisés)
6. Cliquez sur "Add domain" (Ajouter un domaine)
7. Ajoutez votre domaine Vercel (ex: `les-diners-parisiens.vercel.app`)
8. Cliquez sur "Add" (Ajouter)

✅ C'est fait ! L'authentification fonctionnera maintenant sur votre site.

---

### Utiliser un Nom de Domaine Personnalisé (Optionnel)

Si vous voulez utiliser votre propre nom de domaine (ex: lesdinersparisiens.com) :

1. **Acheter un domaine** (~10-15€/an)
   - Recommandé : Namecheap, OVH, Google Domains

2. **Configurer dans Vercel**
   - Dans Vercel Dashboard, allez dans "Settings"
   - Cliquez sur "Domains"
   - Cliquez sur "Add"
   - Entrez votre nom de domaine
   - Suivez les instructions pour configurer les DNS

3. **Ajouter dans Firebase**
   - Retournez dans Firebase Console
   - Authentication > Settings > Authorized domains
   - Ajoutez votre nouveau domaine

---

## Questions Fréquentes ❓

### L'application fonctionne-t-elle sur tous les navigateurs ?
Oui ! Chrome, Firefox, Safari, Edge, Opera sont tous supportés.

### Dois-je payer pour héberger l'application ?
Non ! Vercel offre un hébergement gratuit illimité pour les projets personnels.

### Les utilisateurs doivent-ils installer quelque chose ?
Non ! Ils peuvent utiliser l'application directement dans leur navigateur.
L'installation est optionnelle mais recommandée pour une meilleure expérience.

### L'application fonctionne-t-elle hors ligne ?
Oui ! Après la première visite, l'application fonctionne sans connexion Internet.

### Comment mettre à jour l'application ?
Poussez simplement vos modifications sur GitHub, Vercel déploiera automatiquement la nouvelle version.

### Puis-je utiliser l'application sur mobile et ordinateur ?
Oui ! L'application s'adapte automatiquement à toutes les tailles d'écran.

---

## Besoin d'Aide ? 🆘

Consultez les guides détaillés :
- `QUICK_START_WEB.md` - Guide de démarrage rapide
- `DEPLOYMENT_WEB.md` - Guide de déploiement complet

---

**Bon appétit ! 🍷**

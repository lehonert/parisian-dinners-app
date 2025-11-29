
# 🚀 Étapes Rapides - Mise en Route

## Pour commencer MAINTENANT (5 minutes)

### 1️⃣ Configuration Firebase (2 minutes)

1. Allez sur https://console.firebase.google.com/
2. Créez un projet "Les Dîners Parisiens"
3. Activez **Authentication** (Email/Password)
4. Activez **Firestore Database** (mode test)
5. Activez **Storage**

### 2️⃣ Configuration Android (1 minute)

1. Dans Firebase, ajoutez une app Android
2. Package : `com.LDP.LesDinersParisiens`
3. Téléchargez `google-services.json`
4. Remplacez le fichier à la racine du projet

### 3️⃣ Configuration Web (2 minutes)

1. Dans Firebase, ajoutez une app Web
2. Copiez la configuration
3. Ouvrez `config/firebase.ts`
4. Remplacez les valeurs dans `firebaseConfig`

---

## 🧪 Test immédiat

```bash
# Android
npm run android

# Web
npm run web
```

---

## ✅ Vérification rapide

1. Créez un compte
2. Configurez votre profil
3. Vous êtes prêt !

---

## 🔑 Devenir Admin

1. Créez un compte
2. Allez dans Firebase Console → Firestore
3. Trouvez votre utilisateur dans `users`
4. Ajoutez le champ : `isAdmin: true`
5. Redémarrez l'app

---

## 📱 Build Android (optionnel)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

Vous recevrez un lien pour télécharger l'APK !

---

**C'est tout ! Votre app est fonctionnelle ! 🎉**

Pour plus de détails, consultez `GUIDE_FINALISATION.md`

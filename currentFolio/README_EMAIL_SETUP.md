# 📧 Configuration du Système d'Email - Portfolio Cyberpunk

## 🚀 Fonctionnalités

Votre portfolio cyberpunk dispose d'un système de notifications automatiques qui vous envoie un email à `lucas.bracq.pro+notifSite@gmail.com` dans les cas suivants :

- ✅ **Nouvelle visite** sur le portfolio
- ✅ **Clic sur "Initier Protocole d'Embauche"** (prospect intéressé !)
- ✅ **Consultation de la page contact**
- ✅ **Interactions** avec vos informations de contact
- ✅ **Clics** sur votre profil LinkedIn

## 🛠️ Configuration des Services d'Email

### Option 1: Formspree (Recommandé - Gratuit)

1. **Inscrivez-vous sur [Formspree](https://formspree.io/)**
2. **Créez un nouveau formulaire**
3. **Récupérez votre Form ID** (ex: `xqyqkqyq`)
4. **Modifiez `emailService.js`** :
   ```javascript
   this.emailEndpoint = 'https://formspree.io/f/VOTRE_FORM_ID';
   ```

### Option 2: EmailJS (Alternative)

1. **Inscrivez-vous sur [EmailJS](https://www.emailjs.com/)**
2. **Configurez un service email**
3. **Créez un template d'email**
4. **Ajoutez le script EmailJS** dans `index.html` et `contact.html` :
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   ```
5. **Modifiez `emailService.js`** avec vos IDs

### Option 3: Webhook Personnalisé

Si vous avez votre propre serveur, configurez l'URL du webhook dans `emailService.js`.

## 📋 Configuration Rapide (5 minutes)

### Étape 1: Formspree Setup
```bash
1. Allez sur https://formspree.io/
2. Créez un compte gratuit
3. Créez un nouveau formulaire
4. Notez votre Form ID (ex: xqyqkqyq)
```

### Étape 2: Modification du Code
```javascript
// Dans emailService.js, ligne 4 :
this.emailEndpoint = 'https://formspree.io/f/VOTRE_FORM_ID_ICI';
```

### Étape 3: Test
```bash
1. Ouvrez votre portfolio
2. Cliquez sur "Initier Protocole d'Embauche"
3. Vérifiez votre email lucas.bracq.pro+notifSite@gmail.com
```

## 🎯 Types de Notifications

### 🌐 Notification de Visite
```
🚨 NOUVELLE VISITE SUR VOTRE PORTFOLIO CYBERPUNK

📊 DÉTAILS DE LA CONNEXION:
🕐 Heure: 2024-01-15T14:30:45.123Z
🌍 Langue: fr
📱 Résolution: 1920x1080
🌐 Navigateur: Chrome/120.0.0.0
🔗 Référent: https://linkedin.com/in/lucas-mags-bracq/
```

### 🎯 Notification d'Intérêt d'Embauche
```
🎯 NOUVELLE INTERACTION SUR VOTRE PORTFOLIO

🔥 ACTION RÉALISÉE:
🎯 Clic sur "Initier Protocole d'Embauche"

🚨 ATTENTION: Un visiteur s'intéresse à votre embauche !
Ce pourrait être votre prochain employeur 🎉
```

### 📧 Notification de Contact
```
📧 NOUVEAU CONTACT DEPUIS VOTRE PORTFOLIO

👤 INFORMATIONS DU CONTACT:
📧 Email: recruteur@entreprise.com
💬 MESSAGE: Intéressé par votre profil...
```

## 🔧 Dépannage

### Problème: Les emails ne sont pas envoyés
1. **Vérifiez la console** du navigateur (F12)
2. **Vérifiez votre Form ID** Formspree
3. **Testez avec un autre service** (EmailJS)

### Problème: Emails en spam
1. **Ajoutez l'expéditeur** à votre liste blanche
2. **Vérifiez le dossier spam** de `lucas.bracq.pro+notifSite@gmail.com`

### Problème: Limite d'emails atteinte
- **Formspree gratuit** : 50 emails/mois
- **Solution** : Passer au plan payant ou utiliser EmailJS

## 📊 Monitoring

Les données sont aussi sauvegardées localement dans le navigateur :

```javascript
// Visualiser les visites
console.log(JSON.parse(localStorage.getItem('portfolio-visitors')));

// Visualiser les actions
console.log(JSON.parse(localStorage.getItem('portfolio-actions')));

// Visualiser les emails en attente
console.log(JSON.parse(localStorage.getItem('pending-emails')));
```

## 🚀 Déploiement

1. **Uploadez tous les fichiers** dans `/currentFolio/`
2. **Configurez votre service d'email**
3. **Testez** le système complet
4. **Activez les notifications** sur votre email

## 💡 Améliorations Futures

- 📊 Dashboard analytics en temps réel
- 🌍 Géolocalisation des visiteurs
- 📱 Notifications push
- 🤖 Chatbot intégré
- 📈 Statistiques détaillées

---

**🎮 Your Portfolio is Ready, Player One! 🎮**

Votre portfolio cyberpunk est maintenant équipé d'un système de surveillance digne du futur. Chaque interaction sera tracée et vous serez notifié en temps réel de l'intérêt des recruteurs !
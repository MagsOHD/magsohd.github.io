# 🌐 Portfolio Cyberpunk de Lucas Bracq - CyberDev 2084

## 🚀 Présentation

Portfolio cyberpunk futuriste avec système de notifications email automatiques, entièrement bilingue (FR/EN) et bourré d'easter eggs interactifs.

## 📊 Fonctionnalités

### 🌍 **Système Bilingue Complet**
- Toggle FR/EN en temps réel
- Sauvegarde automatique des préférences
- Tout le contenu traduit

### 📧 **Notifications Email Automatiques**
- Email instantané à `lucas.bracq.pro+notifSite@gmail.com` pour :
  - 👥 Nouvelles visites sur le portfolio
  - 🎯 Clics sur "Initier Protocole d'Embauche" (prospects intéressés !)
  - 📞 Interactions avec les coordonnées
  - 💼 Clics sur le profil LinkedIn
  - 📧 Utilisation des formulaires de contact

### 🎮 **Easter Eggs Interactifs**
- **Code Konami** : ↑↑↓↓←→←→BA (effet arc-en-ciel + explosion de particules)
- **Code "CYBER"** : Tapez "cyber" (effet hacking bleu)
- **Code "MATRIX"** : Tapez "matrix" (pluie de caractères Matrix)
- **Code "HACK"** : Tapez "hack" (clignotement rouge système compromis)
- **Code "LUCAS"** : Tapez "lucas" (salutation personnelle)
- **Double-clic sur le titre** : Glitch intense

### 📱 **Page de Contact Complète**
- **📞 Téléphone** : +33 7 83 31 30 81 (clic direct)
- **📧 Email** : lucas.bracq.pro@gmail.com (clic direct)
- **💼 LinkedIn** : https://www.linkedin.com/in/lucas-bracq-250a72190/
- **📍 Localisation** : 06190 Roquebrune Cap-Martin
- **🚗 Mobilité** : Permis B + véhicule personnel
- Boutons de copie instantanée pour téléphone et email

## 🛠️ Configuration Email (Solutions Gratuites)

### Option 1: Web3Forms (Recommandé - 100% Gratuit & Open Source)

```bash
1. Allez sur https://web3forms.com/
2. Entrez votre email: lucas.bracq.pro+notifSite@gmail.com
3. Cliquez sur "Create Access Key"
4. Copiez votre Access Key
5. Dans emailService.js, remplacez:
   this.web3formsKey = 'VOTRE_ACCESS_KEY_ICI';
```

**✅ Avantages Web3Forms :**
- Entièrement gratuit à vie
- Open source
- Aucune limite d'emails
- Configuration en 2 minutes
- Pas de compte requis

### Option 2: EmailJS (Alternatif - 200 emails/mois gratuits)

```bash
1. Créez un compte sur https://www.emailjs.com/
2. Configurez un service email
3. Créez un template
4. Ajoutez le script EmailJS dans vos pages HTML
5. Configurez les IDs dans emailService.js
```

## 📁 Structure des Fichiers

```
currentFolio/
├── index.html              # Portfolio principal
├── contact.html             # Page de contact détaillée
├── emailService.js          # Service d'envoi d'emails
├── test.html               # Page de test du système
├── README.md               # Cette documentation
└── README_EMAIL_SETUP.md   # Guide détaillé d'email
```

## 🎯 Types de Notifications Email

### 🌐 Notification de Visite
```
🚨 NOUVELLE VISITE SUR VOTRE PORTFOLIO CYBERPUNK

📊 DÉTAILS DE LA CONNEXION:
🕐 Heure: 2024-XX-XX
🌍 Langue: fr/en
📱 Résolution: 1920x1080
🌐 Navigateur: Chrome/Edge/Firefox...
🔗 Référent: LinkedIn/Google/Direct...
```

### 🎯 Notification d'Intérêt d'Embauche (IMPORTANT !)
```
🎯 NOUVELLE INTERACTION SUR VOTRE PORTFOLIO

🔥 ACTION RÉALISÉE:
🎯 Clic sur "Initier Protocole d'Embauche"

🚨 ATTENTION: Un visiteur s'intéresse à votre embauche !
Ce pourrait être votre prochain employeur 🎉

ACTIONS RECOMMANDÉES:
• Vérifiez votre email principal
• Consultez votre profil LinkedIn
• Préparez-vous pour un contact potentiel
```

### 📧 Autres Interactions
- 💼 Clics sur le profil LinkedIn
- 📱 Copie du numéro de téléphone
- 📧 Copie de l'adresse email
- 📞 Demandes de programmation d'appel

## 🎮 Guide des Easter Eggs

| Code | Action | Effet |
|------|--------|-------|
| ↑↑↓↓←→←→BA | Code Konami | Arc-en-ciel + explosion particules |
| "cyber" | Taper au clavier | Effet hacking bleu |
| "matrix" | Taper au clavier | Pluie de caractères Matrix |
| "hack" | Taper au clavier | Clignotement rouge alarme |
| "lucas" | Taper au clavier | Salutation personnelle |
| Double-clic titre | Clic sur "LUCAS BRACQ" | Glitch intense |

## 🚀 Déploiement Rapide

### Étape 1: Configuration Email (5 minutes)
```bash
1. Configurez Web3Forms (recommandé)
2. Testez avec currentFolio/test.html
3. Vérifiez la réception des emails
```

### Étape 2: Upload
```bash
1. Uploadez le dossier currentFolio/
2. Accès: https://votre-domaine.com/currentFolio/
3. Test final des notifications
```

### Étape 3: Monitoring
```bash
# Console du navigateur (F12)
console.log(JSON.parse(localStorage.getItem('portfolio-visitors')));
console.log(JSON.parse(localStorage.getItem('portfolio-actions')));
```

## 🔧 Outils de Debug

### Page de Test
Accédez à `currentFolio/test.html` pour :
- ✅ Tester l'envoi d'emails
- 📊 Visualiser les données stockées
- ⚙️ Configurer les services
- 🧪 Simuler différentes actions

### Console JavaScript
```javascript
// Visualiser les visiteurs
window.emailService.checkConfiguration();

// Forcer l'envoi d'un email de test
window.emailService.sendVisitorNotification({
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    language: 'fr',
    screenResolution: '1920x1080',
    referrer: 'Test Manuel'
});
```

## 📊 Statistiques en Temps Réel

Le système enregistre automatiquement :
- 🕐 Horodatage de chaque visite
- 🌐 Navigateur et OS des visiteurs
- 📱 Résolution d'écran
- 🔗 Site de provenance (LinkedIn, Google, etc.)
- 🌍 Langue préférée
- 🎯 Actions spécifiques (contact, embauche, etc.)

## 🛡️ Sécurité & Confidentialité

- ✅ Aucune donnée personnelle des visiteurs n'est stockée
- ✅ Seules les métadonnées techniques sont enregistrées
- ✅ Stockage local seulement (pas de serveur externe)
- ✅ Conformité RGPD européenne
- ✅ Services email gratuits et sécurisés

## 🎨 Personnalisation

### Couleurs Cyberpunk
```css
:root {
    --neon-cyan: #00fff9;
    --neon-magenta: #ff00ff;
    --neon-orange: #ff6b00;
    --neon-green: #39ff14;
}
```

### Ajouter de Nouveaux Easter Eggs
```javascript
// Dans index.html
if (typedSequence.includes('votreCode')) {
    activateVotreEasterEgg();
    typedSequence = '';
}
```

## 🚨 Support & Dépannage

### Problème: Emails non reçus
1. Vérifiez la configuration dans `emailService.js`
2. Consultez la console (F12) pour les erreurs
3. Testez avec `test.html`
4. Vérifiez vos spams

### Problème: Easter eggs non fonctionnels
1. Ouvrez la console (F12)
2. Vérifiez les erreurs JavaScript
3. Testez dans un onglet privé

### Problème: Langue non sauvegardée
1. Vérifiez que localStorage est activé
2. Testez dans un autre navigateur

## 📞 Contact

**Lucas Bracq - Développeur Fullstack**
- 📧 Email: lucas.bracq.pro@gmail.com
- 📱 Téléphone: +33 7 83 31 30 81
- 💼 LinkedIn: https://www.linkedin.com/in/lucas-bracq-250a72190/
- 📍 Localisation: 06190 Roquebrune Cap-Martin

---

**🎮 Ready Player One - Portfolio Cyberpunk 2084 🎮**

*Ce portfolio utilise des technologies web modernes pour créer une expérience immersive digne du futur. Chaque interaction est pensée pour impressionner les recruteurs tout en fournissant des insights précieux sur l'engagement des visiteurs.*
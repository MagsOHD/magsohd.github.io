# 📧 Guide de Test - Email Automatique

## 🎯 Objectif
Vérifier que **chaque nouvelle visite** sur ton portfolio envoie automatiquement un email à `lucas.bracq.pro+notifSite@gmail.com`

## ⚡ Configuration Rapide (2 minutes)

### Étape 1 : Configurer Web3Forms
```bash
1. Allez sur https://web3forms.com/
2. Entrez votre email: lucas.bracq.pro+notifSite@gmail.com
3. Cliquez "Create Access Key"
4. Copiez la clé générée (ex: abc123def456)
```

### Étape 2 : Modifier emailService.js
```javascript
// Ligne 5 dans emailService.js
this.web3formsKey = 'VOTRE_CLE_WEB3FORMS_ICI';
```

## 🧪 Tests à Effectuer

### Test 1 : Page de Test Dédiée
```bash
1. Ouvrez: currentFolio/test-auto-email.html
2. Regardez le countdown (5 secondes)
3. Vérifiez les logs en temps réel
4. Status attendu: "✅ Email envoyé via web3forms"
```

### Test 2 : Portfolio Principal
```bash
1. Ouvrez: currentFolio/index.html
2. Ouvrez la console (F12)
3. Cherchez: "🎉 EMAIL ENVOYÉ AVEC SUCCÈS"
4. Notification: "✅ Notification envoyée à Lucas !"
```

### Test 3 : Page Contact
```bash
1. Ouvrez: currentFolio/contact.html
2. Vérifiez logs console
3. Double notification possible (page + contact)
```

### Test 4 : Nouvelle Session
```bash
1. Ouvrez navigation privée/incognito
2. Visitez le portfolio
3. Chaque nouvel onglet privé = nouvel email
```

## 🔍 Vérifications Console

### ✅ Logs de Succès Attendus :
```
🚀 Page chargée - Initialisation du tracking visiteur...
🎯 trackVisitor() appelé
📊 Données visiteur créées: {timestamp: "...", userAgent: "..."}
💾 Données sauvegardées localement
📧 Tentative d'envoi email automatique...
✅ EmailService disponible, envoi en cours...
🎉 EMAIL ENVOYÉ AVEC SUCCÈS via web3forms!
✅ Tracking visiteur terminé
```

### ❌ Erreurs Possibles :
```
❌ EmailService non disponible!
⚠️ Web3Forms non configuré ou erreur
❌ Erreur envoi email: [détails]
```

## 📧 Email Reçu - Contenu Attendu

```
🌐 NOUVELLE VISITE SUR VOTRE PORTFOLIO CYBERPUNK

📊 DÉTAILS DE LA CONNEXION:
━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 Heure: 2024-XX-XX
🌍 Langue: fr
📱 Résolution: 1920x1080
🌐 Navigateur: Chrome/119.0.0.0
🔗 Référent: Direct/Google/LinkedIn
🌍 Fuseau horaire: Europe/Paris
📍 Page: https://votre-site.com/currentFolio/

💻 INFORMATIONS TECHNIQUES:
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 User Agent: Mozilla/5.0...
📍 URL complète: https://...
🔍 Référent complet: ...

---
🤖 Notification automatique du système de tracking
Portfolio Cyberpunk - Lucas Bracq CyberDev
📧 Email: lucas.bracq.pro@gmail.com
📱 Tel: +33 7 83 31 30 81
💼 LinkedIn: https://www.linkedin.com/in/lucas-bracq-250a72190/
```

## 🛠️ Dépannage

### Problème : Pas d'email reçu

#### 1. Vérifier la Configuration
```bash
# Dans la console
emailService.checkConfiguration()
# Doit retourner: { web3forms: true, ... }
```

#### 2. Vérifier la Clé Web3Forms
```bash
# Dans emailService.js ligne 5
this.web3formsKey = 'abc123...'; // Pas 'YOUR_WEB3FORMS_ACCESS_KEY'
```

#### 3. Test Manuel
```bash
# Dans la console
emailService.sendVisitorNotification({
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    language: 'fr',
    referrer: 'Test manuel'
});
```

### Problème : Erreur CORS
```bash
# Vérifiez que vous testez sur un serveur (http://localhost)
# Pas en ouvrant le fichier directement (file://)
```

### Problème : Session déjà trackée
```bash
# Dans la console
sessionStorage.clear();
# Puis rechargez la page
```

## 📊 Monitoring en Temps Réel

### Voir les Visiteurs Stockés :
```javascript
console.log(JSON.parse(localStorage.getItem('portfolio-visitors')));
```

### Voir les Emails en Attente :
```javascript
console.log(JSON.parse(localStorage.getItem('pending-emails')));
```

### Rapport d'Erreurs :
```javascript
getPortfolioErrorReport();
```

## 🎯 Scénarios de Test Complets

### Scénario 1 : Premier Visiteur
1. Navigation privée → portfolio
2. Email reçu immédiatement
3. Fermer onglet → rouvrir
4. Pas de nouvel email (même session)

### Scénario 2 : Visiteur Récurrent
1. Nouvelle session (fermer navigateur)
2. Rouvrir → portfolio
3. Nouvel email reçu

### Scénario 3 : Différentes Pages
1. Aller sur contact.html directement
2. Email "page: contact" reçu
3. Puis aller sur index.html
4. Pas de doublon (session trackée)

## 🚀 Résultats Attendus

- ✅ **1 email par nouvelle session** de navigation
- ✅ **Détails complets** du visiteur dans l'email
- ✅ **Temps de réponse** < 5 secondes
- ✅ **Fallback automatique** si Web3Forms échoue
- ✅ **Pas de spam** (1 email max par session)

## 📞 Si Problème Persiste

1. **Vérifiez vos spams** dans lucas.bracq.pro+notifSite@gmail.com
2. **Testez avec test-auto-email.html** pour debug détaillé
3. **Consultez la console** pour erreurs JavaScript
4. **Utilisez navigation privée** pour simuler nouveaux visiteurs

---

**🎮 Votre portfolio cyberpunk surveille maintenant chaque connexion ! 🎮**
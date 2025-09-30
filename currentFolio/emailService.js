// Service d'envoi d'emails GRATUIT et OPEN SOURCE pour les notifications
class EmailService {
    constructor() {
        // Web3Forms - Entièrement gratuit et open source
        // Multiple sources pour la clé
        this.web3formsKey = this.getWeb3FormsKey();
        this.notificationEmail = 'lucas.bracq.pro@gmail.com';

        // Configuration des timeouts et retry
        this.fetchTimeout = 10000; // 10 secondes
        this.maxRetries = 3;
    }

    // Récupérer la clé Web3Forms depuis plusieurs sources
    getWeb3FormsKey() {
        // Source 1: Variable globale injectée par le workflow
        if (typeof window !== 'undefined' && window.WEB3FORMSKEY && window.WEB3FORMSKEY !== 'YOUR_WEB3FORMS_KEY') {
            console.log('🔑 Clé Web3Forms trouvée via window.WEB3FORMSKEY');
            return window.WEB3FORMSKEY;
        }

        // Source 2: Meta tag injecté par le workflow
        if (typeof document !== 'undefined') {
            const metaKey = document.querySelector('meta[name="web3forms-key"]');
            if (metaKey && metaKey.content && metaKey.content !== 'YOUR_WEB3FORMS_KEY') {
                console.log('🔑 Clé Web3Forms trouvée via meta tag');
                return metaKey.content;
            }
        }

        // Source 3: Variable d'environnement injectée dans le HTML
        if (typeof window !== 'undefined' && window.WEB3FORMS_CONFIG && window.WEB3FORMS_CONFIG.key) {
            console.log('🔑 Clé Web3Forms trouvée via WEB3FORMS_CONFIG');
            return window.WEB3FORMS_CONFIG.key;
        }

        // Fallback: placeholder pour développement local
        console.warn('⚠️ Utilisation du placeholder Web3Forms - fonctionnalité limitée');
        return 'YOUR_WEB3FORMS_KEY';
    }

    // Envoyer notification de visite
    async sendVisitorNotification(visitorData) {
        try {
            // Validation des données
            if (!visitorData || typeof visitorData !== 'object') {
                throw new Error('Données visiteur invalides');
            }

            const subject = `🚨 Nouvelle visite sur votre portfolio cyberpunk`;
            const message = this.formatVisitorMessage(visitorData);

            return await this.sendEmail(subject, message, 'visitor_notification', visitorData);
        } catch (error) {
            console.error('Erreur sendVisitorNotification:', error);
            return { success: false, error: error.message };
        }
    }

    // Envoyer notification d'action
    async sendActionNotification(actionData) {
        try {
            // Validation des données
            if (!actionData || !actionData.action) {
                throw new Error('Données d\'action invalides');
            }

            const subject = `🎯 Nouvelle interaction sur votre portfolio - ${actionData.action}`;
            const message = this.formatActionMessage(actionData);

            return await this.sendEmail(subject, message, 'action_notification', actionData);
        } catch (error) {
            console.error('Erreur sendActionNotification:', error);
            return { success: false, error: error.message };
        }
    }

    // Envoyer notification de contact
    async sendContactNotification(contactData) {
        try {
            // Validation des données
            if (!contactData || typeof contactData !== 'object') {
                throw new Error('Données de contact invalides');
            }

            const subject = `📧 Nouveau contact depuis votre portfolio`;
            const message = this.formatContactMessage(contactData);

            return await this.sendEmail(subject, message, 'contact_notification', contactData);
        } catch (error) {
            console.error('Erreur sendContactNotification:', error);
            return { success: false, error: error.message };
        }
    }

    // Méthode principale d'envoi d'email avec fallbacks gratuits
    async sendEmail(subject, message, type, data) {
        try {
            const timestamp = new Date().toISOString();

            // Validation des paramètres
            if (!subject || !message || !type) {
                throw new Error('Paramètres email manquants');
            }

            console.log(`📧 Tentative d'envoi d'email: ${type}`);

            // Web3Forms - Service principal
            const web3formsResult = await this.sendViaWeb3Forms(subject, message, data);
            if (web3formsResult && web3formsResult.success) {
                console.log('✅ Email envoyé avec succès via Web3Forms');
                return { success: true, service: 'web3forms' };
            } else {
                console.error('❌ Échec de l\'envoi via Web3Forms');
                return { success: false, service: 'web3forms', error: 'Échec Web3Forms' };
            }

        } catch (error) {
            console.error('Erreur critique dans sendEmail:', error);
            return { success: false, error: error.message };
        }
    }

    // Web3Forms - Service gratuit et open source
    // Valider la configuration Web3Forms
    async validateWeb3FormsKey() {
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: this.web3formsKey,
                    subject: 'Test de validation',
                    email: this.notificationEmail,
                    message: 'Test de validation de la clé Web3Forms',
                    from_name: 'Test System'
                })
            });

            const result = await response.json();
            return { valid: result.success, message: result.message };
        } catch (error) {
            return { valid: false, message: error.message };
        }
    }

    async sendViaWeb3Forms(subject, message, data) {
        if (!this.web3formsKey || this.web3formsKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
            throw new Error('Web3Forms non configuré - clé manquante');
        }

        // Vérifier que la clé semble valide (format UUID)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(this.web3formsKey)) {
            throw new Error('Clé Web3Forms invalide - format incorrect');
        }

        // Vérifier la connectivité internet
        if (!navigator.onLine) {
            throw new Error('Pas de connexion internet');
        }

        const payload = {
            access_key: this.web3formsKey,
            name: 'Portfolio Cyberpunk Notification System',
            email: this.notificationEmail,
            subject: subject,
            message: message
        };

        // Ajouter des informations supplémentaires dans le message
        if (data) {
            const metadata = {
                timestamp: new Date().toISOString(),
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
                pageUrl: typeof window !== 'undefined' ? window.location.href : 'Unknown',
                ...data
            };

            payload.message += '\n\n--- Informations techniques ---\n';
            payload.message += `Timestamp: ${metadata.timestamp}\n`;
            payload.message += `Page: ${metadata.pageUrl}\n`;
            payload.message += `User Agent: ${metadata.userAgent}\n`;

            // Ajouter d'autres données si disponibles
            if (data.screenResolution) {
                payload.message += `Résolution: ${data.screenResolution}\n`;
            }
            if (data.language) {
                payload.message += `Langue: ${data.language}\n`;
            }
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.fetchTimeout);

        try {
            console.log('📤 Envoi Web3Forms avec payload:', JSON.stringify(payload, null, 2));

            // Convertir en FormData pour une meilleure compatibilité Web3Forms
            const formData = new FormData();
            Object.keys(payload).forEach(key => {
                formData.append(key, payload[key]);
            });

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            console.log('📥 Réponse Web3Forms status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur réponse Web3Forms:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            console.log('📋 Résultat Web3Forms:', result);

            if (result.success) {
                console.log('✅ Web3Forms succès confirmé');
                return { success: true };
            } else {
                console.error('❌ Web3Forms échec:', result);
                throw new Error(result.message || 'Erreur Web3Forms inconnue');
            }
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('💥 Erreur Web3Forms complète:', error);

            if (error.name === 'AbortError') {
                throw new Error('Timeout Web3Forms (>10s)');
            }

            // Ajouter plus de détails sur l'erreur
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Erreur de connexion Web3Forms - Vérifiez votre connexion internet');
            }

            throw new Error(`Web3Forms: ${error.message}`);
        }
    }




    // Formater le message de notification de visiteur
    formatVisitorMessage(data) {
        const safeData = data || {};
        const currentUrl = typeof window !== 'undefined' ? window.location.href : 'Non disponible';

        return `🌐 NOUVELLE VISITE SUR VOTRE PORTFOLIO CYBERPUNK

📊 DÉTAILS DE LA CONNEXION:
━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 Heure: ${safeData.timestamp || new Date().toISOString()}
🌍 Langue: ${safeData.language || 'Non définie'}
📱 Résolution: ${safeData.screenResolution || 'Non définie'}
🌐 Navigateur: ${safeData.userAgent || 'Non défini'}
🔗 Référent: ${safeData.referrer || 'Accès direct'}
🌍 Fuseau horaire: ${safeData.timeZone || 'Non défini'}
📍 Page: ${currentUrl}

💻 INFORMATIONS TECHNIQUES:
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 User Agent: ${safeData.userAgent || 'Non disponible'}
📍 URL complète: ${currentUrl}
🔍 Référent complet: ${safeData.referrer || 'Aucun'}

---
🤖 Notification automatique du système de tracking
Portfolio Cyberpunk - Lucas Bracq CyberDev
📧 Email: lucas.bracq.pro@gmail.com
📱 Tel: +33 7 83 31 30 81
💼 LinkedIn: https://www.linkedin.com/in/lucas-bracq-250a72190/`;
    }

    // Formater le message de notification d'action
    formatActionMessage(data) {
        const safeData = data || {};
        const currentUrl = typeof window !== 'undefined' ? window.location.href : 'Non disponible';

        const actionNames = {
            'contact_page_visit': '👁️ Visite de la page contact',
            'quick_email': '📧 Clic sur "Envoyer Email Rapide"',
            'schedule_call': '📞 Demande de programmation d\'appel',
            'linkedin_click': '💼 Clic sur le profil LinkedIn',
            'phone_copy': '📱 Copie du numéro de téléphone',
            'email_copy': '📧 Copie de l\'adresse email',
            'hire_protocol': '🎯 Clic sur "Initier Protocole d\'Embauche"'
        };

        const actionName = actionNames[safeData.action] || safeData.action || 'Action inconnue';
        const isHireProtocol = safeData.action === 'hire_protocol';

        return `🎯 NOUVELLE INTERACTION SUR VOTRE PORTFOLIO

🔥 ACTION RÉALISÉE:
━━━━━━━━━━━━━━━━━━━━━━━━━━
${actionName}

📊 DÉTAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 Heure: ${safeData.timestamp || new Date().toISOString()}
🌍 Langue: ${safeData.language || 'Non définie'}
🌐 Navigateur: ${safeData.userAgent || 'Non défini'}
🔗 Page précédente: ${safeData.referrer || 'Accès direct'}
📍 Page actuelle: ${currentUrl}

${isHireProtocol ? `🚨 ATTENTION: Un visiteur s'intéresse à votre embauche !
Ce pourrait être votre prochain employeur 🎉

ACTIONS RECOMMANDÉES:
• Vérifiez votre email principal
• Consultez votre profil LinkedIn
• Préparez-vous pour un contact potentiel
` : ''}
---
🤖 Système de tracking des interactions
Portfolio Cyberpunk - Lucas Bracq CyberDev
📧 Contactez-moi: lucas.bracq.pro@gmail.com
📱 Appelez-moi: +33 7 83 31 30 81`;
    }

    // Formater le message de notification de contact
    formatContactMessage(data) {
        const safeData = data || {};
        const currentUrl = typeof window !== 'undefined' ? window.location.href : 'Non disponible';

        return `📧 NOUVEAU CONTACT DEPUIS VOTRE PORTFOLIO

👤 INFORMATIONS DU CONTACT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Nom: ${safeData.name || 'Non renseigné'}
📧 Email: ${safeData.email || 'Non renseigné'}
📱 Téléphone: ${safeData.phone || 'Non renseigné'}
🏢 Entreprise: ${safeData.company || 'Non renseignée'}

💬 MESSAGE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${safeData.message || 'Aucun message spécifique'}

📊 MÉTADONNÉES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 Heure: ${safeData.timestamp || new Date().toISOString()}
🌍 Langue: ${safeData.language || 'Non définie'}
🌐 Navigateur: ${safeData.userAgent || 'Non défini'}
📍 Page: ${currentUrl}

---
🤖 Formulaire de contact automatique
Portfolio Cyberpunk - Lucas Bracq CyberDev`;
    }



    // Vérifier la configuration avec validation
    checkConfiguration() {
        const config = {
            web3forms: this.web3formsKey && this.web3formsKey !== this.web3formsKey,
            fetch: typeof fetch !== 'undefined',
            online: navigator.onLine
        };

        console.log('📋 Configuration Web3Forms:', config);
        return config;
    }

    // Test simple d'envoi d'email
    async testEmailSending() {
        console.log('🧪 Test d\'envoi d\'email simple...');

        const testData = {
            timestamp: new Date().toISOString(),
            testMode: true,
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
        };

        try {
            const result = await this.sendVisitorNotification(testData);
            console.log('✅ Test réussi:', result);
            return result;
        } catch (error) {
            console.error('❌ Test échoué:', error);
            throw error;
        }
    }

}

// Instance globale du service avec protection
if (typeof window !== 'undefined') {
    window.emailService = new EmailService();
} else {
    // Environnement Node.js ou autre
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = EmailService;
    }
}

// Gestionnaire d'événements avec protection
if (typeof document !== 'undefined') {
    // Configuration au chargement de la page
    document.addEventListener('DOMContentLoaded', () => {
        if (window.emailService) {
            // Afficher la configuration en mode test
            if (window.location && window.location.href.includes('test.html')) {
                window.emailService.checkConfiguration();
            }
        }
    });

    // Gestionnaire d'erreurs global
    window.addEventListener('error', (event) => {
        if (event.filename && event.filename.includes('emailService.js')) {
            console.error('Erreur dans emailService.js:', event.error);
        }
    });

    // Gestionnaire pour les promesses rejetées
    window.addEventListener('unhandledrejection', (event) => {
        if (event.reason && event.reason.message && event.reason.message.includes('emailService')) {
            console.error('Promesse rejetée dans emailService:', event.reason);
        }
    });
}
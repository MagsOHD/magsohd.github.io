// Service de notifications GRATUIT et OPEN SOURCE avec ntfy.sh
class EmailService {
    constructor() {
        // ntfy.sh - Service de notifications gratuit et open source
        this.ntfyTopic = this.getNtfyTopic();
        this.ntfyServer = 'https://ntfy.sh';
        this.notificationEmail = 'lucas.bracq.pro@gmail.com';

        // Configuration des timeouts et retry
        this.fetchTimeout = 10000; // 10 secondes
        this.maxRetries = 3;
    }

    // Récupérer le topic ntfy.sh depuis plusieurs sources
    getNtfyTopic() {
        // Source 1: Variable globale injectée par le workflow
        if (typeof window !== 'undefined' && window.NTFY_TOPIC &&
            window.NTFY_TOPIC !== 'YOUR_NTFY_TOPIC' &&
            !window.NTFY_TOPIC.includes('lucas-portfolio-dev-')) {
            console.log('🔔 Topic ntfy.sh trouvé via window.NTFY_TOPIC (production)');
            return window.NTFY_TOPIC;
        }

        // Source 2: Meta tag injecté par le workflow
        if (typeof document !== 'undefined') {
            const metaKey = document.querySelector('meta[name="ntfy-topic"]');
            if (metaKey && metaKey.content &&
                metaKey.content !== 'YOUR_NTFY_TOPIC' &&
                !metaKey.content.includes('lucas-portfolio-dev-')) {
                console.log('🔔 Topic ntfy.sh trouvé via meta tag (production)');
                return metaKey.content;
            }
        }

        // Source 3: Variable d'environnement injectée dans le HTML
        if (typeof window !== 'undefined' && window.NTFY_CONFIG && window.NTFY_CONFIG.topic) {
            console.log('🔔 Topic ntfy.sh trouvé via NTFY_CONFIG');
            return window.NTFY_CONFIG.topic;
        }

        // Source 4: Variable globale avec fallback dev
        if (typeof window !== 'undefined' && window.NTFY_TOPIC) {
            console.log('🔔 Topic ntfy.sh trouvé via window.NTFY_TOPIC (développement)');
            return window.NTFY_TOPIC;
        }

        // Fallback: topic par défaut pour développement local
        console.warn('⚠️ Utilisation du topic ntfy.sh par défaut - notifications limitées');
        return 'lucas-portfolio-notifications-' + Date.now().toString(36);
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

            return await this.sendNotification(subject, message, 'visitor_notification', visitorData);
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

            return await this.sendNotification(subject, message, 'action_notification', actionData);
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

            return await this.sendNotification(subject, message, 'contact_notification', contactData);
        } catch (error) {
            console.error('Erreur sendContactNotification:', error);
            return { success: false, error: error.message };
        }
    }

    // Méthode principale d'envoi de notification avec ntfy.sh
    async sendNotification(subject, message, type, data) {
        try {
            const timestamp = new Date().toISOString();

            // Validation des paramètres
            if (!subject || !message || !type) {
                throw new Error('Paramètres notification manquants');
            }

            console.log(`🔔 Tentative d'envoi de notification: ${type}`);

            // ntfy.sh - Service principal
            const ntfyResult = await this.sendViaNtfy(subject, message, data);
            if (ntfyResult && ntfyResult.success) {
                console.log('✅ Notification envoyée avec succès via ntfy.sh');
                return { success: true, service: 'ntfy' };
            } else {
                console.error('❌ Échec de l\'envoi via ntfy.sh');
                return { success: false, service: 'ntfy', error: 'Échec ntfy.sh' };
            }

        } catch (error) {
            console.error('Erreur critique dans sendNotification:', error);
            return { success: false, error: error.message };
        }
    }

    // ntfy.sh - Service gratuit et open source
    // Valider la configuration ntfy.sh
    async validateNtfyTopic() {
        try {
            const testMessage = 'Test de validation du topic ntfy.sh';
            const response = await fetch(`${this.ntfyServer}/${this.ntfyTopic}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                    'Title': 'Test de validation',
                    'Priority': '3',
                    'Tags': 'test,validation'
                },
                body: testMessage
            });

            return { valid: response.ok, message: response.ok ? 'Topic valide' : 'Topic invalide' };
        } catch (error) {
            return { valid: false, message: error.message };
        }
    }

    async sendViaNtfy(subject, message, data) {
        if (!this.ntfyTopic || this.ntfyTopic === 'YOUR_NTFY_TOPIC') {
            console.error('❌ ntfy.sh non configuré - topic manquant');
            throw new Error('ntfy.sh non configuré - topic manquant');
        }

        console.log('🔔 Tentative d\'envoi avec topic:', this.ntfyTopic);

        // Vérifier la connectivité internet
        if (!navigator.onLine) {
            throw new Error('Pas de connexion internet');
        }

        // Préparer le message complet avec métadonnées
        let fullMessage = message;
        if (data) {
            const metadata = {
                timestamp: new Date().toISOString(),
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
                pageUrl: typeof window !== 'undefined' ? window.location.href : 'Unknown',
                ...data
            };

            fullMessage += '\n\n--- Informations techniques ---\n';
            fullMessage += `Timestamp: ${metadata.timestamp}\n`;
            fullMessage += `Page: ${metadata.pageUrl}\n`;
            fullMessage += `User Agent: ${metadata.userAgent}\n`;

            // Ajouter d'autres données si disponibles
            if (data.screenResolution) {
                fullMessage += `Résolution: ${data.screenResolution}\n`;
            }
            if (data.language) {
                fullMessage += `Langue: ${data.language}\n`;
            }
        }

        // Déterminer la priorité et les tags selon le type de notification
        let priority = '3'; // Normal par défaut
        let tags = 'portfolio';

        // Nettoyer le subject des emojis pour les headers (garder uniquement le texte)
        let cleanSubject = subject.replace(/[^\x00-\x7F]/g, "").trim();
        if (!cleanSubject) {
            cleanSubject = 'Notification Portfolio';
        }

        if (subject.includes('🚨') || subject.includes('visite')) {
            priority = '4'; // High
            tags = 'portfolio,visitor,new';
        } else if (subject.includes('🎯') || subject.includes('interaction')) {
            priority = '4'; // High
            tags = 'portfolio,interaction,action';
        } else if (subject.includes('📧') || subject.includes('contact')) {
            priority = '5'; // Max
            tags = 'portfolio,contact,important';
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.fetchTimeout);

        try {
            console.log('🔔 Envoi ntfy.sh vers topic:', this.ntfyTopic);

            const response = await fetch(`${this.ntfyServer}/${this.ntfyTopic}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                    'Title': cleanSubject,
                    'Priority': priority,
                    'Tags': tags,
                    'Actions': 'view, Voir Portfolio, https://magsohd.github.io/currentFolio/, clear=true'
                },
                body: `${subject}\n\n${fullMessage}`,
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            console.log('📥 Réponse ntfy.sh status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur réponse ntfy.sh:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            console.log('✅ ntfy.sh succès confirmé');
            return { success: true };

        } catch (error) {
            clearTimeout(timeoutId);
            console.error('💥 Erreur ntfy.sh complète:', error);

            if (error.name === 'AbortError') {
                throw new Error('Timeout ntfy.sh (>10s)');
            }

            // Ajouter plus de détails sur l'erreur
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Erreur de connexion ntfy.sh - Vérifiez votre connexion internet');
            }

            throw new Error(`ntfy.sh: ${error.message}`);
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
            ntfy: this.ntfyTopic && this.ntfyTopic !== 'YOUR_NTFY_TOPIC',
            server: this.ntfyServer,
            fetch: typeof fetch !== 'undefined',
            online: navigator.onLine
        };

        console.log('📋 Configuration ntfy.sh:', config);
        return config;
    }

    // Test simple d'envoi de notification
    async testNotificationSending() {
        console.log('🧪 Test d\'envoi de notification simple...');

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
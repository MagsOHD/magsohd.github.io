// Gestionnaire d'erreurs global pour le portfolio cyberpunk
// Protection contre les erreurs d'extensions et autres interférences

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 50;
        this.extensionErrors = [
            'extensionAdapter',
            'sendMessageToTab',
            'chrome-extension',
            'moz-extension',
            'extension',
            'content script',
            'inject',
            'Non-Error promise rejection captured'
        ];

        this.setupGlobalHandlers();
    }

    setupGlobalHandlers() {
        // Gestionnaire d'erreurs JavaScript global
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'javascript', {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                message: event.message
            });
        });

        // Gestionnaire pour les promesses rejetées
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'promise', {
                promise: event.promise
            });
        });

        // Protection contre les erreurs de console
        const originalConsoleError = console.error;
        console.error = (...args) => {
            const message = args.join(' ');
            if (!this.isExtensionError(message)) {
                originalConsoleError.apply(console, args);
            }
        };

        console.log('🛡️ Gestionnaire d\'erreurs global activé');
    }

    handleError(error, type, context = {}) {
        const errorInfo = {
            timestamp: new Date().toISOString(),
            type: type,
            message: error?.message || String(error),
            stack: error?.stack,
            context: context,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Filtrer les erreurs d'extensions
        if (this.isExtensionError(errorInfo.message) || this.isExtensionError(errorInfo.stack)) {
            console.log('🔇 Erreur d\'extension filtrée:', errorInfo.message);
            return;
        }

        // Filtrer les erreurs bénignes
        if (this.isBenignError(errorInfo.message)) {
            return;
        }

        // Ajouter à la liste des erreurs
        this.errors.push(errorInfo);

        // Limiter le nombre d'erreurs stockées
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }

        // Log seulement les erreurs importantes
        console.warn('⚠️ Erreur capturée:', {
            type: errorInfo.type,
            message: errorInfo.message,
            timestamp: errorInfo.timestamp
        });

        // Notifier seulement les erreurs critiques liées au portfolio
        if (this.isCriticalError(errorInfo)) {
            this.notifyCriticalError(errorInfo);
        }
    }

    isExtensionError(text) {
        if (!text) return false;

        const textLower = text.toLowerCase();
        return this.extensionErrors.some(pattern => textLower.includes(pattern.toLowerCase()));
    }

    isBenignError(message) {
        if (!message) return false;

        const benignPatterns = [
            'ResizeObserver loop limit exceeded',
            'Non-Error promise rejection captured',
            'Script error',
            'Loading chunk',
            'Loading CSS chunk',
            'Network request failed',
            'Failed to fetch',
            'NetworkError',
            'AbortError'
        ];

        return benignPatterns.some(pattern => message.includes(pattern));
    }

    isCriticalError(errorInfo) {
        const criticalPatterns = [
            'emailService',
            'portfolio',
            'cyberpunk',
            'sendEmail',
            'trackVisitor',
            'TypeError.*undefined',
            'ReferenceError'
        ];

        const text = (errorInfo.message + ' ' + (errorInfo.stack || '')).toLowerCase();
        return criticalPatterns.some(pattern => {
            const regex = new RegExp(pattern.toLowerCase());
            return regex.test(text);
        });
    }

    notifyCriticalError(errorInfo) {
        // Ne notifier que les erreurs vraiment critiques du portfolio
        if (window.emailService && typeof window.emailService.sendActionNotification === 'function') {
            try {
                window.emailService.sendActionNotification({
                    action: 'critical_error',
                    timestamp: errorInfo.timestamp,
                    language: document.documentElement.lang || 'fr',
                    userAgent: navigator.userAgent,
                    referrer: document.referrer || 'Direct',
                    errorMessage: errorInfo.message,
                    errorType: errorInfo.type,
                    errorStack: errorInfo.stack?.substring(0, 500) // Limiter la taille
                });
            } catch (emailError) {
                console.warn('Impossible de notifier l\'erreur critique:', emailError);
            }
        }
    }

    getErrorReport() {
        return {
            timestamp: new Date().toISOString(),
            totalErrors: this.errors.length,
            errors: this.errors.slice(-10), // Dernières 10 erreurs
            browserInfo: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine
            },
            pageInfo: {
                url: window.location.href,
                title: document.title,
                referrer: document.referrer
            }
        };
    }

    clearErrors() {
        this.errors = [];
        console.log('🧹 Historique des erreurs nettoyé');
    }

    // Protection spécifique pour les fonctions du portfolio
    wrapFunction(fn, name) {
        return function(...args) {
            try {
                return fn.apply(this, args);
            } catch (error) {
                console.warn(`Erreur dans ${name}:`, error);
                return null;
            }
        };
    }

    // Créer une zone sécurisée pour l'exécution de code
    safeExecute(fn, context = 'unknown') {
        try {
            return fn();
        } catch (error) {
            this.handleError(error, 'safe_execute', { context });
            return null;
        }
    }
}

// Instance globale du gestionnaire d'erreurs
if (typeof window !== 'undefined') {
    window.errorHandler = new ErrorHandler();

    // Protection spécifique pour emailService
    document.addEventListener('DOMContentLoaded', () => {
        if (window.emailService) {
            // Protéger les méthodes principales
            const originalSendEmail = window.emailService.sendEmail;
            window.emailService.sendEmail = function(...args) {
                return window.errorHandler.safeExecute(() => originalSendEmail.apply(this, args), 'emailService.sendEmail');
            };

            const originalTrackVisitor = window.trackVisitor;
            if (typeof originalTrackVisitor === 'function') {
                window.trackVisitor = function(...args) {
                    return window.errorHandler.safeExecute(() => originalTrackVisitor.apply(this, args), 'trackVisitor');
                };
            }
        }
    });

    // Fonction utilitaire pour débugger
    window.getPortfolioErrorReport = () => {
        return window.errorHandler.getErrorReport();
    };

    // Nettoyage automatique des erreurs toutes les heures
    setInterval(() => {
        if (window.errorHandler.errors.length > 20) {
            window.errorHandler.errors = window.errorHandler.errors.slice(-20);
        }
    }, 60 * 60 * 1000); // 1 heure
}

// Protection contre les erreurs de modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}
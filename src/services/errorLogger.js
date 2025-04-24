/**
 * Service de journalisation des erreurs
 * Centralise la gestion et l'enregistrement des erreurs de l'application
 */

// Configuration du niveau de journalisation
const LOG_LEVELS = {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  };
  
  // Configuration de base
  const config = {
    // Activer/désactiver la journalisation en console
    consoleLogging: true,
    // Activer/désactiver l'envoi des erreurs au serveur
    serverLogging: process.env.NODE_ENV === 'production',
    // URL de l'API de journalisation (à configurer selon votre backend)
    loggingEndpoint: 'http://127.0.0.1:8000/api/logs',
    // Niveau minimum de journalisation
    minimumLevel: LOG_LEVELS.ERROR
  };
  
  /**
   * Enregistre une erreur dans la console
   * @param {Error} error - L'erreur à journaliser
   * @param {Object} context - Informations contextuelles supplémentaires
   * @param {string} level - Niveau de journalisation
   */
  const logToConsole = (error, context = {}, level = LOG_LEVELS.ERROR) => {
    if (!config.consoleLogging) return;
  
    const timestamp = new Date().toISOString();
    
    switch (level) {
      case LOG_LEVELS.ERROR:
        console.error(`[${timestamp}] ERROR:`, error, context);
        break;
      case LOG_LEVELS.WARNING:
        console.warn(`[${timestamp}] WARNING:`, error, context);
        break;
      case LOG_LEVELS.INFO:
        console.info(`[${timestamp}] INFO:`, error, context);
        break;
      default:
        console.log(`[${timestamp}] LOG:`, error, context);
    }
  };
  
  /**
   * Envoie une erreur au serveur pour journalisation
   * @param {Error} error - L'erreur à journaliser
   * @param {Object} context - Informations contextuelles supplémentaires
   * @param {string} level - Niveau de journalisation
   */
  const logToServer = async (error, context = {}, level = LOG_LEVELS.ERROR) => {
    if (!config.serverLogging) return;
  
    try {
      const errorData = {
        message: error.message || 'Erreur inconnue',
        stack: error.stack,
        timestamp: new Date().toISOString(),
        level,
        context: {
          ...context,
          url: window.location.href,
          userAgent: navigator.userAgent,
          // Ajouter d'autres informations utiles du contexte
        }
      };
  
      // Utiliser fetch plutôt que l'instance axios pour éviter les boucles infinies
      // si l'erreur provient d'axios
      await fetch(config.loggingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
        // Ne pas attendre la réponse pour ne pas bloquer l'utilisateur
        keepalive: true
      });
    } catch (logError) {
      // Erreur silencieuse pour éviter les boucles infinies
      if (config.consoleLogging) {
        console.error('Erreur lors de la journalisation au serveur:', logError);
      }
    }
  };
  
  /**
   * Journalise une erreur
   * @param {Error} error - L'erreur à journaliser
   * @param {Object} context - Informations contextuelles supplémentaires
   * @param {string} level - Niveau de journalisation
   */
  const logError = async (error, context = {}, level = LOG_LEVELS.ERROR) => {
    // Vérifier si le niveau correspond au minimum requis
    if (Object.values(LOG_LEVELS).indexOf(level) < 
        Object.values(LOG_LEVELS).indexOf(config.minimumLevel)) {
      return;
    }
  
    // Journaliser en console
    logToConsole(error, context, level);
  
    // Journaliser au serveur
    await logToServer(error, context, level);
  };
  
  // Exporter les fonctions et constantes utiles
  export default {
    logError,
    LOG_LEVELS,
    // Méthodes spécifiques pour différents niveaux
    error: (error, context) => logError(error, context, LOG_LEVELS.ERROR),
    warning: (error, context) => logError(error, context, LOG_LEVELS.WARNING),
    info: (error, context) => logError(error, context, LOG_LEVELS.INFO),
    // Configuration
    setConfig: (newConfig) => {
      Object.assign(config, newConfig);
    }
  };
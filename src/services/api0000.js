// api.js - Service API amélioré avec meilleure gestion des erreurs
import axios from 'axios';
import errorLogger from './errorLogger'; // Importer le service de journalisation

// Configurer l'URL de base pour toutes les requêtes
// Ici, nous utilisons l'URL de base sans le préfixe 'api' car il sera ajouté dans les requêtes
const baseURL = 'http://127.0.0.1:8000'; // Sans '/api' à la fin

// Créer une instance axios avec la configuration par défaut
const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Important pour les cookies/session
});

/**
 * Vérifier si l'erreur est due à une déconnexion réseau
 * @param {Error} error - L'erreur à vérifier
 * @returns {boolean} - True si offline, false sinon
 */
const isOfflineError = (error) => {
  return !window.navigator.onLine || error.message === 'Network Error';
};

/**
 * Gérer les erreurs liées à la déconnexion
 */
const handleOfflineError = () => {
  // Afficher une alerte ou rediriger vers une page dédiée
  // Si vous avez un contexte UI, vous pouvez l'utiliser ici
  console.log('Vous êtes actuellement hors ligne. Veuillez vérifier votre connexion internet.');
  
  // Option: Rediriger vers une page d'erreur offline
  // window.location.href = '/offline';
};

// Intercepteur pour les requêtes
instance.interceptors.request.use(
  config => {
    // Récupérer le token JWT stocké
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // Ajouter le token à l'en-tête Authorization si disponible
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log(`Requête API: ${config.method.toUpperCase()} ${baseURL}${config.url}`);
    return config;
  },
  error => {
    // Journaliser l'erreur de requête
    errorLogger.error(error, { type: 'request_error', url: error.config?.url });
    console.error('Erreur dans la requête API:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
instance.interceptors.response.use(
  response => {
    console.log(`Réponse API: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    // Vérifier si l'erreur est due à une déconnexion
    if (isOfflineError(error)) {
      handleOfflineError();
      return Promise.reject(error);
    }
    
    // Journaliser l'erreur avec le service de journalisation
    errorLogger.error(error, {
      type: 'response_error', 
      status: error.response?.status || 'N/A',
      url: error.config?.url || 'N/A',
      data: error.response?.data
    });
    
    console.error('Erreur API:', 
      error.response?.status || 'N/A', 
      error.config?.url || 'N/A',
      error.response?.data || error.message
    );
    
    // Redirection basée sur le code d'erreur (window.location pour forcer un rechargement)
    if (error.response) {
      switch (error.response.status) {
        case 404:
          window.location.href = '/404';
          break;
        case 403:
          window.location.href = '/403';
          break;
        case 401:
          // Vérifier si le token est expiré ou invalide via la réponse
          if (error.response.data?.message?.includes('token')) {
            // Nettoyer les données d'authentification
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            // Rediriger vers la page de connexion avec un message
            window.location.href = '/login?session=expired';
          } else {
            window.location.href = '/401';
          }
          break;
        case 500:
          window.location.href = '/500';
          break;
        case 504:
          window.location.href = '/504';
          break;
        case 503:
          // Service indisponible, rediriger vers la page de maintenance
          window.location.href = '/maintenance';
          break;
        default:
          // Pour les autres erreurs, vous pouvez choisir de les gérer autrement
          break;
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;
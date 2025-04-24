// src/services/api.js
/**
 * 🇬🇧 Base API service for handling HTTP requests with auth token management
 * 🇫🇷 Service API de base pour gérer les requêtes HTTP avec gestion du token d'authentification
 */
import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Vérifiez tous les noms possibles du token utilisés dans l'application
    const token = localStorage.getItem('auth_token') || 
                 localStorage.getItem('token') || 
                 localStorage.getItem('jwt_token');
                 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Version modifiée de l'intercepteur de réponse pour qu'il soit moins agressif
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Uniquement rediriger si c'est une erreur 401 ET que nous ne sommes pas déjà sur la page de login
    // ET seulement pour certaines routes (pas pour auth/login par exemple)
    if (error.response && 
        error.response.status === 401 && 
        !window.location.pathname.includes('/login') &&
        !error.config.url.includes('/auth/')) {
      
      console.warn('Session expirée ou non authentifiée. Redirection vers la page de connexion.');
      
      // Plutôt que de rediriger immédiatement, enregistrer l'état pour revenir après connexion
      sessionStorage.setItem('redirect_after_login', window.location.pathname);
      
      // Désactiver temporairement la redirection automatique pour éviter les boucles
      // Utiliser setTimeout pour permettre à la requête en cours de terminer
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    }
    return Promise.reject(error);
  }
);

export default api;
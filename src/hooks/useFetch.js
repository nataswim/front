// src/hooks/useFetch.js
// Hook générique pour les requêtes API 
// Hooks React personnalisés

import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';

// Configuration par défaut pour les requêtes
const DEFAULT_CONFIG = {
  method: 'get',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes
  withCredentials: false,
};

/**
 * Hook personnalisé pour effectuer des requêtes API
 * @param {string} url - L'URL de la requête API
 * @param {Object} [options={}] - Options de configuration de la requête
 * @param {boolean} [immediate=true] - Déclenchement immédiat de la requête
 */
export const useFetch = (url, options = {}, immediate = true) => {
  // États de la requête
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Référence pour annuler les requêtes
  const cancelTokenSource = useRef(null);

  // Fonction de requête
  const fetchData = useCallback(async (overrideUrl = null, overrideOptions = {}) => {
    // Annuler la requête précédente si elle existe
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel('Nouvelle requête en cours');
    }

    // Créer un nouveau token d'annulation
    cancelTokenSource.current = axios.CancelToken.source();

    // Fusionner les configurations
    const requestConfig = {
      ...DEFAULT_CONFIG,
      ...options,
      ...overrideOptions,
      headers: {
        ...DEFAULT_CONFIG.headers,
        ...options.headers,
        ...overrideOptions.headers
      },
      cancelToken: cancelTokenSource.current.token
    };

    // Réinitialiser les états
    setLoading(true);
    setError(null);

    try {
      // Effectuer la requête
      const response = await axios(overrideUrl || url, requestConfig);

      // Mettre à jour les états
      setData(response.data);
      setStatus(response.status);
      return response.data;
    } catch (err) {
      // Gérer les erreurs
      if (axios.isCancel(err)) {
        console.log('Requête annulée');
      } else {
        setError({
          message: err.response?.data?.message || err.message,
          status: err.response?.status,
          data: err.response?.data
        });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  // Effet pour les requêtes immédiates
  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    // Nettoyer le token d'annulation à la destruction
    return () => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel('Composant démonté');
      }
    };
  }, [url, immediate, fetchData]);

  // Réinitialisation des données
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setStatus(null);
  }, []);

  // Retourner l'état et les méthodes
  return {
    data,     // Données récupérées
    error,    // Erreur de requête
    loading,  // État de chargement
    status,   // Statut HTTP de la réponse
    fetchData,// Méthode pour déclencher manuellement la requête
    reset     // Méthode pour réinitialiser l'état
  };
};

// Exportation de fonctions utilitaires
export const fetchWithRetry = async (
  fetchFn, 
  maxRetries = 3, 
  retryDelay = 1000
) => {
  let lastError = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error;
      console.warn(`Tentative ${attempt + 1} échouée`, error);
      
      // Attendre avant de réessayer
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw lastError;
};

// Exportation par défaut
export default useFetch;
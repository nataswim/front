// src/utils/api-fix.js
import api from '../services/api';

// Fonction pour corriger les appels API
export const correctApiCalls = () => {
  // Sauvegardez la fonction get d'origine
  const originalGet = api.get;
  
  // Remplacez-la par une version qui ajoute le préfixe /api/ si nécessaire
  api.get = function(url, config) {
    // Si l'URL commence par /api/, la laisser telle quelle
    if (url.startsWith('/api/')) {
      return originalGet(url, config);
    }
    
    // Sinon, ajouter le préfixe /api/
    return originalGet(`/api${url}`, config);
  };
  
  // Faites de même pour post, put, delete, etc.
  const originalPost = api.post;
  api.post = function(url, data, config) {
    if (url.startsWith('/api/')) {
      return originalPost(url, data, config);
    }
    return originalPost(`/api${url}`, data, config);
  };
  
  const originalPut = api.put;
  api.put = function(url, data, config) {
    if (url.startsWith('/api/')) {
      return originalPut(url, data, config);
    }
    return originalPut(`/api${url}`, data, config);
  };
  
  const originalDelete = api.delete;
  api.delete = function(url, config) {
    if (url.startsWith('/api/')) {
      return originalDelete(url, config);
    }
    return originalDelete(`/api${url}`, config);
  };
  
  console.log('API calls have been corrected to include /api/ prefix');
};
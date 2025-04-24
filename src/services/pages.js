// pages.js  # API pour la gestion des pages statiques
import api from './api';

// Récupérer toutes les pages
export const getPages = () => {
  return api.get('/pages');
};

// Récupérer une page par ID
export const getPage = (id) => {
  return api.get(`/pages/${id}`);
};

// Créer une nouvelle page
export const createPage = (pageData) => {
  return api.post('/pages', pageData);
};

// Mettre à jour une page
export const updatePage = (id, pageData) => {
  return api.post(`/pages/${id}`, {
    ...pageData,
    _method: 'PATCH'  // Laravel form method spoofing
  });
};

// Supprimer une page
export const deletePage = (id) => {
  return api.delete(`/pages/${id}`);
};
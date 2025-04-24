// src/services/swimsets.js
// API pour la gestion des séries de natation

import api from './api';

/**
 * 🇬🇧 Get all swim sets
 * 🇫🇷 Récupérer toutes les séries de natation
 * 
 * @returns {Promise} - API response
 */
export const getSwimSets = () => {
  console.log('Récupération de toutes les séries de natation');
  return api.get('/api/swim-sets');
};

/**
 * 🇬🇧 Get a specific swim set by ID
 * 🇫🇷 Récupérer une série de natation spécifique par son ID
 * 
 * @param {number} id - The swim set ID
 * @returns {Promise} - API response
 */
export const getSwimSet = (id) => {
  console.log(`Récupération de la série de natation ${id} avec token:`, localStorage.getItem('token').substring(0, 20) + '...');
  return api.get(`/api/swim-sets/${id}`);
};

/**
 * 🇬🇧 Create a new swim set
 * 🇫🇷 Créer une nouvelle série de natation
 * 
 * @param {Object} swimSetData - The swim set data
 * @returns {Promise} - API response
 */
export const createSwimSet = (swimSetData) => {
  console.log('Création d\'une nouvelle série de natation', swimSetData);
  return api.post('/api/swim-sets', swimSetData);
};

/**
 * 🇬🇧 Update an existing swim set
 * 🇫🇷 Mettre à jour une série de natation existante
 * 
 * @param {number} id - The swim set ID
 * @param {Object} swimSetData - The updated swim set data
 * @returns {Promise} - API response
 */
export const updateSwimSet = (id, swimSetData) => {
  console.log(`Mise à jour de la série de natation ${id}`, swimSetData);
  return api.post(`/api/swim-sets/${id}`, {
    ...swimSetData,
    _method: 'PATCH'  // Laravel form method spoofing
  });
};

/**
 * 🇬🇧 Delete a swim set
 * 🇫🇷 Supprimer une série de natation
 * 
 * @param {number} id - The swim set ID
 * @returns {Promise} - API response
 */
export const deleteSwimSet = (id) => {
  console.log(`Suppression de la série de natation ${id}`);
  return api.delete(`/api/swim-sets/${id}`);
};
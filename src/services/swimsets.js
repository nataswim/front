// src/services/swimsets.js
/**
 * 🇬🇧 API service for managing swim sets
 * 🇫🇷 Service API pour la gestion des séries de natation
 */
import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

// Get all swim sets
export const getSwimSets = () => {
  return api.get(API_ENDPOINTS.SWIM_SETS);
};

// Get a specific swim set
export const getSwimSet = (id) => {
  return api.get(API_ENDPOINTS.SWIM_SET(id));
};

// Create a new swim set
export const createSwimSet = (swimSetData) => {
  return api.post(API_ENDPOINTS.SWIM_SETS, swimSetData);
};

// Update a swim set
export const updateSwimSet = (id, swimSetData) => {
  return api.post(API_ENDPOINTS.SWIM_SET(id), {
    ...swimSetData,
    _method: 'PATCH'  // Laravel form method spoofing
  });
};

// Delete a swim set
export const deleteSwimSet = (id) => {
  return api.delete(API_ENDPOINTS.SWIM_SET(id));
};
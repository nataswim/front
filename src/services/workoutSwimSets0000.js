// src/services/workoutSwimSets.js
import api from './api';

/**
 * 🇬🇧 Service to manage swim sets associated with workouts
 * 🇫🇷 Service pour gérer les séries de natation associées aux séances d'entraînement
 */

/**
 * 🇬🇧 Get all swim sets for a specific workout
 * 🇫🇷 Récupérer toutes les séries de natation pour une séance spécifique
 * 
 * @param {number} workoutId - The workout ID
 * @returns {Promise} - API response
 */
export const getSwimSetsForWorkout = (workoutId) => {
  console.log(`Récupération des séries pour la séance ${workoutId}`);
  return api.get(`/api/workouts/${workoutId}/swim-sets`);
};

/**
 * 🇬🇧 Add a swim set to a workout
 * 🇫🇷 Ajouter une série de natation à une séance d'entraînement
 * 
 * @param {number} workoutId - The workout ID
 * @param {number} swimSetId - The swim set ID
 * @returns {Promise} - API response
 */
export const addSwimSetToWorkout = (workoutId, swimSetId) => {
  console.log(`Ajout de la série ${swimSetId} à la séance ${workoutId}`);
  return api.post(`/api/workouts/${workoutId}/swim-sets/${swimSetId}`);
};

/**
 * 🇬🇧 Remove a swim set from a workout
 * 🇫🇷 Supprimer une série de natation d'une séance d'entraînement
 * 
 * @param {number} workoutId - The workout ID
 * @param {number} swimSetId - The swim set ID
 * @returns {Promise} - API response
 */
export const removeSwimSetFromWorkout = (workoutId, swimSetId) => {
  console.log(`Suppression de la série ${swimSetId} de la séance ${workoutId}`);
  return api.delete(`/api/workouts/${workoutId}/swim-sets/${swimSetId}`);
};
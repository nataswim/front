// src/services/workoutSwimSets.js
/**
 * 🇬🇧 API service for managing swim sets associated with workouts
 * 🇫🇷 Service API pour la gestion des séries de natation associées aux séances
 */
import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

// Get swim sets for a workout
export const getSwimSetsForWorkout = (workoutId) => {
  return api.get(API_ENDPOINTS.WORKOUT_SWIM_SETS(workoutId));
};

// Add swim set to workout
export const addSwimSetToWorkout = (workoutId, swimSetId) => {
  return api.post(API_ENDPOINTS.WORKOUT_SWIM_SET(workoutId, swimSetId));
};

// Remove swim set from workout
export const removeSwimSetFromWorkout = (workoutId, swimSetId) => {
  return api.delete(API_ENDPOINTS.WORKOUT_SWIM_SET(workoutId, swimSetId));
};
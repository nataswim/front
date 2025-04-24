// src/services/workouts.js
/**
 * 🇬🇧 API service for managing workouts
 * 🇫🇷 Service API pour la gestion des séances d'entraînement
 */
import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

// Get all workouts
export const getWorkouts = () => {
  console.log('Récupération de toutes les séances');
  return api.get(API_ENDPOINTS.WORKOUTS);
};

// Get a specific workout
export const getWorkout = (id) => {
  console.log(`Récupération de la séance ${id}`);
  return api.get(API_ENDPOINTS.WORKOUT(id));
};

// Create a new workout
export const createWorkout = (workoutData) => {
  console.log('Création d\'une nouvelle séance', workoutData);
  return api.post(API_ENDPOINTS.WORKOUTS, workoutData);
};

// Update a workout
export const updateWorkout = (id, workoutData) => {
  console.log(`Mise à jour de la séance ${id}`, workoutData);
  return api.put(API_ENDPOINTS.WORKOUT(id), workoutData);
};

// Delete a workout
export const deleteWorkout = (id) => {
  console.log(`Suppression de la séance ${id}`);
  return api.delete(API_ENDPOINTS.WORKOUT(id));
};

// Get exercises for a workout
export const getWorkoutExercises = (workoutId) => {
  console.log(`Récupération des exercices pour la séance ${workoutId}`);
  return api.get(API_ENDPOINTS.WORKOUT_EXERCISES(workoutId));
};

// Add exercise to workout
export const addExerciseToWorkout = (workoutId, exerciseId) => {
  console.log(`Ajout de l'exercice ${exerciseId} à la séance ${workoutId}`);
  return api.post(API_ENDPOINTS.WORKOUT_EXERCISE(workoutId, exerciseId));
};

// Remove exercise from workout
export const removeExerciseFromWorkout = (workoutId, exerciseId) => {
  console.log(`Suppression de l'exercice ${exerciseId} de la séance ${workoutId}`);
  return api.delete(API_ENDPOINTS.WORKOUT_EXERCISE(workoutId, exerciseId));
};

// Get plans containing this workout
export const getWorkoutPlans = (workoutId) => {
  console.log(`Récupération des plans contenant la séance ${workoutId}`);
  return api.get(API_ENDPOINTS.WORKOUT_PLANS(workoutId));
};
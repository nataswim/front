// workouts.js
import api from './api';

// Get all workouts
export const getWorkouts = () => {
  console.log('Récupération de toutes les séances');
  return api.get('/api/workouts');
};

// Get a specific workout
export const getWorkout = (id) => {
  console.log(`Récupération de la séance ${id}`);
  return api.get(`/api/workouts/${id}`);
};

// Create a new workout
export const createWorkout = (workoutData) => {
  console.log('Création d\'une nouvelle séance', workoutData);
  return api.post('/api/workouts', workoutData);
};

// Update a workout
export const updateWorkout = (id, workoutData) => {
  console.log(`Mise à jour de la séance ${id}`, workoutData);
  return api.put(`/api/workouts/${id}`, workoutData);
};

// Delete a workout
export const deleteWorkout = (id) => {
  console.log(`Suppression de la séance ${id}`);
  return api.delete(`/api/workouts/${id}`);
};

// Get exercises for a workout
export const getWorkoutExercises = (workoutId) => {
  console.log(`Récupération des exercices pour la séance ${workoutId}`);
  return api.get(`/api/workouts/${workoutId}/exercises`);
};

// Add exercise to workout
export const addExerciseToWorkout = (workoutId, exerciseId) => {
  console.log(`Ajout de l'exercice ${exerciseId} à la séance ${workoutId}`);
  return api.post(`/api/workouts/${workoutId}/exercises/${exerciseId}`);
};

// Remove exercise from workout
export const removeExerciseFromWorkout = (workoutId, exerciseId) => {
  console.log(`Suppression de l'exercice ${exerciseId} de la séance ${workoutId}`);
  return api.delete(`/api/workouts/${workoutId}/exercises/${exerciseId}`);
};

// Get plans containing this workout
export const getWorkoutPlans = (workoutId) => {
  console.log(`Récupération des plans contenant la séance ${workoutId}`);
  return api.get(`/api/workouts/${workoutId}/plans`);
};
// workoutExercises.js  # API pour gérer la relation workouts - exercises
import api from './api';

// Get exercises for a workout
export const getExercisesForWorkout = (workoutId) => {
  return api.get(`/workouts/${workoutId}/exercises`);
};

// Add exercise to workout
export const addExerciseToWorkout = (workoutId, exerciseId) => {
  return api.post(`/workouts/${workoutId}/exercises/${exerciseId}`);
};

// Remove exercise from workout
export const removeExerciseFromWorkout = (workoutId, exerciseId) => {
  return api.delete(`/workouts/${workoutId}/exercises/${exerciseId}`);
};
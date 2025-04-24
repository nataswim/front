// planWorkouts.js  # API pour gérer la relation plans - workouts
import api from './api';

// Get workouts for a plan
export const getWorkoutsForPlan = (planId) => {
  return api.get(`/plans/${planId}/workouts`);
};

// Add workout to plan
export const addWorkoutToPlan = (planId, workoutId) => {
  return api.post(`/plans/${planId}/workouts/${workoutId}`);
};

// Remove workout from plan
export const removeWorkoutFromPlan = (planId, workoutId) => {
  return api.delete(`/plans/${planId}/workouts/${workoutId}`);
};
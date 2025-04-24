// plans.js
import api from './api';

// Get all plans
export const getPlans = () => {
  console.log('Récupération de tous les plans');
  return api.get('/plans');
};

// Get a specific plan
export const getPlan = (id) => {
  console.log(`Récupération du plan ${id}`);
  return api.get(`/plans/${id}`);
};

// Create a new plan
export const createPlan = (planData) => {
  console.log('Création d\'un nouveau plan', planData);
  return api.post('/plans', planData);
};

// Update a plan
export const updatePlan = (id, planData) => {
  console.log(`Mise à jour du plan ${id}`, planData);
  return api.put(`/plans/${id}`, planData);
};

// Delete a plan
export const deletePlan = (id) => {
  console.log(`Suppression du plan ${id}`);
  return api.delete(`/plans/${id}`);
};

// Get workouts for a plan
export const getPlanWorkouts = (planId) => {
  console.log(`Récupération des séances pour le plan ${planId}`);
  return api.get(`/plans/${planId}/workouts`);
};

// Add workout to plan
export const addWorkoutToPlan = (planId, workoutId) => {
  console.log(`Ajout de la séance ${workoutId} au plan ${planId}`);
  return api.post(`/plans/${planId}/workouts/${workoutId}`);
};

// Remove workout from plan
export const removeWorkoutFromPlan = (planId, workoutId) => {
  console.log(`Suppression de la séance ${workoutId} du plan ${planId}`);
  return api.delete(`/plans/${planId}/workouts/${workoutId}`);
};
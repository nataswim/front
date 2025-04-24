// src/config/api.config.js
/**
 * 🇬🇧 API configuration file that centralizes all API endpoints and settings
 * 🇫🇷 Fichier de configuration API qui centralise tous les points d'accès et paramètres API
 */

// Base API URL - can be configured per environment
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  
  // Workouts
  WORKOUTS: '/api/workouts',
  WORKOUT: (id) => `/api/workouts/${id}`,
  WORKOUT_EXERCISES: (workoutId) => `/api/workouts/${workoutId}/exercises`,
  WORKOUT_EXERCISE: (workoutId, exerciseId) => `/api/workouts/${workoutId}/exercises/${exerciseId}`,
  WORKOUT_PLANS: (workoutId) => `/api/workouts/${workoutId}/plans`,
  WORKOUT_SWIM_SETS: (workoutId) => `/api/workouts/${workoutId}/swim-sets`,
  WORKOUT_SWIM_SET: (workoutId, swimSetId) => `/api/workouts/${workoutId}/swim-sets/${swimSetId}`,
  
  // Swim Sets
  SWIM_SETS: '/api/swim-sets',
  SWIM_SET: (id) => `/api/swim-sets/${id}`,
  
  // Exercises
  EXERCISES: '/api/exercises',
  EXERCISE: (id) => `/api/exercises/${id}`,
  
  // Plans
  PLANS: '/api/plans',
  PLAN: (id) => `/api/plans/${id}`,
  PLAN_WORKOUTS: (planId) => `/api/plans/${planId}/workouts`,
  PLAN_WORKOUT: (planId, workoutId) => `/api/plans/${planId}/workouts/${workoutId}`,
  
  // Users
  USERS: '/api/users',
  USER: (id) => `/api/users/${id}`,
};

export default { API_BASE_URL, API_ENDPOINTS };
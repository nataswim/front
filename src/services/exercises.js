// exercises.js - Service corrigé
import api from './api';

// Get all exercises
export const getExercises = () => {
  console.log('Récupération de tous les exercices');
  return api.get('/api/exercises');
};

// Get a specific exercise
export const getExercise = (id) => {
  console.log(`Récupération de l'exercice ${id}`);
  return api.get(`/api/exercises/${id}`);
};

// Create a new exercise
export const createExercise = (exerciseData) => {
  console.log('Création d\'un nouvel exercice', exerciseData);
  return api.post('/api/exercises', exerciseData);
};

// Update an exercise
export const updateExercise = (id, exerciseData) => {
  console.log(`Mise à jour de l'exercice ${id}`, exerciseData);
  return api.put(`/api/exercises/${id}`, exerciseData);
};

// Delete an exercise
export const deleteExercise = (id) => {
  console.log(`Suppression de l'exercice ${id}`);
  return api.delete(`/api/exercises/${id}`);
};

// Test function for debugging
export const testExercisesAvailability = async () => {
  try {
    console.log('Test de disponibilité des exercices...');
    const response = await api.get('/api/exercises');
    console.log('Réponse du test de disponibilité des exercices:', response);
    
    // Afficher les détails utiles au débogage
    if (response.data && Array.isArray(response.data)) {
      console.log(`Nombre d'exercices: ${response.data.length}`);
      if (response.data.length > 0) {
        console.log('Premier exercice:', response.data[0]);
      }
    } else {
      console.log('Format de réponse inattendu:', response.data);
    }
    
    return {
      success: true,
      data: response.data,
      count: Array.isArray(response.data) ? response.data.length : 0
    };
  } catch (error) {
    console.error('Erreur lors du test de disponibilité des exercices:', error);
    console.error('Message d\'erreur:', error.message);
    console.error('Statut:', error.response?.status);
    console.error('Données d\'erreur:', error.response?.data);
    
    return {
      success: false,
      error: error.message,
      response: error.response
    };
  }
};
// mylists.js  # API pour la gestion des listes personnelles
import api from './api';

// Get all mylists
export const getMylists = () => {
  console.log('Récupération de toutes les listes personnelles');
  return api.get('/api/mylists');
};

// Get a specific mylist
export const getMylist = (id) => {
  return api.get(`/mylists/${id}`);
};

// Create a new mylist
export const createMylist = (mylistData) => {
  console.log('Création d\'une nouvelle liste personnelle', mylistData);
  return api.post('/api/mylists', mylistData);
};

// Update a mylist
export const updateMylist = (id, mylistData) => {
  // Valider que mylistData contient user_id et title
  if (!mylistData.user_id || !mylistData.title) {
    console.error('Données de liste invalides pour mise à jour:', mylistData);
  }
  
  // Assurez-vous que les données sont formatées correctement
  const validatedData = {
    user_id: mylistData.user_id,
    title: mylistData.title,
    description: mylistData.description || null
  };
  
  return api.put(`/mylists/${id}`, validatedData);
};

// Delete a mylist
export const deleteMylist = (id) => {
  return api.delete(`/mylists/${id}`);
};
export const duplicateMylist = (id) => {
  return api.post(`/mylists/${id}/duplicate`);
};
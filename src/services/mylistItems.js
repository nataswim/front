// mylistItems.js - Service corrigé
import api from './api';

// Get items for a mylist
export const getMylistItems = (mylistId) => {
  console.log(`Récupération des éléments pour la liste ${mylistId}`);
  
  // IMPORTANT: Utiliser la route correcte sans duplication du préfixe 'api'
  // Vérifier dans votre fichier routes/api.php quelle est la route exacte
  
  // Si la route est définie comme 'mylist/{mylist}/items' dans api.php
  return api.get(`/api/mylist/${mylistId}/items`);
  
  // Si vous voyez que la route devrait être 'mylists/{mylist}/items'
  // return api.get(`/api/mylists/${mylistId}/items`);
};

// Add item to mylist
export const addItemToMylist = (mylistId, itemData) => {
  console.log(`Ajout d'un élément à la liste ${mylistId}:`, itemData);
  
  // Vérification des données requises
  if (!itemData.item_id || !itemData.item_type) {
    console.error('Données invalides pour l\'ajout d\'un élément à la liste:', itemData);
    return Promise.reject(new Error('Données invalides pour l\'ajout d\'un élément à la liste'));
  }
  
  // Assurez-vous que item_id est un nombre
  const finalData = {
    ...itemData,
    item_id: parseInt(itemData.item_id, 10)
  };
  
  // Utiliser la route correcte
  return api.post(`/api/mylist/${mylistId}/items`, finalData);
  // Ou si la route correcte est avec 'mylists'
  // return api.post(`/api/mylists/${mylistId}/items`, finalData);
};

// Remove item from mylist
export const removeItemFromMylist = (mylistId, itemId) => {
  console.log(`Suppression de l'élément ${itemId} de la liste ${mylistId}`);
  
  // Utiliser la route correcte
  return api.delete(`/api/mylist/${mylistId}/items/${itemId}`);
  // Ou si la route correcte est avec 'mylists'
  // return api.delete(`/api/mylists/${mylistId}/items/${itemId}`);
};
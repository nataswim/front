// users.js  # API pour la gestion des utilisateurs

import api from './api';

// Récupérer tous les utilisateurs
export const getUsers = () => {
  return api.get('/users');
};

// Récupérer un utilisateur par ID
export const getUser = (id) => {
  return api.get(`/users/${id}`);
};

// Créer un nouvel utilisateur
export const createUser = (userData) => {
  return api.post('/users', userData);
};

// Mettre à jour un utilisateur
export const updateUser = (id, userData) => {
  return api.put(`/users/${id}`, userData);
};

// Supprimer un utilisateur
export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};
// roles.js  # API pour la gestion des rôles et permissions
import api from './api';

// Get all roles
export const getRoles = () => {
  return api.get('/roles');
};

// Get a specific role
export const getRole = (id) => {
  return api.get(`/roles/${id}`);
};

// Create a new role
export const createRole = (roleData) => {
  return api.post('/roles', roleData);
};

// Update a role
export const updateRole = (id, roleData) => {
  return api.put(`/roles/${id}`, roleData);
};

// Delete a role
export const deleteRole = (id) => {
  return api.delete(`/roles/${id}`);
};

// Get users for a role
export const getUsersForRole = (roleId) => {
  return api.get(`/roles/${roleId}/users`);
};
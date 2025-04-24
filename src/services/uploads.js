import api from './api';

// Base URL for uploads - utilise la configuration de l'environnement ou valeur par défaut
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
const STORAGE_URL = `${API_URL}/storage/`;

// Get public URL for an upload
export const getUploadUrl = (path) => {
  if (!path) return null;
  
  // Si l'URL est déjà complète, la retourner telle quelle
  if (path.startsWith('http')) {
    return path;
  }
  
  // Ne pas supprimer le préfixe 'uploads/' car il est nécessaire
  // Le stockage est configuré pour utiliser 'public' dans filesystems.php
  return `${API_URL}/storage/${path}`;
};

// Get all uploads
export const getUploads = async () => {
  const response = await api.get('/uploads');
  // Add public URL to each upload
  response.data = response.data.map(upload => ({
    ...upload,
    url: getUploadUrl(upload.path)
  }));
  return response;
};

// Get a single upload
export const getUpload = async (id) => {
  const response = await api.get(`/uploads/${id}`);
  response.data = {
    ...response.data,
    url: getUploadUrl(response.data.path)
  };
  return response;
};

// Create a new upload
export const createUpload = async (formData) => {
  // Keep original filename
  const file = formData.get('file');
  if (file) {
    // Add original filename to form data
    formData.append('original_name', file.name);
  }

  const response = await api.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  response.data = {
    ...response.data,
    url: getUploadUrl(response.data.path)
  };
  return response;
};

// Update an upload
export const updateUpload = async (id, formData) => {
  // Keep original filename if new file provided
  const file = formData.get('file');
  if (file) {
    // Add original filename to form data
    formData.append('original_name', file.name);
  }
  
  // Add _method field for Laravel to handle PUT request
  formData.append('_method', 'PUT');
  
  const response = await api.post(`/uploads/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  response.data = {
    ...response.data,
    url: getUploadUrl(response.data.path)
  };
  return response;
};

// Delete an upload
export const deleteUpload = (id) => {
  return api.delete(`/uploads/${id}`);
};

// Get uploads for a user
export const getUserUploads = async (userId) => {
  const response = await api.get(`/users/${userId}/uploads`);
  response.data = response.data.map(upload => ({
    ...upload,
    url: getUploadUrl(upload.path)
  }));
  return response;
};
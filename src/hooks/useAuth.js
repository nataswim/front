// src/hooks/useAuth.js  
// Gestion de l'authentification # Hooks React personnalisés

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
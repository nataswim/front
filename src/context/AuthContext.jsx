// src/context/AuthContext.jsx  
// Gestion de l'authentification  # Contexte React pour gérer l'état global

import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  
  
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erreur d\'initialisation de l\'authentification:', error);
        // Ne pas supprimer le token en cas d'erreur
      } finally {
        setIsLoading(false);
      }
    };
  
    initAuth();
  }, []);



  
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setIsLoading(true);
    try {
      const response = await AuthService.register(username, email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await AuthService.refreshToken();
      setUser(response.user);
      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  // fonctions  contexte AuthContext
const isAdmin = () => {
  return user?.role_id === 1;
};

const isUser = () => {
  return user?.role_id === 2;
};

const isAthlete = () => {
  return user?.role_id === 3;
};

const isCoach = () => {
  return user?.role_id === 4;
};

const hasUserAccess = () => {
  // Tous les rôles ont accès aux pages utilisateur
  return isAuthenticated && (isAdmin() || isUser() || isAthlete() || isCoach());
};

const hasAdminAccess = () => {
  // Seul l'admin a accès aux pages d'administration
  return isAuthenticated && isAdmin();
};

return (
  <AuthContext.Provider
    value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshToken,
      isAdmin,
      isUser,
      isAthlete,
      isCoach,
      hasUserAccess,
      hasAdminAccess
    }}
  >
    {children}
  </AuthContext.Provider>
);
};
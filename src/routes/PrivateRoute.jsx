// src/routes/PrivateRoute.jsx
// Composant de protection des routes qui nécessitent une authentification
// Ce composant vérifie si l'utilisateur est authentifié avant d'afficher les routes protégées
// Si l'utilisateur n'est pas authentifié, il est redirigé vers la page de connexion

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingComponent from '../components/LoadingComponent';

const PrivateRoute = () => {
  // Utilisation du hook useAuth pour vérifier l'état d'authentification
  const { isAuthenticated, isLoading } = useAuth();

  // Afficher un composant de chargement pendant la vérification de l'authentification
  if (isLoading) {
    return <LoadingComponent />;
  }

  // Si l'utilisateur est authentifié, afficher les routes enfants (Outlet)
  // Sinon, rediriger vers la page de connexion
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
// src/routes/RoleBasedRoute.jsx
// Composant de protection des routes basé sur les rôles
// Ce composant vérifie si l'utilisateur a le rôle nécessaire pour accéder à certaines routes
// Si l'utilisateur n'a pas le bon rôle, il est redirigé vers une page appropriée à son rôle

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingComponent from '../components/LoadingComponent';

const RoleBasedRoute = ({ allowedRoles, redirectPath = '/login' }) => {
  // Récupération des informations d'authentification et du rôle de l'utilisateur
  const { user, isAuthenticated, isLoading } = useAuth();

  // Afficher un composant de chargement pendant la vérification
  if (isLoading) {
    return <LoadingComponent />;
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  // Vérifier si le rôle de l'utilisateur est dans la liste des rôles autorisés
  const userRoleId = user?.role_id;
  const hasPermission = allowedRoles.includes(userRoleId);

  // Si l'utilisateur n'a pas la permission requise
  if (!hasPermission) {
    // Rediriger vers la page d'accueil appropriée en fonction du rôle
    // Role 1 = Admin, autres = utilisateurs réguliers
    if (userRoleId === 1) {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/user/dashboard" />;
    }
  }

  // Si l'utilisateur a la permission, afficher les routes enfants
  return <Outlet />;
};

export default RoleBasedRoute;
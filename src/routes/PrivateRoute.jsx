/**
 * 🇬🇧 Private route component with direct login redirection
 * 🇫🇷 Composant de route privée avec redirection directe vers la page de connexion
 */
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

/**
 * 🇬🇧 PrivateRoute - Controls access to protected routes
 * Redirects unauthenticated users directly to the login page
 * 
 * 🇫🇷 PrivateRoute - Contrôle l'accès aux routes protégées
 * Redirige les utilisateurs non authentifiés directement vers la page de connexion
 */
const PrivateRoute = () => {
  const auth = useAuth();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Méthode prioritaire: utiliser le hook useAuth
    const checkAuthViaHook = () => {
      console.log("Auth from hook:", auth);
      
      if (auth && auth.token) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      
      // Si le hook ne fournit pas le token, vérifier directement localStorage
      const checkAuthViaLocalStorage = () => {
        try {
          // Essayer plusieurs clés possibles pour le token
          const possibleKeys = [
            "auth_token", // Clé par défaut
            "token",      // Autre clé commune
            "jwt_token",  // Autre possibilité
            "access_token" // Autre possibilité
          ];
          
          // Vérifier toutes les clés possibles
          let foundToken = null;
          for (const key of possibleKeys) {
            const token = localStorage.getItem(key);
            if (token) {
              console.log(`Token found using key: ${key}`);
              foundToken = token;
              break;
            }
          }
          
          setIsAuthenticated(Boolean(foundToken));
        } catch (error) {
          console.error("Error checking auth:", error);
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      };
      
      checkAuthViaLocalStorage();
    };
    
    checkAuthViaHook();
  }, [auth]);
  
  // Log de débogage
  console.log("Current path:", location.pathname);
  console.log("Authentication status:", isAuthenticated);
  
  // Afficher un indicateur de chargement pendant la vérification
  if (isLoading) {
    return <div className="text-center p-5">Chargement...</div>;
  }

  // Si l'utilisateur n'est pas authentifié, rediriger directement vers la page de connexion
  if (!isAuthenticated) {
    console.log("Access denied: Redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si l'utilisateur est authentifié, afficher le contenu protégé
  console.log("Access granted: Displaying protected content");
  return <Outlet />;
};

export default PrivateRoute;
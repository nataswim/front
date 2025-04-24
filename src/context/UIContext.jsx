// src/context/UIContext.jsx
// Gestion de l'interface utilisateur
// Contexte React pour gérer l'état global et les notifications d'erreur

import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

// Création du contexte UI
const UIContext = createContext();

/**
 * Types de notifications supportés
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Fournisseur de contexte UI
export const UIProvider = ({ children }) => {
  // États de l'interface utilisateur
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('fr');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // Notification globale unique (pour les messages système importants)
  const [globalNotification, setGlobalNotification] = useState(null);

  // Fonctions de gestion de l'interface
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  /**
   * Ajoute une notification avec auto-suppression après un délai
   * @param {Object} notification - Objet de notification
   * @param {string} notification.type - Type de notification (success, error, warning, info)
   * @param {string} notification.message - Message à afficher
   * @param {number} notification.duration - Durée d'affichage en ms (0 pour permanent)
   */
  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-suppression après la durée spécifiée (par défaut 5000ms)
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  }, []);
  
  /**
   * Affiche une notification globale
   * @param {string} message - Message à afficher
   * @param {string} type - Type de notification (success, error, warning, info)
   * @param {number} duration - Durée d'affichage en ms (0 pour permanent)
   */
  const showGlobalNotification = useCallback((message, type = NOTIFICATION_TYPES.INFO, duration = 5000) => {
    setGlobalNotification({
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    });
    
    // Effacer la notification après la durée spécifiée
    if (duration > 0) {
      setTimeout(() => {
        setGlobalNotification(null);
      }, duration);
    }
  }, []);
  
  /**
   * Efface la notification globale
   */
  const clearGlobalNotification = useCallback(() => {
    setGlobalNotification(null);
  }, []);
  
  /**
   * Affiche une notification d'erreur globale
   * @param {string} message - Message d'erreur
   * @param {number} duration - Durée d'affichage en ms
   */
  const showError = useCallback((message, duration = 5000) => {
    showGlobalNotification(message, NOTIFICATION_TYPES.ERROR, duration);
  }, [showGlobalNotification]);
  
  /**
   * Affiche une notification de succès globale
   * @param {string} message - Message de succès
   * @param {number} duration - Durée d'affichage en ms
   */
  const showSuccess = useCallback((message, duration = 5000) => {
    showGlobalNotification(message, NOTIFICATION_TYPES.SUCCESS, duration);
  }, [showGlobalNotification]);
  
  /**
   * Affiche une notification d'avertissement globale
   * @param {string} message - Message d'avertissement
   * @param {number} duration - Durée d'affichage en ms
   */
  const showWarning = useCallback((message, duration = 5000) => {
    showGlobalNotification(message, NOTIFICATION_TYPES.WARNING, duration);
  }, [showGlobalNotification]);
  
  /**
   * Affiche une notification d'information globale
   * @param {string} message - Message d'information
   * @param {number} duration - Durée d'affichage en ms
   */
  const showInfo = useCallback((message, duration = 5000) => {
    showGlobalNotification(message, NOTIFICATION_TYPES.INFO, duration);
  }, [showGlobalNotification]);
  
  /**
   * Gestionnaire pour les événements de connexion/déconnexion réseau
   */
  const handleNetworkChange = useCallback(() => {
    const online = navigator.onLine;
    setIsOffline(!online);
    
    if (!online) {
      showGlobalNotification(
        "Vous êtes hors ligne. Certaines fonctionnalités peuvent ne pas être disponibles.",
        NOTIFICATION_TYPES.WARNING,
        0 // Notification permanente
      );
    } else {
      showGlobalNotification(
        "Connexion internet rétablie.",
        NOTIFICATION_TYPES.SUCCESS,
        3000
      );
    }
  }, [showGlobalNotification]);
  
  // Abonnement aux événements de réseau
  useEffect(() => {
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
    
    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, [handleNetworkChange]);

  // Mémorisation des valeurs du contexte pour optimiser les performances
  const contextValue = useMemo(() => ({
    // États originaux
    isMenuOpen,
    theme,
    language,
    isLoading,
    notifications,
    
    // Nouveaux états
    isOffline,
    globalNotification,
    
    // Méthodes originales
    toggleMenu,
    closeMenu,
    toggleTheme,
    changeLanguage,
    setIsLoading,
    addNotification,
    removeNotification,
    
    // Nouvelles méthodes
    showGlobalNotification,
    clearGlobalNotification,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    NOTIFICATION_TYPES
  }), [
    isMenuOpen, 
    theme, 
    language, 
    isLoading, 
    notifications,
    isOffline,
    globalNotification,
    toggleMenu,
    closeMenu,
    toggleTheme,
    changeLanguage,
    setIsLoading,
    addNotification,
    removeNotification,
    showGlobalNotification,
    clearGlobalNotification,
    showError,
    showSuccess,
    showWarning,
    showInfo
  ]);

  return (
    <UIContext.Provider value={contextValue}>
      {children}
      
      {/* Bannière hors ligne */}
      {isOffline && (
        <div className="offline-banner position-fixed bottom-0 start-0 end-0 bg-warning text-dark p-2 text-center">
          <strong>Vous êtes hors ligne.</strong> Vérifiez votre connexion internet.
        </div>
      )}
    </UIContext.Provider>
  );
};

// Validation des props
UIProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Hook personnalisé pour utiliser le contexte UI
export const useUI = () => {
  const context = useContext(UIContext);
  
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  
  return context;
};

export default UIContext;
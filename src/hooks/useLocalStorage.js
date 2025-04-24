// src/hooks/useLocalStorage.js (créer un hook personnalisé pour gérer les données en localStorage)
// Gestion des données en localStorage avec un hook personnalisé
// Hooks React personnalisés


import { useState, useCallback, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer le stockage localStorage
 * @param {string} key - Clé de stockage dans localStorage
 * @param {*} initialValue - Valeur initiale si aucune valeur n'existe
 * @param {Object} [options={}] - Options de configuration
 */
export const useLocalStorage = (key, initialValue, options = {}) => {
  const {
    // Serialisation personnalisée (par défaut: JSON)
    serialize = JSON.stringify,
    // Désérialisation personnalisée (par défaut: JSON.parse)
    deserialize = JSON.parse,
    // Activer/désactiver le stockage
    enabled = true,
    // Événements de synchronisation entre onglets
    sync = true
  } = options;

  // État pour stocker la valeur
  const [storedValue, setStoredValue] = useState(() => {
    // Ne pas utiliser localStorage si désactivé
    if (!enabled) return initialValue;

    try {
      // Récupérer la valeur depuis localStorage
      const item = window.localStorage.getItem(key);
      
      // Retourner la valeur désérialisée ou la valeur initiale
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.warn(`Erreur lors de la lecture de localStorage pour ${key}:`, error);
      return initialValue;
    }
  });

  // Méthode pour mettre à jour la valeur
  const setValue = useCallback((value) => {
    // Ne pas mettre à jour si localStorage est désactivé
    if (!enabled) return;

    try {
      // Gérer les valeurs calculées à partir de l'état précédent
      const valueToStore = 
        value instanceof Function 
          ? value(storedValue) 
          : value;

      // Mettre à jour l'état local
      setStoredValue(valueToStore);

      // Stocker dans localStorage
      window.localStorage.setItem(key, serialize(valueToStore));

      // Événement de synchronisation entre onglets
      if (sync) {
        window.dispatchEvent(new CustomEvent('local-storage', { 
          detail: { key, value: valueToStore } 
        }));
      }
    } catch (error) {
      console.warn(`Erreur lors de l'écriture dans localStorage pour ${key}:`, error);
    }
  }, [key, serialize, storedValue, enabled, sync]);

  // Supprimer l'élément du localStorage
  const removeValue = useCallback(() => {
    try {
      // Supprimer de localStorage
      window.localStorage.removeItem(key);
      
      // Réinitialiser à la valeur initiale
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Erreur lors de la suppression de ${key} dans localStorage:`, error);
    }
  }, [key, initialValue]);

  // Synchronisation entre les onglets
  useEffect(() => {
    if (!sync) return;

    const handleStorageChange = (event) => {
      // Vérifier que l'événement correspond à notre clé
      if (event.detail && event.detail.key === key) {
        setStoredValue(event.detail.value);
      }
    };

    // Écouter les événements de synchronisation
    window.addEventListener('local-storage', handleStorageChange);

    // Nettoyer l'écouteur
    return () => {
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [key, sync]);

  // Écouter les changements de localStorage depuis d'autres onglets
  useEffect(() => {
    const handleStorageEvent = (event) => {
      // Vérifier que l'événement concerne notre clé
      if (event.key === key) {
        try {
          const newValue = event.newValue 
            ? deserialize(event.newValue) 
            : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Erreur de désérialisation pour ${key}:`, error);
        }
      }
    };

    // Ajouter l'écouteur d'événements de stockage
    window.addEventListener('storage', handleStorageEvent);

    // Nettoyer l'écouteur
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [key, deserialize, initialValue]);

  // Retourner les méthodes et valeurs
  return [
    storedValue,   // Valeur stockée
    setValue,      // Méthode pour mettre à jour
    {
      remove: removeValue,  // Méthode pour supprimer
      key           // Clé de stockage
    }
  ];
};

// Utilitaires de stockage
export const storageUtils = {
  // Vérifier la disponibilité de localStorage
  isAvailable() {
    try {
      const testKey = '__local_storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Nettoyer tous les éléments localStorage
  clear() {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.warn('Erreur lors de la suppression de localStorage:', error);
    }
  },

  // Obtenir toutes les clés
  getKeys() {
    return Object.keys(window.localStorage);
  }
};

export default useLocalStorage;